import { Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig } from '../../../../../core/consts';
import { SelectedAcademicYearService } from '../../../../../core/services/selected-academic-year.service';
import { AgeGroupEndpoints } from '../../../shared/endpoints/age-group-endpoint';
import { AgeGroupModel } from '../../../shared/endpoints/models/age-group/age-group-model';
import { ResultsEndpoints } from '../../../shared/endpoints/results-endpoint';
import { PipelineResponse } from '../../../shared/endpoints/models/results/pipeline-response';
import { PipelineStageBarComponent } from '../components/pipeline-stage-bar/pipeline-stage-bar';
import { ConfirmReopenPage } from '../confirm-reopen/confirm-reopen';
import { GenerateResultsPage } from '../generate/generate';
import { DecisionPage } from '../decision/decision';
import { PublishResultsPage } from '../publish/publish';
import { PromotionWizardPage } from '../promotion/promotion';

export const TAB_CONFIRM = 0;
export const TAB_GENERATE = 1;
export const TAB_DECISION = 2;
export const TAB_PUBLISH = 3;
export const TAB_PROMOTION = 4;

const TAB_BY_NAME: Record<string, number> = {
  'confirm-reopen': TAB_CONFIRM,
  generate: TAB_GENERATE,
  decision: TAB_DECISION,
  publish: TAB_PUBLISH,
  promotion: TAB_PROMOTION,
};

@Component({
  selector: 'app-results-center',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatTabsModule,
    PipelineStageBarComponent,
    ConfirmReopenPage,
    GenerateResultsPage,
    DecisionPage,
    PublishResultsPage,
    PromotionWizardPage,
  ],
  templateUrl: './results-center.html',
  styleUrl: './results-center.scss',
})
export class ResultsCenterPage {
  language = inject(Language);
  route = inject(ActivatedRoute);
  router = inject(Router);
  matSnackBar = inject(MatSnackBar);
  ageGroupEndpoints = inject(AgeGroupEndpoints);
  resultsEndpoints = inject(ResultsEndpoints);
  selectedAcademicYearSvc = inject(SelectedAcademicYearService);

  selectedTabIndex = signal(0);
  ageGroupItems = signal<AgeGroupModel[]>([]);

  /** Shared across every tab so picking a grade once applies everywhere — switching tabs no longer resets it. */
  ageGroupId = signal<number | null>(null);

  /** Year-scope pipeline for the selected grade — the one overview every tab below cares about. */
  pipeline = signal<PipelineResponse | null>(null);

  get academicYearId(): number | null {
    return this.selectedAcademicYearSvc.selectedId();
  }

  constructor() {
    const urlAgeGroupId = this.route.snapshot.queryParams['ageGroupId'];
    if (urlAgeGroupId) this.ageGroupId.set(+urlAgeGroupId);

    /** Coming back from the student-detail/transfer-log pages should land on the tab you left from, not always the first one. */
    const urlTab = this.route.snapshot.queryParams['tab'];
    if (urlTab && urlTab in TAB_BY_NAME) this.selectedTabIndex.set(TAB_BY_NAME[urlTab]);

    this.ageGroupEndpoints.get('', 1, 100).subscribe({
      next: page => this.ageGroupItems.set(page.content),
    });

    if (urlAgeGroupId) this.loadPipeline();
  }

  onAgeGroupChange(value: number | null): void {
    this.ageGroupId.set(value);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ageGroupId: value ?? null },
      queryParamsHandling: 'merge',
    });
    this.loadPipeline();
  }

  goToTab(index: number): void {
    this.selectedTabIndex.set(index);
  }

  loadPipeline(): void {
    const ageGroupId = this.ageGroupId();
    if (!ageGroupId || !this.academicYearId) {
      this.pipeline.set(null);
      return;
    }
    this.resultsEndpoints.getPipeline(this.academicYearId, ageGroupId, null).subscribe({
      next: p => this.pipeline.set(p),
      error: err => this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language)),
    });
  }
}
