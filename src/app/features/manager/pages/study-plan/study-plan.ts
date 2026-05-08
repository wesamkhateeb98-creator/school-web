import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { Language } from '../../../../core/services/language';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { AgeGroupEndpoints } from '../../shared/endpoints/age-group-endpoint';
import { StudyPlanTitleModel, StudyPlanWeekModel } from '../../shared/endpoints/models/subject/study-plan-week-model';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './study-plan.html',
})
export class StudyPlan implements AfterViewInit {
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
  }

  ngAfterViewInit() {
    this.filterForm.get('semesterId')!.valueChanges.pipe(
      distinctUntilChanged(),
      filter((id): id is number => !!id && +id > 0),
    ).subscribe(id => this.loadStudyPlan(id));
  }

  loadStudyPlan(semesterId?: number) {
    this.loading.set(true);
    const id = semesterId ?? (this.filterForm.value.semesterId as number);

    this.ageGroupEndpoints.getStudyPlan(this.ageGroupId, this.ageGroupSubjectId, id)
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
      if (result?.reload) this.loadStudyPlan(this.filterForm.value.semesterId);
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
