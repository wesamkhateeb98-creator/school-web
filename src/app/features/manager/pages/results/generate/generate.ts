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
import { GeneratePreviewResponse } from '../../../shared/endpoints/models/results/generate-preview-response';
import { GenerateResponse } from '../../../shared/endpoints/models/results/generate-response';
import { AgeGroupModel } from '../../../shared/endpoints/models/age-group/age-group-model';

const YEAR_SCOPE = 'year';

@Component({
  selector: 'app-generate-results',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
  ],
  templateUrl: './generate.html',
  styleUrl: './generate.scss',
})
export class GenerateResultsPage implements OnInit, OnChanges {
  language = inject(Language);
  matSnackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  semesterEndpoints = inject(SemesterEndpoints);
  resultsEndpoints = inject(ResultsEndpoints);
  selectedAcademicYearSvc = inject(SelectedAcademicYearService);

  /** Shared with the results center — changing it here updates every other tab too. */
  @Input() ageGroupId: number | null = null;
  @Input() ageGroupItems: AgeGroupModel[] = [];
  @Output() ageGroupIdChange = new EventEmitter<number | null>();

  /** The results center hosts Students as a sibling tab — let it switch tabs so the admin can see where the marks landed. */
  @Output() navigateToStudents = new EventEmitter<void>();

  /** Generating results moves the year-scope pipeline stage — tell the results center to refresh its shared bar. */
  @Output() pipelineRefresh = new EventEmitter<void>();

  semesters = signal<GetSemesterByAcademicYearModel[]>([]);
  preview = signal<GeneratePreviewResponse | null>(null);
  lastResult = signal<GenerateResponse | null>(null);
  loading = signal(false);
  generating = signal(false);

  filterForm!: FormGroup;

  semesterLabel = (s: GetSemesterByAcademicYearModel) => `${s.semesterName} — ${s.year}`;

  get isYearScope(): boolean {
    return this.filterForm?.value.scope === YEAR_SCOPE;
  }

  get academicYearId(): number | null {
    return this.selectedAcademicYearSvc.selectedId();
  }

  get academicYearSemesterId(): number | null {
    if (this.isYearScope) return null;
    return this.filterForm.value.scope ?? null;
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      scope: [null],
    });

    this.semesterEndpoints.getSemesterByAcademicYear({
      year: this.selectedAcademicYearSvc.selected()?.year, justStarted: false, PageNumber: 1, pageSize: 50,
    }).subscribe({
      next: page => {
        this.semesters.set(page.content);
        const active = page.content.find(s => s.isActive) ?? page.content[0];
        if (active) {
          this.filterForm.patchValue({ scope: active.academicYearSemesterId }, { emitEvent: false });
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
    this.lastResult.set(null);
    this.reload();
  }

  reload(): void {
    const ageGroupId = this.ageGroupId;
    if (!ageGroupId || !this.academicYearId) {
      this.preview.set(null);
      return;
    }
    this.loading.set(true);
    this.resultsEndpoints.getGeneratePreview(this.academicYearId, ageGroupId, this.academicYearSemesterId).subscribe({
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

  generate(): void {
    const ageGroupId = this.ageGroupId;
    if (!ageGroupId || !this.academicYearId) return;
    this.generating.set(true);
    this.resultsEndpoints.generate(this.academicYearId, ageGroupId, this.academicYearSemesterId).subscribe({
      next: response => {
        this.lastResult.set(response);
        this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
        this.generating.set(false);
        this.reload();
        this.pipelineRefresh.emit();
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.generating.set(false);
      },
    });
  }

  goToStudents(): void {
    this.navigateToStudents.emit();
  }

  onAgeGroupSelect(value: number | null): void {
    this.ageGroupIdChange.emit(value);
  }
}
