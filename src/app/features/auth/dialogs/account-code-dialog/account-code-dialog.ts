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
import { successMatSnackbarConfig } from '../../../../core/consts';
import { MessageService } from '../../../../core/services/message-service';

@Component({
  selector: 'app-account-code-dialog',
  imports: [
    MatDialogContent, MatFormField, MatLabel, MatDialogActions,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule
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

  ngOnInit() {

    this.form = this.fb.group({
      phoneNumber: [this.data.phoneNumber],
      code: ['']
    });

    this.accountsEndpoints.get(this.data.id).subscribe({
      next: (res) => {
        console.log("soso")
        this.form.patchValue({code: res.code});
        this.loading.set(false);
      },
      error: () => (this.loading.set(false))
    });
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

}