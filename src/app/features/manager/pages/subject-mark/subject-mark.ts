import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { Language } from '../../../../core/services/language';
import { AuthService } from '../../../../core/services/auth-service';
import { ROLES } from '../../../../core/model/roles';
import { StaffProfileService } from '../../../staff/services/staff-profile.service';
import { StaffPermission } from '../../../../core/enums/staff-permission.enum';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { SubjectMarkDistributionEndpoints } from '../../shared/endpoints/subject-mark-distribution-endpoint';
import { StudentMarkEntryEndpoints } from '../../shared/endpoints/student-mark-entry-endpoint';
import { SubjectMarkDistributionModel } from '../../shared/endpoints/models/age-group/subject-mark-distribution-model';
import { StudentMarkEntryModel } from '../../shared/endpoints/models/student-mark-entry/student-mark-entry-model';
import { MarkTableRow } from './model/mark-table-row';
import { MarkSheetHeaderComponent } from './components/mark-sheet-header/mark-sheet-header';
import { StudentFilterComponent } from './components/student-filter/student-filter';
import { MarkSheetTableComponent, EditCellEvent } from './components/mark-sheet-table/mark-sheet-table';
import { AddMarkDialog } from './dialogs/add-mark-dialog/add-mark-dialog';
import { EditMarkDialog } from './dialogs/edit-mark-dialog/edit-mark-dialog';

@Component({
  selector: 'app-subject-mark',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MarkSheetHeaderComponent,
    StudentFilterComponent,
    MarkSheetTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subject-mark.html',
})
export class SubjectMarkPage implements OnInit {
  private route         = inject(ActivatedRoute);
  private router        = inject(Router);
  private location      = inject(Location);
  private dialog        = inject(MatDialog);
  private matSnackBar   = inject(MatSnackBar);
  private distEndpoint  = inject(SubjectMarkDistributionEndpoints);
  private entryEndpoint = inject(StudentMarkEntryEndpoints);
  private authService   = inject(AuthService);
  private staffProfile  = inject(StaffProfileService);
  language = inject(Language);

  private isAdmin = computed(() => this.authService.getAuth()?.role === ROLES.ADMIN);
  canGet     = computed(() => this.isAdmin() || this.staffProfile.hasPermission(StaffPermission.GetSubjectMarkEntry));
  canAdd     = computed(() => this.isAdmin() || this.staffProfile.hasPermission(StaffPermission.AddSubjectMarkEntry));
  canEdit    = computed(() => this.isAdmin() || this.staffProfile.hasPermission(StaffPermission.UpdateSubjectMarkEntry));
  canDelete  = computed(() => this.isAdmin() || this.staffProfile.hasPermission(StaffPermission.DeleteSubjectMarkEntry));

  markSheetId       = 0;
  subjectAgeGroupId = 0;

  distributions  = signal<SubjectMarkDistributionModel[]>([]);
  maxGrade       = signal(0);
  minPassGrade   = signal(0);
  rows           = signal<MarkTableRow[]>([]);
  subjectName    = signal('');
  ageGroupName   = signal('');
  selectedStudentId = signal<number | null>(null);
  initialStudent = signal<{ id: number; name: string } | null>(null);

  distLoading   = signal(false);
  entriesLoading = signal(false);
  notFound      = signal(false);

  ngOnInit() {
    const snap = this.route.snapshot;
    this.markSheetId       = +(snap.paramMap.get('markSheetId')       ?? 0);
    this.subjectAgeGroupId = +(snap.paramMap.get('subjectAgeGroupId') ?? 0);

    const urlStudentId = snap.queryParams['studentId'] ? +snap.queryParams['studentId'] : null;
    if (urlStudentId) {
      this.selectedStudentId.set(urlStudentId);
    }

    this.loadDistributions();
  }

  private loadDistributions() {
    this.distLoading.set(true);
    this.distEndpoint.get(this.subjectAgeGroupId, 1, 100).subscribe({
      next: res => {
        this.distributions.set(res.content);
        this.maxGrade.set(res.maxGrade);
        this.distLoading.set(false);
        this.loadEntries();
        if (this.distributions().length === 0) {
          this.notFound.set(true);
        }
      },
      error: err => {
        this.distLoading.set(false);
        if (err.status === 404) {
          this.notFound.set(true);
        } else {
          this.matSnackBar.open(
            err.error?.Title ?? err.message,
            this.language.transform('close'),
            errorMatSnackbarConfig(this.language),
          );
        }
      },
    });
  }

  loadEntries() {
    this.entriesLoading.set(true);
    const studentId = this.selectedStudentId() ?? undefined;
    this.entryEndpoint.getEntries(this.markSheetId, studentId).subscribe({
      next: res => {
        this.subjectName.set(res.subjectName);
        this.ageGroupName.set(res.ageGroupName);
        this.minPassGrade.set(res.minPassGrade);
        this.rows.set(this.groupEntries(res.entries));
        this.entriesLoading.set(false);

        if (studentId && res.entries.length) {
          const first = res.entries[0];
          this.initialStudent.set({ id: first.studentId, name: first.studentName });
        }
      },
      error: err => {
        this.entriesLoading.set(false);
        this.matSnackBar.open(
          err.error?.Title ?? err.message,
          this.language.transform('close'),
          errorMatSnackbarConfig(this.language),
        );
      },
    });
  }

  private groupEntries(entries: StudentMarkEntryModel[]): MarkTableRow[] {
    const map = new Map<number, MarkTableRow>();
    for (const entry of entries) {
      if (!map.has(entry.studentId)) {
        map.set(entry.studentId, {
          studentId: entry.studentId,
          studentName: entry.studentName,
          markEntryIds: [],
          cellMap: {},
        });
      }
      const row = map.get(entry.studentId)!;
      if (entry.markEntryId) {
        row.markEntryIds.push(entry.markEntryId);
        row.cellMap[entry.distributionId] = {
          markEntryId: entry.markEntryId,
          enteredValue: entry.enteredValue,
        };
      }
    }
    return Array.from(map.values());
  }

  onStudentSelected(studentId: number | null) {
    this.selectedStudentId.set(studentId);
    if (!studentId) this.initialStudent.set(null);
    this.syncUrl();
    this.loadEntries();
  }

  private syncUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { studentId: this.selectedStudentId() ?? null },
      queryParamsHandling: 'replace',
    });
  }

  onAddMark() {
    const ref = this.dialog.open(AddMarkDialog, {
      width: '520px',
      data: {
        markSheetId:       this.markSheetId,
        subjectAgeGroupId: this.subjectAgeGroupId,
        maxGrade:          this.maxGrade(),
        distributions:     this.distributions(),
        prefilledStudentId:   this.selectedStudentId() ?? undefined,
        prefilledStudentName: this.initialStudent()?.name,
      },
    });
    ref.afterClosed().subscribe(result => {
      if (result?.reload) this.loadEntries();
    });
  }

  onEditCell(event: EditCellEvent) {
    const ref = this.dialog.open(EditMarkDialog, {
      width: '380px',
      data: {
        studentId:        event.studentId,
        distributionId:   event.distributionId,
        distributionName: event.distributionName,
        enteredValue:     event.enteredValue,
        maxValue:         event.maxValue,
      },
    });
    ref.afterClosed().subscribe((result?: { updated: boolean; value: number }) => {
      if (!result?.updated) return;
      this.rows.update(rows =>
        rows.map(row => {
          if (row.studentId !== event.studentId) return row;
          return {
            ...row,
            cellMap: {
              ...row.cellMap,
              [event.distributionId]: {
                ...row.cellMap[event.distributionId],
                enteredValue: result.value,
              },
            },
          };
        }),
      );
    });
  }

  onDeleteRow(row: MarkTableRow) {
    const ref = this.dialog.open(DeleteDialog, {
      width: '40%',
      data: {
        title: this.language.transform('delete_mark_entry'),
        action: () => {
          const deletes$ = row.markEntryIds.map(id => this.entryEndpoint.delete(id));
          forkJoin(deletes$).subscribe({
            next: () => {
              ref.close();
              this.rows.update(rows => rows.filter(r => r.studentId !== row.studentId));
              this.matSnackBar.open(
                this.language.transform('success'),
                this.language.transform('close'),
                successMatSnackbarConfig(this.language),
              );
            },
            error: err => {
              this.matSnackBar.open(
                err.message ?? err.error?.Title,
                this.language.transform('close'),
                errorMatSnackbarConfig(this.language),
              );
            },
          });
        },
      },
    });
  }

  goBack() { this.location.back(); }
}
