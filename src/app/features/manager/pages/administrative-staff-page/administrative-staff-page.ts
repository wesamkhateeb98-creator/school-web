import { Component, effect, signal } from '@angular/core';
import { AdministrativeStaffViewModel } from './view-model/administrative-staff-view-model';
import { AdministrativeStaffFilterViewModel } from './view-model/administrative-staff-filter-view-model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Language } from '../../../../core/services/language';
import { MatDialog } from '@angular/material/dialog';
import { ParamsService } from '../../../../core/services/params-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdministrativeStaffEndpoints } from '../../shared/endpoints/administrative-staff-endpoint';
import { debounceTime } from 'rxjs';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { AddAdministrativeStaffDialog } from './add-administrative-staff-dialog/add-administrative-staff-dialog';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { AccountCodeDialog } from '../../../auth/dialogs/account-code-dialog/account-code-dialog';
import { PermissionService } from '../../../../core/enums/service/permission-service';

@Component({
  selector: 'app-managerial-page',
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
    MatGridList,
    MatGridTile,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    DatePipe
],
  templateUrl: './administrative-staff-page.html',
  styleUrl: './administrative-staff-page.scss',
})
export class ManagerialPage {
  administrativeStaffs = signal<AdministrativeStaffViewModel[]>([]);

  staffFilter = signal<AdministrativeStaffFilterViewModel>(
    {
      pageNumber: 1,
      pageSize: 10
    }
  );

  totalPages = signal<number>(1);
  loading = signal<boolean>(false);

  headerTable: string[] = [
    'name',
    'phonenumber',
    'permissions',
    'createdAt',
    'action'
  ];

  form!: FormGroup;

  constructor(
    public language: Language,
    public dialog: MatDialog,
    public params: ParamsService, // Fixed typo from 'parmas'
    public matSnackBar: MatSnackBar,
    public staffEndpoints: AdministrativeStaffEndpoints, // Renamed endpoint
    public fb: FormBuilder,
    public permissionService:PermissionService
  ) {
    this.setFilterFromUrl();
    this.initiateForm();
    this.loadStaffViewModel();
  }

  setFilterFromUrl() {
    this.staffFilter.update(x => {
      const param = this.params.loadGenericFromUrl();
      x.pageSize = param['pageSize'] ? param['pageSize'] : 10;
      x.pageNumber = param['pageNumber'] ? param['pageNumber'] : 1;
      x.name = param['fullName'];
      x.phonenumber = param['phonenumber'];
      return x;
    });

    effect(() => {
      this.params.setToUrl({
        'pageSize': this.staffFilter().pageSize,
        'pageNumber': this.staffFilter().pageNumber,
        'fullName': this.staffFilter().name,
        'phonenumber': this.staffFilter().phonenumber
      });
    });
  }

  initiateForm() {
    this.form = this.fb.group({
      fullName: [this.staffFilter().name ?? ''],
      phonenumber: [this.staffFilter().phonenumber ?? '']
    });

    this.form.valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.staffFilter.update(prev => ({
        ...prev,
        name: value.fullName ?? '',
        phonenumber: value.phonenumber ?? ''
      }));
      this.loadStaffViewModel();
    });
  }

  loadStaffViewModel() {
  this.loading.set(true);
  const result = this.staffEndpoints.get(this.staffFilter());

  result.subscribe({
    next: (success) => {
      this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
      
      this.staffFilter.update(x => {
        x.pageSize = success.pageSize;
        x.pageNumber = success.pageNumber;  
        return x;
      });
      
      this.totalPages.set(success.countPages);

      this.administrativeStaffs.set(
        success.content.map(x => new AdministrativeStaffViewModel(
          x.id,
          x.fullName,
          x.phoneNumber,
          new Date(), 
          x.permissions ?? [] 
        ))
      );

      this.loading.set(false);
    },
    error: (error) => {
      this.matSnackBar.open(error.error.Title, this.language.transform('close'), successMatSnackbarConfig(this.language));
      this.loading.set(false);
    }
  });
}

  openAddDialog() {
    const dialogRef = this.dialog.open(
      AddAdministrativeStaffDialog, 
      {
        width: "80vw",
        maxWidth: "80vw"
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result?.data) {
        this.administrativeStaffs.update(arr => [result.data, ...arr]);
      }
    });
  }

  openUpdateDialog(staff: AdministrativeStaffViewModel) {
    const dialogRef = this.dialog.open(
      AddAdministrativeStaffDialog, 
      {
        width: "80vw",
        maxWidth: "80vw",
        data: { staff: staff }
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.administrativeStaffs.update(arr => 
          arr.map(x => x.id === result.data.id ? result.data : x)
        );
      }
    });
  }

  openDeleteDialog(id: number) {
    const dialogRef = this.dialog.open(
      DeleteDialog,
      {
        data: {
          title: this.language.transform('delete_staff'),
          action: () => {
            this.staffEndpoints.delete(id).subscribe({
              next: () => {
                dialogRef.close();
                this.administrativeStaffs.update(x => x.filter(item => item.id !== id));
                this.matSnackBar.open("success", this.language.transform('close'), successMatSnackbarConfig(this.language));
              },
              error: error => {
                this.matSnackBar.open(error.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
              }
            });
          }
        },
        width: "80%"
      }
    );
  }

  changeInPage(pageEvent: PageEvent) {
    this.staffFilter.update(x => {
      x.pageSize = pageEvent.pageSize;
      x.pageNumber = pageEvent.pageIndex + 1;
      return x;
    });
    
    this.params.setToUrl(this.staffFilter());
    this.loadStaffViewModel(); 
  }

  openAccountCodeDialog(id: number, phone: string) {
    this.dialog.open(AccountCodeDialog, {
      width: '50%',
      data: { id: id, phoneNumber: phone }
    });
  }

  getPermissionTooltip(ids: number[]): string {
    return ids
      ?.map(x => this.permissionService.getPermissionById(x)?.name)
      .filter(Boolean)
      .join('  -  ') ?? '';
}

}
