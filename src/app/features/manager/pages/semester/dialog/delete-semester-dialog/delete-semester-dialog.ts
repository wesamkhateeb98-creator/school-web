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
  templateUrl: './delete-semester-dialog.html',
  styleUrl: './delete-semester-dialog.scss',
})
export class DeleteSemesterDialog {
  loading = signal<boolean>(false);

  constructor(
    public language:Language,
    public dialogRef:MatDialogRef<DeleteSemesterDialog>,
  ){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  async deleteSemester(){
    console.log("123");
    this.loading.set(true);
    await new Promise(resolve => setTimeout(resolve, 2000))
    this.loading.set(false);
    console.log("123");
  }

}
