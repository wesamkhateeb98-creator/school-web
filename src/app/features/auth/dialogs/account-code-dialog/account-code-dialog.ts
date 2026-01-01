import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { AccountCodeModel } from '../../../manager/endpoints/models/Accounts/account-code-model';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { AccountsEndpoints } from '../../../manager/endpoints/accounts-endpoint';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { Clipboard } from '@angular/cdk/clipboard';
import { Language } from '../../../../core/services/language';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { MessageService } from '../../../../core/services/message-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-account-code-dialog',
  imports: [
    MatDialogContent, MatFormField, MatLabel, MatDialogActions,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './account-code-dialog.html',
  styleUrl: './account-code-dialog.scss',
})
export class AccountCodeDialog implements OnInit {
  loading = signal<boolean>(false);
  form!: FormGroup;
  data = inject(MAT_DIALOG_DATA);
  accountsEndpoints = inject(AccountsEndpoints);
  clipboard = inject(Clipboard);
  dialogRef = inject(MatDialogRef<AccountCodeDialog>);
  language = inject(Language);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  matSnackBar = inject(MatSnackBar);

  existingCode = signal<boolean>(true);

  ngOnInit() {
    this.form = this.fb.group({
      phoneNumber: [this.data.phoneNumber],
      code: ['']
    });

    this.accountsEndpoints.getCode(this.data.id).subscribe({
      next: (res) => {
        
        this.form.patchValue({code: res.code});
        
        this.existingCode.set(true);

        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false)
        if(error.status == 404)
          this.existingCode.set(false);
    }});
  }

  copyToClipboard() {
    const textToCopy = `Phone: ${this.data.phoneNumber}\nCode: ${this.form.value.code}`;
    this.clipboard.copy(textToCopy);
    
    this.matSnackBar.open(
          textToCopy, 
          this.language.transform('close'), 
          successMatSnackbarConfig(this.language)
        );
  }

  SenMessageToWhatsapp() {
    const textToCopy = `Phone: ${this.data.phoneNumber}\nCode: ${this.form.value.code}`;
    
    this.messageService.sendMessageToWhatsapp(this.data.phoneNumber, textToCopy);

    this.matSnackBar.open(
          textToCopy, 
          this.language.transform('close'), 
          successMatSnackbarConfig(this.language)
        );
  }


  async generateCode(){
    this.loading.set(true);
    
    this.accountsEndpoints.generateCode(this.data.id).subscribe({
      next:(success) => {
        
        this.matSnackBar.open(
          this.language.transform("success"), 
          this.language.transform('close'), 
          successMatSnackbarConfig(this.language)
        );
        
        this.form.patchValue({code: success.code});

        this.loading.set(false);

        this.existingCode.set(true);
      },
      error:(err) => {
        this.matSnackBar.open(
                  err.error?.Title || err.message, 
                  this.language.transform('close'), 
                  errorMatSnackbarConfig(this.language)
                );

        this.loading.set(false);
      }
    })
  }
}