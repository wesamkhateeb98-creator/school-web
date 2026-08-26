import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../core/consts';
import { StudentMarkSheetEndpoints } from '../../../shared/endpoints/student-mark-sheet-endpoint';
import { MarkSheetDetailColumn, MarkSheetDetailResponse } from '../../../shared/endpoints/models/student-mark-sheet/mark-sheet-detail-response';
import { MarkEntryUpsert } from '../../../shared/endpoints/models/student-mark-sheet/mark-entry-upsert';

interface GridRow {
  studentId: number;
  fullName: string;
  cells: Record<number, number | null>;
  total: number | null;
  isComplete: boolean;
  isPassed: boolean | null;
}

type SaveState = 'idle' | 'pending' | 'saving' | 'saved';

@Component({
  selector: 'app-mark-entry-grid',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatTooltipModule],
  templateUrl: './mark-entry-grid.html',
  styleUrl: './mark-entry-grid.scss',
})
export class MarkEntryGridPage implements OnInit, OnDestroy {
  language = inject(Language);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);
  sheetEndpoints = inject(StudentMarkSheetEndpoints);

  sheetId!: number;
  loading = signal(true);
  detail = signal<MarkSheetDetailResponse | null>(null);
  rows = signal<GridRow[]>([]);
  saveState = signal<SaveState>('idle');
  submitting = signal(false);

  private pending = new Map<string, MarkEntryUpsert>();
  private saveTrigger$ = new Subject<void>();

  get canSubmit(): boolean {
    const detail = this.detail();
    return !!detail?.sheet.acceptsEntries && this.rows().every(r => r.isComplete);
  }

  ngOnInit(): void {
    this.sheetId = +(this.route.snapshot.paramMap.get('id') ?? '0');
    this.saveTrigger$.pipe(debounceTime(600)).subscribe(() => this.flushPending());
    this.load();
  }

  ngOnDestroy(): void {
    this.saveTrigger$.complete();
  }

  private load(): void {
    if (this.sheetId <= 0) {
      this.loading.set(false);
      return;
    }
    this.sheetEndpoints.getById(this.sheetId).subscribe({
      next: response => {
        this.detail.set(response);
        this.rows.set(response.rows.map(row => ({
          studentId: row.studentId,
          fullName: row.fullName,
          cells: Object.fromEntries(row.cells.map(c => [c.distributionId, c.value])),
          total: row.total,
          isComplete: row.isComplete,
          isPassed: row.isPassed,
        })));
        this.loading.set(false);
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  cellValue(row: GridRow, column: MarkSheetDetailColumn): number | null {
    return row.cells[column.distributionId] ?? null;
  }

  /** Queues the autosave only — does not rebind the input's value, so a value being typed
   *  (e.g. a trailing decimal point) is never overwritten mid-keystroke. */
  onCellInput(row: GridRow, column: MarkSheetDetailColumn, raw: string): void {
    if (!this.detail()?.sheet.acceptsEntries) return;
    if (raw === '') return;
    const value = Number(raw);
    if (Number.isNaN(value)) return;
    const clamped = Math.min(Math.max(value, 0), column.maxValue);

    this.pending.set(`${row.studentId}:${column.distributionId}`, {
      studentId: row.studentId,
      distributionId: column.distributionId,
      value: clamped,
    });
    this.saveState.set('pending');
    this.saveTrigger$.next();
  }

  /** Commits the clamped value into the bound signal once the user leaves the cell. */
  onCellBlur(row: GridRow, column: MarkSheetDetailColumn, raw: string): void {
    if (!this.detail()?.sheet.acceptsEntries) return;
    if (raw === '') return;
    let value = Number(raw);
    if (Number.isNaN(value)) value = 0;
    value = Math.min(Math.max(value, 0), column.maxValue);

    this.rows.update(rows => rows.map(r =>
      r.studentId === row.studentId ? { ...r, cells: { ...r.cells, [column.distributionId]: value } } : r,
    ));

    this.pending.set(`${row.studentId}:${column.distributionId}`, {
      studentId: row.studentId,
      distributionId: column.distributionId,
      value,
    });
    this.saveState.set('pending');
    this.saveTrigger$.next();
  }

  private flushPending(): void {
    if (this.pending.size === 0) return;
    const entries = Array.from(this.pending.values());
    this.pending.clear();
    this.saveState.set('saving');
    this.sheetEndpoints.saveEntries(this.sheetId, entries).subscribe({
      next: () => this.refreshComputedFields(),
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.saveState.set('idle');
      },
    });
  }

  private refreshComputedFields(): void {
    this.sheetEndpoints.getById(this.sheetId).subscribe({
      next: fresh => {
        const freshRows = new Map(fresh.rows.map(r => [r.studentId, r]));
        this.rows.update(rows => rows.map(r => {
          const f = freshRows.get(r.studentId);
          return f ? { ...r, total: f.total, isComplete: f.isComplete, isPassed: f.isPassed } : r;
        }));
        this.detail.update(d => d ? { ...d, sheet: fresh.sheet, enteredStudentCount: fresh.enteredStudentCount, totalStudentCount: fresh.totalStudentCount } : d);
        this.saveState.set('saved');
      },
      error: () => this.saveState.set('idle'),
    });
  }

  focusCell(r: number, c: number): void {
    const el = document.getElementById(`cell-${r}-${c}`) as HTMLInputElement | null;
    el?.focus();
    el?.select();
  }

  onKeydown(event: KeyboardEvent, r: number, c: number): void {
    switch (event.key) {
      case 'ArrowUp': event.preventDefault(); this.focusCell(r - 1, c); break;
      case 'ArrowDown': event.preventDefault(); this.focusCell(r + 1, c); break;
      case 'ArrowLeft': event.preventDefault(); this.focusCell(r, c - 1); break;
      case 'ArrowRight': event.preventDefault(); this.focusCell(r, c + 1); break;
      case 'Enter': event.preventDefault(); this.focusCell(r + 1, c); break;
    }
  }

  submitSheet(): void {
    if (!this.canSubmit || this.submitting()) return;
    this.submitting.set(true);
    this.sheetEndpoints.submit(this.sheetId).subscribe({
      next: () => {
        this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.goBack();
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.submitting.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/manager/mark-entry']);
  }
}
