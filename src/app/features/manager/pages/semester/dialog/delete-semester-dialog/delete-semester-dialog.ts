import { Component, inject, signal, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Language } from '../../../../../../core/services/language';
import { HttpHelper } from '../../../../../../core/services/http-helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MutateResponse } from '../../../../view-model/mutate-response';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../../core/consts';

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

  data = inject(MAT_DIALOG_DATA);

  constructor(
    public language:Language,
    public dialogRef:MatDialogRef<DeleteSemesterDialog>,
    public http:HttpHelper,
    public matSnackBar:MatSnackBar
  ){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  async deleteSemester(){
    this.loading.set(true);

    this.http.delete<MutateResponse>("semester/"+this.data.id).subscribe({
      next: (success) => {
        this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig);
        this.data.removeItem(this.data.id);
        this.dialogRef.close();
      },
      error: (error) => {
        this.matSnackBar.open(error.error.Title, this.language.transform('close'), errorMatSnackbarConfig);
      }
    });

    this.loading.set(false);
  }

}
