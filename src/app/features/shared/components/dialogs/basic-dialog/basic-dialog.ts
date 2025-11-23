import { Component, inject, input, signal, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../../core/services/language';
import { HttpHelper } from '../../../../../core/services/http-helper';

@Component({
  selector: 'app-basic-dialog',
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
  templateUrl: './basic-dialog.html',
  styleUrl: './basic-dialog.scss',
})
export class BasicDialog {
  loading = signal<boolean>(false);

  data = inject(MAT_DIALOG_DATA);

/*
input is :
* title
* subTitle
* actionName
* buttonClass
* action()
*/

  constructor(
    public language:Language,
    public dialogRef:MatDialogRef<BasicDialog>,
    public http:HttpHelper,
    public matSnackBar:MatSnackBar
  ){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  async submit(){
    this.loading.set(true);
    this.data.action()
    this.loading.set(false);
  }
}
