import { Component, signal, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Language } from '../../../../../../core/services/language';

@Component({
  selector: 'app-delete-academic-year',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ],
  templateUrl: './delete-academic-year.html',
  styleUrl: './delete-academic-year.scss',
})
export class DeleteAcademicYear {
  loading = signal<boolean>(false);

  constructor(
    public language:Language,
    public dialogRef:MatDialogRef<DeleteAcademicYear>,
  ){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  async addAcademicYear(){
    console.log("123");
    this.loading.set(true);
    await new Promise(resolve => setTimeout(resolve, 2000))
    this.loading.set(false);
    console.log("123");
  }

}
