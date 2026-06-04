import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Language } from '../../../../../../core/services/language';
import { SubjectMarkDistributionModel } from '../../../../shared/endpoints/models/age-group/subject-mark-distribution-model';
import { MarkTableRow } from '../../model/mark-table-row';

export interface EditCellEvent {
  studentId: number;
  distributionId: number;
  enteredValue: number | null;
  maxValue: number;
  distributionName: string;
}

@Component({
  selector: 'app-mark-sheet-table',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mark-sheet-table.html',
})
export class MarkSheetTableComponent implements OnChanges {
  language = inject(Language);

  @Input() rows: MarkTableRow[]                          = [];
  @Input() distributions: SubjectMarkDistributionModel[] = [];
  @Input() maxGrade  = 0;
  @Input() canEdit   = true;
  @Input() canDelete = true;

  @Output() deleteRow = new EventEmitter<MarkTableRow>();
  @Output() editCell  = new EventEmitter<EditCellEvent>();

  displayedColumns: string[] = [];

  ngOnChanges() {
    const cw = this.courseworkDists();
    const fe = this.finalExamDists();

    this.displayedColumns = [
      'studentName',
      ...cw.map(d => `dist_${d.id}`),
      ...(cw.length ? ['courseworkAvg'] : []),
      ...fe.map(d => `dist_${d.id}`),
      ...(fe.length ? ['finalExamAvg'] : []),
      'totalAvg',
      'action',
    ];
  }

  courseworkDists(): SubjectMarkDistributionModel[] {
    return this.distributions.filter(d => d.markType === 1);
  }

  finalExamDists(): SubjectMarkDistributionModel[] {
    return this.distributions.filter(d => d.markType === 2);
  }

  sortedDistributions(): SubjectMarkDistributionModel[] {
    return [...this.distributions].sort((a, b) => a.markType - b.markType);
  }

  columnHeader(dist: SubjectMarkDistributionModel): string {
    const typeName = dist.markType === 1
      ? this.language.transform('coursework_title')
      : this.language.transform('final_exam_title');
    const max = +(dist.percentage * this.maxGrade).toFixed(2);
    return `${dist.name} — ${typeName} — ${max}`;
  }

  isCellEditable(row: MarkTableRow, distId: number): boolean {
    return !!row.cellMap[distId]?.markEntryId;
  }

  onCellClick(row: MarkTableRow, dist: SubjectMarkDistributionModel) {
    if (!this.isCellEditable(row, dist.id)) return;
    const cell = row.cellMap[dist.id];
    this.editCell.emit({
      studentId:        row.studentId,
      distributionId:   dist.id,
      enteredValue:     cell.enteredValue,
      maxValue:         +(dist.percentage * this.maxGrade).toFixed(2),
      distributionName: dist.name,
    });
  }

  // ── Per-row sums ────────────────────────────────────────────────────────

  courseworkSum(row: MarkTableRow): string {
    return this.computeSum(this.courseworkDists(), row);
  }

  finalExamSum(row: MarkTableRow): string {
    return this.computeSum(this.finalExamDists(), row);
  }

  totalSum(row: MarkTableRow): string {
    const cw = this.numericSum(this.courseworkDists(), row);
    const fe = this.numericSum(this.finalExamDists(), row);
    if (cw === null && fe === null) return '—';
    return ((cw ?? 0) + (fe ?? 0)).toFixed(2);
  }

  private computeSum(dists: SubjectMarkDistributionModel[], row: MarkTableRow): string {
    const val = this.numericSum(dists, row);
    return val !== null ? val.toFixed(2) : '—';
  }

  private numericSum(dists: SubjectMarkDistributionModel[], row: MarkTableRow): number | null {
    if (!dists.length) return null;
    const entered = dists
      .map(d => row.cellMap[d.id]?.enteredValue)
      .filter((v): v is number => v !== null && v !== undefined);
    if (!entered.length) return null;
    return entered.reduce((a, b) => a + b, 0);
  }

  // ── Max-grade sums for column headers ───────────────────────────────────

  courseworkMaxSum(): number {
    return +this.courseworkDists()
      .reduce((acc, d) => acc + d.percentage * this.maxGrade, 0)
      .toFixed(2);
  }

  finalExamMaxSum(): number {
    return +this.finalExamDists()
      .reduce((acc, d) => acc + d.percentage * this.maxGrade, 0)
      .toFixed(2);
  }

  grandMaxSum(): number {
    return +(this.courseworkMaxSum() + this.finalExamMaxSum()).toFixed(2);
  }
}
