import { Component, effect, signal } from '@angular/core';
import { ClassModel } from '../../endpoints/models/class/class-model';
import { ClassFilterViewModel } from './view-model/class-filter-view-model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ParamsService } from '../../../../core/services/params-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassEndpoints } from '../../endpoints/class-endpoint';
import { debounceTime } from 'rxjs';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { AddClassDialog } from './add-teacher-dialog/add-class-dialog';

@Component({
  selector: 'app-class-page',
  imports: [
    MatProgressBarModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatGridList,
    MatGridTile,
    MatAutocompleteModule,
    DatePipe
  ],
  templateUrl: './class-page.html',
  styleUrl: './class-page.scss',
})
export class ClassPage {
  classes = signal<ClassModel[]>([]);
  classFilter = signal<ClassFilterViewModel>({
    pageNumber: 1,
    pageSize: 10
  });

  totalPages = signal<number>(1);
  loading = signal<boolean>(false);

  // Aligned with the ClassModel keys from API
  headerTable: string[] = [
    'ageGroupName',
    'academicYear',
    'section',
    'createdAt',
    'action'
  ];

  form!: FormGroup;

  constructor(
    public language: Language,
    public dialog: MatDialog,
    public params: ParamsService,
    public matSnackBar: MatSnackBar,
    public classEndpoints: ClassEndpoints,
    public fb: FormBuilder,
  ) {
    this.setFilterFromUrl();
    this.initiateForm();
    this.loadClassViewModel();
  }

  setFilterFromUrl() {
    this.classFilter.update(x => {
      const param = this.params.loadGenericFromUrl();
      x.pageSize = param['pageSize'] ? +param['pageSize'] : 10;
      x.pageNumber = param['pageNumber'] ? +param['pageNumber'] : 1;
      x.ageGroupId = param['ageGroupId'] ? +param['ageGroupId'] : undefined;
      x.academicYearId = param['academicYearId'] ? +param['academicYearId'] : undefined;
      return x;
    });

    effect(() => {
      this.params.setToUrl({
        'pageSize': this.classFilter().pageSize,
        'pageNumber': this.classFilter().pageNumber,
        'ageGroupId': this.classFilter().ageGroupId,
        'academicYearId': this.classFilter().academicYearId
      });
    });
  }

  initiateForm() {
    this.form = this.fb.group({
      ageGroupId: [this.classFilter().ageGroupId ?? ''],
      academicYearId: [this.classFilter().academicYearId ?? '']
    });

    this.form.valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.classFilter.update(prev => ({
        ...prev,
        ageGroupId: value.ageGroupId || undefined,
        academicYearId: value.academicYearId || undefined,
        pageNumber: 1 // Reset to page 1 on filter change
      }));
      this.loadClassViewModel();
    });
  }

  loadClassViewModel() {
    this.loading.set(true);
    this.classEndpoints.get(this.classFilter()).subscribe({
      next: (success) => {
        this.totalPages.set(success.countPages);
        this.classes.set(success.content);
        this.loading.set(false);
      },
      error: (error) => {
        this.matSnackBar.open(error.error?.Title || "Error", this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddClassDialog, {
      width: "80vw",
      maxWidth: "80vw"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.data) {
        this.loadClassViewModel(); // Refresh to get formatted data from server
      }
    });
  }

  openUpdateDialog(item: ClassModel) {
    const dialogRef = this.dialog.open(AddClassDialog, {
      width: "80vw",
      maxWidth: "80vw",
      data: { classData: item }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadClassViewModel();
    });
  }

  openDeleteDialog(id: number) {
    const dialogRef = this.dialog.open(DeleteDialog, {
      width: "400px",
      data: {
        title: this.language.transform('delete_class_confirm'),
        action: () => {
          this.classEndpoints.delete(id).subscribe({
            next: () => {
              dialogRef.close();
              this.classes.update(x => x.filter(item => item.id !== id));
              this.matSnackBar.open("Deleted Successfully", this.language.transform('close'), successMatSnackbarConfig(this.language));
            },
            error: (err) => this.matSnackBar.open(err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language))
          });
        }
      }
    });
  }

  changeInPage(pageEvent: PageEvent) {
    this.classFilter.update(x => ({
      ...x,
      pageSize: pageEvent.pageSize,
      pageNumber: pageEvent.pageIndex + 1
    }));
    this.loadClassViewModel();
  }
}
