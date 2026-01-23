import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { errorMatSnackbarConfig } from '../../../../core/consts';
import { ClassEndpoints } from '../../shared/endpoints/class-endpoint';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassByIdModel } from '../../shared/endpoints/models/class/class-by-id-model';
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { ResponsiveScreen } from '../../../../core/services/responsive-screen';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-class-page',
  imports: [
    MatProgressBarModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatProgressSpinner
],
  templateUrl: './class-info-page.html',
})
export class ClassInfoPage implements OnInit{
  
  // ======================================== INJECTION ========================================
  language = inject(Language);
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  router = inject(Router);
  matSnackBar = inject(MatSnackBar);
  classEndpoints = inject(ClassEndpoints);
  fb = inject(FormBuilder);
  response = inject(ResponsiveScreen);

  // ======================================== INPUT PARAMETERS ========================================
  classId!:number;
  classInfo!:ClassByIdModel
  loading = signal<boolean>(true);
  
  // ======================================== Inite ========================================

  ngOnInit() {
    this.classId = +(this.route.snapshot.paramMap.get('id')??'0');
    
    this.loadClassViewModel();   
  }

  loadClassViewModel() {
    this.loading.set(true);
    this.classEndpoints.getByIdClassForAdmin(this.classId).subscribe({
      next: (success) => {
        this.classInfo = success;
        this.loading.set(false);
      },
      error: (error) => {
        this.matSnackBar.open(error.message || "Error", this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      }
    });
  }

  // #################### Navigation ##################

  openClassesPage(){
    this.router.navigate(['manager','classes'])
  }

  openClassSchedulePage() {
    this.router.navigate(['manager','class',this.classId,'class-schedules'])
  }

  operClassStudentPage(){
    this.router.navigate(['manager','class',this.classId,'students'])
  }
}
