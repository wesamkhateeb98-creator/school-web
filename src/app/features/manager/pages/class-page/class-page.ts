import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ClassModel } from '../../endpoints/models/class/class-model';
import { ClassFilterViewModel } from './view-model/class-filter-view-model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ParamsService } from '../../../../core/services/params-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassEndpoints } from '../../endpoints/class-endpoint';
import { debounceTime, filter, firstValueFrom, map, of, startWith, switchMap, tap } from 'rxjs';
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
import { AsyncPipe, DatePipe } from '@angular/common';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { AddClassDialog } from './add-teacher-dialog/add-class-dialog';
import { AcademicYearModel } from '../academic-year/model/academic-year-model';
import { AgeGroupEndpoints } from '../../endpoints/age-group-endpoint';
import { AcademicYearEndpoints } from '../../endpoints/academic-year-endpoints';
import { AgeGroupModel } from '../../endpoints/models/age-group/age-group-model';
import { Page } from '../../../shared/model/page';

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
    DatePipe,
    AsyncPipe
  ],
  templateUrl: './class-page.html',
  styleUrl: './class-page.scss',
})
export class ClassPage implements OnInit{
  classes = signal<ClassModel[]>([]);
  classFilter = signal<ClassFilterViewModel>({
    pageNumber: 1,
    pageSize: 10
  });

  private ageGroupEndpoint = inject(AgeGroupEndpoints);
  private academicYearEndpoint = inject(AcademicYearEndpoints);
  private classEndpoints = inject(ClassEndpoints);
  public language = inject(Language);
  private dialog = inject(MatDialog);
  private params = inject(ParamsService);
  private matSnackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  totalPages = signal<number>(1);
  loading = signal<boolean>(false);

  headerTable: string[] = [
    'ageGroupName',
    'academicYear',
    'section',
    'createdAt',
    'action'
  ];

  form!: FormGroup;

  academicYears$ = of<AcademicYearModel[]>([]);
  ageGroups$ = of<AgeGroupModel[]>([]);
 
  
  async ngOnInit(): Promise<void> {
    this.initiateForm();
    this.setupAutocompletes();
    
    await this.syncFiltersFromUrl();
    
    if(!this.classFilter().academicYear){
      const academicYear = (await firstValueFrom(this.academicYearEndpoint.get(1,1))).content[0];
      this.classFilter.update(f => ({ ...f, academicYear: academicYear }));
      this.form.patchValue({ "academicYearId": academicYear.id, "academicYear":academicYear}, { emitEvent: false });
    }

    this.loadClassViewModel();   
  }
  
  initiateForm() {
    this.form = this.fb.group({
      ageGroupId: [],
      ageGroupName: [],
      ageGroup: [],
      academicYearId: [],
      academicYearName: [],
      academicYear: []
    });
  }

  setFilterToUrl() {
    this.params.setToUrl({
        'pageSize': this.classFilter().pageSize,
        'pageNumber': this.classFilter().pageNumber,
        'ageGroupName': this.classFilter().ageGroup?.name,
        'academicYear': this.classFilter().academicYear?.year
      });
  }


  async syncFiltersFromUrl() {
    const params = this.params.loadGenericFromUrl();
    
    const newClassFilter:ClassFilterViewModel = {
      pageSize: params['pageSize'] ? +params['pageSize'] : 10,
      pageNumber: params['pageNumber'] ? +params['pageNumber'] : 1
    };


    // Handle Academic Year from URL (e.g., ?academicYear=2022)
    if (params['academicYear']) {
      const response = await firstValueFrom(this.academicYearEndpoint.get(1, 1, params['academicYear']));
      if (response.content.length > 0) {
        newClassFilter.academicYear = response.content[0];
        
        this.form.patchValue({ "academicYearId": response.content[0].id, "academicYear":response.content[0]}, { emitEvent: false });
      }
    }

    // Handle Age Group ID from URL
    if (params['ageGroupName']) {
      
      const response = await firstValueFrom(this.ageGroupEndpoint.get(params['ageGroupName'],1, 1));
      if (response.content.length > 0) {
        newClassFilter.ageGroup = response.content[0];
        
        this.form.patchValue({ "ageGroupId": response.content[0].id, "ageGroup":response.content[0]}, { emitEvent: false });
        
      }
    }

    // Update Pagination
    this.classFilter.set(newClassFilter);
  }

  setupAutocompletes() {
    
    this.ageGroups$ = this.form.get('ageGroup')!.valueChanges.pipe(
      startWith(""),
      debounceTime(300),
      switchMap(value => this.ageGroupEndpoint.get((value as AgeGroupModel).name || "" , 1, 20)),
      map(response => response.content)
    );

    // Academic Year Autocomplete Logic
    this.academicYears$ = this.form.get('academicYear')!.valueChanges.pipe(
      startWith(""),
      debounceTime(300),
      switchMap((value) => {
        console.log((value as AcademicYearModel).year);
        return this.academicYearEndpoint.get(1, 20,(value as AcademicYearModel).year);
      }),
      map(response => response.content)
    );
  }
  
  displayAgeGroup(item: AgeGroupModel): string {
    return item?.name || '';
  }

  displayAcademicYear = (item: AcademicYearModel): string => {
      if (!item) return "";
      
      if (item && typeof item === 'object' && item.year) {
        const year = Number(item.year);
        return `${year}/${year + 1}`;
      }

      return item.toString();
  }

  onAcademicYearSelected(event: any) {
    this.classFilter.update(f => ({ ...f, academicYear: event.option.value }));
        
    this.form.patchValue({ "academicYearId": event.option.value.id, "academicYear":event.option.value }, { emitEvent: false });
    
    this.setFilterToUrl(); 
  }

  onAgeGroupSelected(event: any) {
    this.classFilter.update(f => ({ ...f, ageGroup: event.option.value }));

    this.form.patchValue({ ageGroupId: event.option.value.id });
    
    this.setFilterToUrl()
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
      maxWidth: "80vw",
      autoFocus:false
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
      autoFocus:false,
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
