import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../core/consts';
import { SelectedAcademicYearService } from '../../../../../core/services/selected-academic-year.service';
import { AcademicYearEndpoints } from '../../../shared/endpoints/academic-year-endpoints';
import { AcademicYearModel } from '../../academic-year/model/academic-year-model';
import { AgeGroupEndpoints } from '../../../shared/endpoints/age-group-endpoint';
import { AgeGroupModel } from '../../../shared/endpoints/models/age-group/age-group-model';
import { PromotionEndpoints } from '../../../shared/endpoints/promotion-endpoint';
import { PromotionPreviewResponse, PromotionRow } from '../../../shared/endpoints/models/promotion/promotion-preview-response';
import { PromotionExecuteResponse } from '../../../shared/endpoints/models/promotion/promotion-execute-response';
import { TransferAction } from '../../../../../core/enums/transfer-action';

@Component({
  selector: 'app-promotion-wizard',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
    MatStepperModule,
  ],
  templateUrl: './promotion.html',
  styleUrl: './promotion.scss',
})
export class PromotionWizardPage implements OnInit {
  language = inject(Language);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  fb = inject(FormBuilder);
  academicYearEndpoints = inject(AcademicYearEndpoints);
  ageGroupEndpoints = inject(AgeGroupEndpoints);
  promotionEndpoints = inject(PromotionEndpoints);
  selectedAcademicYearSvc = inject(SelectedAcademicYearService);

  /** Preselects step 1's age group from the shared scope picker in the results center — optional, the user can still change it. */
  @Input() ageGroupId: number | null = null;

  /** The results center hosts Decision/Publish as sibling tabs now, not separate routes — let it switch tabs instead of navigating. */
  @Output() navigateToDecision = new EventEmitter<void>();
  @Output() navigateToPublish = new EventEmitter<void>();

  TransferAction = TransferAction;

  academicYears = signal<AcademicYearModel[]>([]);
  ageGroupItems = signal<AgeGroupModel[]>([]);
  preview = signal<PromotionPreviewResponse | null>(null);
  loading = signal(false);
  executing = signal(false);
  executed = signal(false);
  executeResult = signal<PromotionExecuteResponse | null>(null);
  overrides = signal<Map<number, { targetAgeGroupId: number | null; action: number; note: string }>>(new Map());

  form!: FormGroup;

  get sourceAcademicYearId(): number | null {
    return this.selectedAcademicYearSvc.selectedId();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      targetAcademicYearId: [null],
      ageGroupId: [this.ageGroupId],
    });

    this.academicYearEndpoints.get(1, 100).subscribe({
      next: page => this.academicYears.set(page.content.filter(y => y.id !== this.sourceAcademicYearId)),
    });

    this.ageGroupEndpoints.get('', 1, 100).subscribe({
      next: page => this.ageGroupItems.set(page.content),
    });
  }

  loadPreview(): void {
    if (!this.sourceAcademicYearId) return;
    this.loading.set(true);
    this.overrides.set(new Map());
    this.promotionEndpoints.getPreview(this.sourceAcademicYearId, this.form.value.ageGroupId ?? null).subscribe({
      next: p => {
        this.preview.set(p);
        this.loading.set(false);
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  /** Live promoted/repeated/graduated counts reflecting manual overrides — the server's preview counts don't move as the admin edits rows. */
  effectiveCounts = computed(() => {
    const p = this.preview();
    if (!p) return { promoted: 0, repeated: 0, graduated: 0 };
    let promoted = p.promotedCount;
    let repeated = p.repeatedCount;
    let graduated = p.graduatedCount;
    for (const row of p.rows) {
      const override = this.overrides().get(row.studentId);
      if (!override || override.action === row.action) continue;
      if (row.action === TransferAction.Promoted) promoted--;
      else if (row.action === TransferAction.Repeated) repeated--;
      else if (row.action === TransferAction.Graduated) graduated--;
      if (override.action === TransferAction.Promoted) promoted++;
      else if (override.action === TransferAction.Repeated) repeated++;
      else if (override.action === TransferAction.Graduated) graduated++;
    }
    return { promoted, repeated, graduated };
  });

  rowOverride(row: PromotionRow) {
    return this.overrides().get(row.studentId);
  }

  rowTargetAgeGroupId(row: PromotionRow): number | null {
    return this.rowOverride(row)?.targetAgeGroupId ?? row.targetAgeGroupId;
  }

  /** Switching the action alone used to silently keep whatever target the server originally suggested (e.g. "same grade" for a repeat) — so marking a repeat-suggested student "Promoted" never actually moved them up. Now each action picks a sensible target automatically, and the admin can still correct it via the target select. */
  changeAction(row: PromotionRow, action: number): void {
    const targetAgeGroupId = this.defaultTargetFor(row, action);
    this.overrides.update(map => {
      const next = new Map(map);
      next.set(row.studentId, { targetAgeGroupId, action, note: map.get(row.studentId)?.note ?? '' });
      return next;
    });
  }

  changeTarget(row: PromotionRow, targetAgeGroupId: number | null): void {
    const action = this.rowOverride(row)?.action ?? row.action;
    this.overrides.update(map => {
      const next = new Map(map);
      next.set(row.studentId, { targetAgeGroupId, action, note: map.get(row.studentId)?.note ?? '' });
      return next;
    });
  }

  private defaultTargetFor(row: PromotionRow, action: number): number | null {
    if (action === TransferAction.Graduated) return null;
    if (action === TransferAction.Repeated) return row.currentAgeGroupId;
    return this.nextAgeGroupId(row.currentAgeGroupId) ?? row.targetAgeGroupId;
  }

  private nextAgeGroupId(currentAgeGroupId: number): number | null {
    const items = this.ageGroupItems();
    const current = items.find(g => g.id === currentAgeGroupId);
    if (!current) return null;
    const next = items.filter(g => g.sortOrder > current.sortOrder).sort((a, b) => a.sortOrder - b.sortOrder)[0];
    return next?.id ?? null;
  }

  execute(): void {
    const p = this.preview();
    if (!p || !this.sourceAcademicYearId || !this.form.value.targetAcademicYearId) return;
    this.executing.set(true);
    const overrides = Array.from(this.overrides().entries()).map(([studentId, o]) => ({
      studentId,
      targetAgeGroupId: o.targetAgeGroupId,
      action: o.action,
      note: o.note,
    }));
    this.promotionEndpoints.execute({
      academicYearId: this.sourceAcademicYearId,
      targetAcademicYearId: this.form.value.targetAcademicYearId,
      ageGroupId: this.form.value.ageGroupId ?? null,
      overrides,
    }).subscribe({
      next: response => {
        this.executeResult.set(response);
        this.executed.set(true);
        this.executing.set(false);
        this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.executing.set(false);
      },
    });
  }

  goToDecision(): void {
    this.navigateToDecision.emit();
  }

  goToPublish(): void {
    this.navigateToPublish.emit();
  }

  goCreateAcademicYear(): void {
    this.router.navigate(['/manager/academic-year']);
  }
}
