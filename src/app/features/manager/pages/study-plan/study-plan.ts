import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { Language } from '../../../../core/services/language';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { AgeGroupEndpoints } from '../../shared/endpoints/age-group-endpoint';
import { StudyPlanTitleModel, StudyPlanWeekModel } from '../../shared/endpoints/models/subject/study-plan-week-model';
import { GetSemesterByAcademicYearModel } from '../../shared/endpoints/models/semester/getSemesterByAcademicYearModel';
import { AcademicYearSemesterAutoComplete } from '../../shared/components/academic-year-semester-auto-complete/academic-year-semester-auto-complete';
import { AddStudyPlanDialog } from './dialog/add-study-plan-dialog/add-study-plan-dialog';
import { EditStudyPlanDialog } from './dialog/edit-study-plan-dialog/edit-study-plan-dialog';

@Component({
  selector: 'app-study-plan',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AcademicYearSemesterAutoComplete,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './study-plan.html',
})
export class StudyPlan {
  language     = inject(Language);
  dialog       = inject(MatDialog);
  matSnackBar  = inject(MatSnackBar);
  route        = inject(ActivatedRoute);
  router       = inject(Router);
  fb           = inject(FormBuilder);
  ageGroupEndpoints = inject(AgeGroupEndpoints);

  loading             = signal<boolean>(false);
  weeks               = signal<StudyPlanWeekModel[]>([]);
  ageGroupId          = 0;
  ageGroupSubjectId   = 0;
  filterForm!: FormGroup;

  ngOnInit() {
    this.ageGroupId        = +(this.route.snapshot.paramMap.get('ageGroupId') ?? '0');
    this.ageGroupSubjectId = +(this.route.snapshot.paramMap.get('subject')    ?? '0');
    this.filterForm = this.fb.group({});

    // Subscribing directly to a control's own valueChanges only works once that control
    // exists — but the picker adds "semester"/"semesterId" to this group asynchronously
    // (ngOnInit of a child component, after an HTTP round trip), so a hook like
    // ngAfterViewInit that fires once at startup can end up wiring up nothing yet, or racing
    // the control's creation. The group's own valueChanges exists from the very first line
    // above and re-fires on every addControl/patchValue inside it, so it always catches the
    // eventual semester selection regardless of when the child resolves it.
    this.filterForm.valueChanges.pipe(
      map(() => this.filterForm.value.semester as GetSemesterByAcademicYearModel | null),
      filter((semester): semester is GetSemesterByAcademicYearModel => !!semester),
      distinctUntilChanged((a, b) => a.semesterId === b.semesterId),
    ).subscribe(() => this.loadStudyPlan());
  }

  /** The "semesterId" control actually holds academicYearSemesterId (the per-year assignment)
   * — the study-plan endpoints need the semester template's own id instead, which only lives
   * on the full "semester" object the picker also stores. */
  loadStudyPlan() {
    const semester = this.filterForm.value.semester as GetSemesterByAcademicYearModel | null;
    if (!semester) return;
    this.loading.set(true);

    this.ageGroupEndpoints.getStudyPlan(this.ageGroupId, this.ageGroupSubjectId, semester.semesterId)
      .subscribe({
        next: weeks => {
          this.weeks.set(weeks);
          this.loading.set(false);
        },
        error: error => {
          this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
          this.loading.set(false);
        }
      });
  }

  openAddDialog() {
    const ref = this.dialog.open(AddStudyPlanDialog, {
      width: '60%',
      data: { ageGroupId: this.ageGroupId, ageGroupSubjectId: this.ageGroupSubjectId }
    });

    ref.afterClosed().subscribe(result => {
      if (result?.reload) this.loadStudyPlan();
    });
  }

  openEditDialog(title: StudyPlanTitleModel) {
    const ref = this.dialog.open(EditStudyPlanDialog, {
      width: '40%',
      data: {
        ageGroupId:        this.ageGroupId,
        ageGroupSubjectId: this.ageGroupSubjectId,
        studyPlanId:       title.id,
        currentTitle:      title.title,
      }
    });

    ref.afterClosed().subscribe((result: { studyPlanId: number; newTitle: string } | undefined) => {
      if (!result) return;
      this.weeks.update(list =>
        list.map(week => ({
          ...week,
          titles: week.titles.map(t =>
            t.id === result.studyPlanId ? { ...t, title: result.newTitle } : t
          )
        }))
      );
    });
  }

  openDeleteDialog(title: StudyPlanTitleModel) {
    const ref = this.dialog.open(DeleteDialog, {
      width: '40%',
      data: {
        title: this.language.transform('delete_study_plan'),
        action: () => {
          this.ageGroupEndpoints
            .deleteStudyPlan(this.ageGroupId, this.ageGroupSubjectId, title.id)
            .subscribe({
              next: () => {
                ref.close();
                this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
                this.weeks.update(list =>
                  list
                    .map(week => ({ ...week, titles: week.titles.filter(t => t.id !== title.id) }))
                    .filter(week => week.titles.length > 0)
                );
              },
              error: error => {
                this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
              }
            });
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['manager/age-group', this.ageGroupId, 'subject']);
  }
}
