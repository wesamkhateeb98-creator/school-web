import { DecimalPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { Language } from '../../../../core/services/language';
import { ParamsService } from '../../../../core/services/params-service';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { SubjectMarkDistributionEndpoints } from '../../shared/endpoints/subject-mark-distribution-endpoint';
import { SubjectMarkDistributionModel } from '../../shared/endpoints/models/age-group/subject-mark-distribution-model';
import { SubjectMarkDistributionFilterViewModel } from '../age-group-subject/model/subject-mark-distribution-filter-view-model';
import { AddMarkDistributionDialog } from '../age-group-subject/dialog/add-mark-distribution-dialog/add-mark-distribution-dialog';

@Component({
  selector: 'app-subject-mark-distribution',
  imports: [
    MatTableModule,
    DecimalPipe,
    MatPaginatorModule,
    MatCard,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './subject-mark-distribution.html',
})
export class SubjectMarkDistributionPage {
  subjectAgeGroupId!: number;
  ageGroupId!: number;

  records        = signal<SubjectMarkDistributionModel[]>([]);
  headerTable    : string[] = ['name', 'grade', 'markType', 'action'];
  loading        = signal<boolean>(false);
  maxGrade       = signal<number>(0);
  totalEnteredGrade = signal<number>(0);

  filter = signal<SubjectMarkDistributionFilterViewModel>({
    pageNumber: 1,
    pageSize: 10,
  });
  totalPages = signal<number>(1);

  constructor(
    public language: Language,
    public dialog: MatDialog,
    route: ActivatedRoute,
    public router: Router,
    public matSnackBar: MatSnackBar,
    public params: ParamsService,
    public endpoint: SubjectMarkDistributionEndpoints
  ) {
    this.ageGroupId         = +(route.snapshot.paramMap.get('ageGroupId') ?? '0');
    this.subjectAgeGroupId  = +(route.snapshot.paramMap.get('subject')    ?? '0');

    this.filter.update((x) => {
      const param = params.loadFromUrl<SubjectMarkDistributionFilterViewModel>(this.filter());
      x.pageSize   = param.pageSize   ? param.pageSize   : 10;
      x.pageNumber = param.pageNumber ? param.pageNumber : 1;
      return x;
    });

    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.endpoint
      .get(this.subjectAgeGroupId, this.filter().pageNumber, this.filter().pageSize)
      .subscribe({
        next: (success) => {
          this.totalPages.set(success.countPages);
          this.records.set(success.content);
          this.maxGrade.set(success.maxGrade);
          this.totalEnteredGrade.set(success.totalEnteredGrade);
          this.loading.set(false);
        },
        error: (error) => {
          this.matSnackBar.open(
            error.error?.Title ?? error.message,
            this.language.transform('close'),
            errorMatSnackbarConfig(this.language)
          );
          this.loading.set(false);
        },
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddMarkDistributionDialog, {
      width: '80%',
      data: {
        subjectAgeGroupId : this.subjectAgeGroupId,
        maxGrade          : this.maxGrade(),
        totalEnteredGrade : this.totalEnteredGrade(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.records.update((arr) => [result.data, ...arr]);
      // grade المضافة = percentage × maxGrade
      this.totalEnteredGrade.update((v) => v + result.data.percentage * this.maxGrade());
    });
  }

  openEditDialog(record: SubjectMarkDistributionModel): void {
    const dialogRef = this.dialog.open(AddMarkDistributionDialog, {
      width: '80%',
      data: {
        subjectAgeGroupId : this.subjectAgeGroupId,
        maxGrade          : this.maxGrade(),
        totalEnteredGrade : this.totalEnteredGrade(),
        record,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const oldGrade = record.percentage      * this.maxGrade();
      const newGrade = result.data.percentage * this.maxGrade();
      this.records.update((arr) =>
        arr.map((x) => (x.id === result.data.id ? result.data : x))
      );
      this.totalEnteredGrade.update((v) => v - oldGrade + newGrade);
    });
  }

  openDeleteDialog(record: SubjectMarkDistributionModel): void {
    const dialogRef = this.dialog.open(DeleteDialog, {
      width: '80%',
      data: {
        title : this.language.transform('delete_mark_distribution'),
        action: () => {
          this.endpoint.delete(record.id).subscribe({
            next: () => {
              dialogRef.close();
              this.records.update((arr) => arr.filter((x) => x.id !== record.id));
              this.totalEnteredGrade.update(
                (v) => v - record.percentage * this.maxGrade()
              );
              this.matSnackBar.open(
                this.language.transform('success'),
                this.language.transform('close'),
                successMatSnackbarConfig(this.language)
              );
            },
            error: (error) => {
              this.matSnackBar.open(
                error.error?.Title ?? error.message,
                this.language.transform('close'),
                errorMatSnackbarConfig(this.language)
              );
            },
          });
        },
      },
    });
  }

  changeInPage(pageEvent: PageEvent): void {
    this.filter.update((x) => {
      x.pageSize   = pageEvent.pageSize;
      x.pageNumber = pageEvent.pageIndex + 1;
      return x;
    });
    this.load();
    this.params.setToUrl({
      pageSize  : this.filter().pageSize,
      pageNumber: this.filter().pageNumber,
    });
  }

  /** العلامة الفعلية للسجل = percentage × maxGrade */
  recordGrade(record: SubjectMarkDistributionModel): number {
    return +(record.percentage * this.maxGrade()).toFixed(4);
  }

  markTypeName(markType: number): string {
    return markType === 1
      ? this.language.transform('coursework_title')
      : this.language.transform('final_exam_title');
  }

  get remaining(): number {
    return +(this.maxGrade() - this.totalEnteredGrade()).toFixed(4);
  }

  goBack(): void {
    this.router.navigate(['manager/age-group', this.ageGroupId, 'subject']);
  }
}
