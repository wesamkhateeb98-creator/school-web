import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from "@angular/material/select"; // Added for permissions
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Language } from '../../../../../core/services/language';
import { AdministrativeStaffEndpoints } from '../../../endpoints/administrative-staff-endpoint';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../../core/consts';
import { AdministrativeStaffViewModel } from '../view-model/administrative-staff-view-model';
import { AddAdministrativeStaffViewModel } from '../view-model/add-administrative-staff-view-model';
import { PermissionService } from '../../../../../core/enums/service/permission-service';

@Component({
  selector: 'app-add-administrative-staff-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatDialogContent, MatGridList, MatDialogActions, MatDialogTitle,
    MatGridTile, MatProgressBar, MatSelectModule,
    MatDatepickerModule, MatButtonModule
  ],
  templateUrl: './add-administrative-staff-dialog.html',
  styleUrl: './add-administrative-staff-dialog.scss',
  providers: [provideNativeDateAdapter()]
})
export class AddAdministrativeStaffDialog implements OnInit {
  private fb = inject(FormBuilder);
  private staffEndpoint = inject(AdministrativeStaffEndpoints);
  private dialogRef = inject(MatDialogRef<AddAdministrativeStaffDialog>);
  private data = inject(MAT_DIALOG_DATA);
  public language = inject(Language);
  public matSnackBar = inject(MatSnackBar);
  public permissionService = inject(PermissionService);


  loading = signal<boolean>(false);
  form!: FormGroup;
  key: string = crypto.randomUUID();


  ngOnInit() {
    this.initiateForm();
  }

  initiateForm() {
    const staff = this.data?.staff;
    this.form = this.fb.group({
      fullName: [staff?.fullName || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      phoneNumber: [staff?.phoneNumber || '', [Validators.required, Validators.pattern(/^\d{7,10}$/)]],
      permissions: [staff?.permissions || [], [Validators.required]] // Added permissions
    });
  }

  isUpdate(): boolean {
    return !!(this.data && this.data.staff);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.invalid) return;

    this.loading.set(true);

    const payload = new AddAdministrativeStaffViewModel(
      this.form.value.fullName,
      this.form.value.phoneNumber,
      this.form.value.permissions
    );

    const obs = this.isUpdate() 
      ? this.staffEndpoint.update(this.data.staff.id, payload)
      : this.staffEndpoint.add(this.key, payload);

    obs.subscribe({
      next: (success) => {
        this.matSnackBar.open(
          this.language.transform("success"), 
          this.language.transform('close'), 
          successMatSnackbarConfig(this.language)
        );
        
        const resultData = new AdministrativeStaffViewModel(
          success.id,
          payload.fullName,
          payload.phoneNumber,
          new Date(), 
          payload.permissions
        );

        this.dialogRef.close({ data: resultData });
        this.loading.set(false);
      },
      error: (err) => {
        this.matSnackBar.open(
          err.error?.Title || err.message, 
          this.language.transform('close'), 
          errorMatSnackbarConfig(this.language)
        );
        this.loading.set(false);
      }
    });
  }
}