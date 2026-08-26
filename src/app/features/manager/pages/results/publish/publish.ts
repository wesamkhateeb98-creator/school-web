import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../core/consts';
import { SelectedAcademicYearService } from '../../../../../core/services/selected-academic-year.service';
import { SemesterEndpoints } from '../../../shared/endpoints/semester-endpoints';
import { GetSemesterByAcademicYearModel } from '../../../shared/endpoints/models/semester/getSemesterByAcademicYearModel';
import { ResultsEndpoints } from '../../../shared/endpoints/results-endpoint';
import { PublishPreviewResponse } from '../../../shared/endpoints/models/results/publish-preview-response';
import { MatDialog } from '@angular/material/dialog';
import { ActionConfirmDialog } from '../components/action-confirm-dialog/action-confirm-dialog';
import { AgeGroupModel } from '../../../shared/endpoints/models/age-group/age-group-model';

@Component({
  selector: 'app-publish-results',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
  ],
  templateUrl: './publish.html',
  styleUrl: './publish.scss',
})
export class PublishResultsPage implements OnInit, OnChanges {
  language = inject(Language);
  matSnackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  semesterEndpoints = inject(SemesterEndpoints);
  resultsEndpoints = inject(ResultsEndpoints);
  selectedAcademicYearSvc = inject(SelectedAcademicYearService);
  dialog = inject(MatDialog);

  /** Shared with the results center — changing it here updates every other tab too. */
  @Input() ageGroupId: number | null = null;
  @Input() ageGroupItems: AgeGroupModel[] = [];
  @Output() ageGroupIdChange = new EventEmitter<number | null>();

  /** Publishing moves the year-scope pipeline stage — tell the results center to refresh its shared bar. */
  @Output() pipelineRefresh = new EventEmitter<void>();

  semesters = signal<GetSemesterByAcademicYearModel[]>([]);
  preview = signal<PublishPreviewResponse | null>(null);
  loading = signal(false);
  publishing = signal(false);

  filterForm!: FormGroup;

  semesterLabel = (s: GetSemesterByAcademicYearModel) => `${s.semesterName} — ${s.year}`;

  get academicYearId(): number | null {
    return this.selectedAcademicYearSvc.selectedId();
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      semesterId: [null],
    });

    this.semesterEndpoints.getSemesterByAcademicYear({
      year: this.selectedAcademicYearSvc.selected()?.year, justStarted: false, PageNumber: 1, pageSize: 50,
    }).subscribe({
      next: page => {
        this.semesters.set(page.content);
        const active = page.content.find(s => s.isActive) ?? page.content[0];
        if (active) {
          this.filterForm.patchValue({ semesterId: active.academicYearSemesterId }, { emitEvent: false });
          if (this.ageGroupId) this.reload();
        }
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ageGroupId'] && !changes['ageGroupId'].firstChange && this.filterForm) {
      this.onFilterChange();
    }
  }

  onFilterChange(): void {
    this.reload();
  }

  onAgeGroupSelect(value: number | null): void {
    this.ageGroupIdChange.emit(value);
  }

  reload(): void {
    const { semesterId } = this.filterForm.value;
    const ageGroupId = this.ageGroupId;
    if (!ageGroupId || !semesterId || !this.academicYearId) {
      this.preview.set(null);
      return;
    }
    this.loading.set(true);
    this.resultsEndpoints.getPublishPreview(this.academicYearId, ageGroupId, semesterId).subscribe({
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

  confirmPublish(): void {
    const { semesterId } = this.filterForm.value;
    const ageGroupId = this.ageGroupId;
    if (!ageGroupId || !semesterId || !this.academicYearId) return;
    const ref = this.dialog.open(ActionConfirmDialog, {
      width: '40%',
      data: {
        title: 'publish_results_title',
        message: 'publish_readonly_warning',
        confirmLabel: 'publish_results_title',
        action: () => {
          this.publishing.set(true);
          this.resultsEndpoints.publish(this.academicYearId!, ageGroupId, semesterId).subscribe({
            next: () => {
              this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
              this.publishing.set(false);
              ref.close();
              this.reload();
              this.pipelineRefresh.emit();
            },
            error: err => {
              this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
              this.publishing.set(false);
            },
          });
        },
      },
    });
  }
}
