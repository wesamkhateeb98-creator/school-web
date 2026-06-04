import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Language } from '../../../../core/services/language';
import { errorMatSnackbarConfig, successMatSnackbarConfig } from '../../../../core/consts';
import { AuthService } from '../../../../core/services/auth-service';
import { ROLES } from '../../../../core/model/roles';
import { PublishDialog } from './dialog/publish-dialog/publish-dialog';
import { AgeGroupEndpoints } from '../../shared/endpoints/age-group-endpoint';
import { AgeGroupModel } from '../../shared/endpoints/models/age-group/age-group-model';
import { SubjectAgeGroupModel } from '../../shared/endpoints/models/age-group/subject-age-group-model';
import { SemesterEndpoints } from '../../shared/endpoints/semester-endpoints';
import { GetSemesterByAcademicYearModel } from '../../shared/endpoints/models/semester/getSemesterByAcademicYearModel';
import { StudentMarkSheetEndpoints } from '../../shared/endpoints/student-mark-sheet-endpoint';
import { StudentMarkSheetModel } from '../../shared/endpoints/models/student-mark-sheet/student-mark-sheet-model';
import { DeleteDialog } from '../../../shared/components/dialogs/delete-dialog/delete-dialog';
import { StudentMarkSheetFormDialog } from './dialog/student-mark-sheet-form-dialog/student-mark-sheet-form-dialog';

@Component({
  selector: 'app-student-mark-sheet',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-mark-sheet.html',
})
export class StudentMarkSheetPage implements OnInit {
  language          = inject(Language);
  dialog            = inject(MatDialog);
  matSnackBar       = inject(MatSnackBar);
  router            = inject(Router);
  route             = inject(ActivatedRoute);
  fb                = inject(FormBuilder);
  ageGroupEndpoints = inject(AgeGroupEndpoints);
  semesterEndpoints = inject(SemesterEndpoints);
  sheetEndpoints    = inject(StudentMarkSheetEndpoints);
  authService       = inject(AuthService);

  isAdmin = computed(() => this.authService.getAuth()?.role === ROLES.ADMIN);
  isStaff = computed(() => this.authService.getAuth()?.role === ROLES.ADMINISTRATIVE_STAFF);

  loading         = signal(false);
  subjectsLoading = signal(false);
  records         = signal<StudentMarkSheetModel[]>([]);
  ageGroupItems   = signal<AgeGroupModel[]>([]);
  subjectItems    = signal<SubjectAgeGroupModel[]>([]);
  semesters       = signal<GetSemesterByAcademicYearModel[]>([]);
  totalPages      = signal(0);
  pageNumber      = signal(1);
  pageSize        = signal(10);

  filterForm!: FormGroup;
  headerTable = ['subjectName', 'ageGroupName', 'studentsCount', 'isConfirmed', 'action'];

  displayAgeGroup = (g: AgeGroupModel | string | null): string =>
    !g || typeof g === 'string' ? ((g as string) ?? '') : g.name;

  displaySubject = (s: SubjectAgeGroupModel | string | null): string =>
    !s || typeof s === 'string' ? ((s as string) ?? '') : s.subjectName;

  semesterLabel = (s: GetSemesterByAcademicYearModel) => `${s.semesterName} — ${s.year}`;

  // ── semester ──────────────────────────────────────────────
  onSemesterChange(id: number | null) {
    this.filterForm.patchValue({ semesterId: id }, { emitEvent: false });
    this.pageNumber.set(1);
    this.syncUrl();
    if (id) this.loadRecords(); else this.records.set([]);
  }

  // ── age group ─────────────────────────────────────────────
  onAgeGroupFocus() {
    if (this.ageGroupItems().length === 0) {
      this.ageGroupEndpoints.get('', 1, 100).subscribe({
        next: p => this.ageGroupItems.set(p.content),
      });
    }
  }

  onAgeGroupSelected(group: AgeGroupModel) {
    this.filterForm.patchValue(
      { ageGroupId: group.id, ageGroupSearch: group, subjectAgeGroupId: null, subjectSearch: '' },
      { emitEvent: false },
    );
    this.filterForm.get('subjectSearch')!.enable({ emitEvent: false });
    this.subjectItems.set([]);
    // this.records.set([]);
    this.loadSubjects(group.id, null);
    this.syncUrl();
  }

  clearAgeGroup() {
    this.filterForm.patchValue(
      { ageGroupId: null, ageGroupSearch: null, subjectAgeGroupId: null, subjectSearch: null },
      { emitEvent: false },
    );
    this.filterForm.get('subjectSearch')!.disable({ emitEvent: false });
    this.subjectItems.set([]);
    this.loadRecords()
    this.syncUrl();
  }

  // ── subject ───────────────────────────────────────────────
  onSubjectSelected(subject: SubjectAgeGroupModel) {
    this.filterForm.patchValue({ subjectAgeGroupId: subject.subjectAgeGroupId, subjectSearch: subject }, { emitEvent: false });
    this.pageNumber.set(1);
    this.syncUrl();
    this.loadRecords();
  }

  clearSubject() {
    this.filterForm.patchValue({ subjectAgeGroupId: null, subjectSearch: '' }, { emitEvent: false });
    //this.records.set([]);
    this.loadRecords();
    this.syncUrl();
    const ageGroupId = this.filterForm.value.ageGroupId;
    if (ageGroupId) this.loadSubjects(ageGroupId, null);
  }

  confirmSheet(row: StudentMarkSheetModel) {
    this.sheetEndpoints.confirm(row.id).subscribe({
      next: () => {
        this.records.update(list =>
          list.map(r => r.id === row.id ? { ...r, isConfirmed: true } : r),
        );
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
  }

  openPublishDialog() {
    const semesterId = this.filterForm.value.semesterId;
    if (!semesterId) return;
    this.dialog.open(PublishDialog, {
      width: '640px',
      data: { semesterId },
    });
  }

  goToDetails(row: StudentMarkSheetModel) {
    this.router.navigate(['/manager/subject-mark-sheed', row.id, 'subjectAgeGroupId', row.subjectAgeGroupId]);
  }

  changePage(event: PageEvent) {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.syncUrl();
    this.loadRecords();
  }

  ngOnInit() {
    const snap = this.route.snapshot.queryParams;
    const urlSemesterId        = snap['semesterId']        ? +snap['semesterId']        : null;
    const urlAgeGroupId        = snap['ageGroupId']        ? +snap['ageGroupId']        : null;
    const urlSubjectAgeGroupId = snap['subjectAgeGroupId'] ? +snap['subjectAgeGroupId'] : null;
    if (snap['pageNumber']) this.pageNumber.set(+snap['pageNumber']);
    if (snap['pageSize'])   this.pageSize.set(+snap['pageSize']);

    this.filterForm = this.fb.group({
      semesterId:        [urlSemesterId],
      ageGroupSearch:    [null],
      ageGroupId:        [urlAgeGroupId],
      subjectSearch:     [{ value: null, disabled: !urlAgeGroupId }],
      subjectAgeGroupId: [urlSubjectAgeGroupId],
    });

    // Load semesters once
    this.semesterEndpoints.getSemesterByAcademicYear({
      year: undefined, justStarted: false, PageNumber: 1, pageSize: 50,
    }).subscribe({
      next: page => {
        this.semesters.set(page.content);
        if (!urlSemesterId) {
          const active = page.content.find(s => s.isActive) ?? page.content[0];
          if (active) {
            this.filterForm.patchValue({ semesterId: active.academicYearSemesterId }, { emitEvent: false });
            if (!urlAgeGroupId) this.loadRecords();
          }
        }
      },
    });

    // Subject search
    this.filterForm.get('subjectSearch')!.valueChanges.pipe(debounceTime(300)).subscribe(val => {
      if (typeof val === 'string') {
        const ageGroupId = this.filterForm.value.ageGroupId;
        if (ageGroupId) this.loadSubjects(ageGroupId, null, val.trim());
      }
    });

    // AgeGroup search
    this.filterForm.get('ageGroupSearch')!.valueChanges.pipe(debounceTime(300)).subscribe(val => {
      if (typeof val === 'string') {
        this.ageGroupEndpoints.get(val.trim(), 1, 100).subscribe({
          next: p => this.ageGroupItems.set(p.content),
        });
      }
    });

    // Restore from URL
    if (urlAgeGroupId) {
      this.ageGroupEndpoints.get('', 1, 100).subscribe({
        next: page => {
          this.ageGroupItems.set(page.content);
          const match = page.content.find(g => g.id === urlAgeGroupId);
          if (match) {
            this.filterForm.patchValue({ ageGroupSearch: match }, { emitEvent: false });
            this.filterForm.get('subjectSearch')!.enable({ emitEvent: false });
            this.loadSubjects(match.id, urlSubjectAgeGroupId);
          }
        },
      });
    }
  }

  private loadSubjects(ageGroupId: number, restoreSubjectAgeGroupId: number | null, name: string | null = null) {
    this.subjectsLoading.set(true);
    this.ageGroupEndpoints.getSubjectAgeGroups(ageGroupId, name, 1, 200).subscribe({
      next: page => {
        this.subjectItems.set(page.content);
        this.subjectsLoading.set(false);
        if (restoreSubjectAgeGroupId) {
          const match = page.content.find(s => s.subjectAgeGroupId === restoreSubjectAgeGroupId);
          if (match) {
            this.filterForm.patchValue({ subjectSearch: match, subjectAgeGroupId: match.subjectAgeGroupId }, { emitEvent: false });
            this.loadRecords();
          }
        }
      },
      error: () => this.subjectsLoading.set(false),
    });
  }

  private loadRecords() {
    const { semesterId, subjectAgeGroupId } = this.filterForm.value;
    if (!semesterId) return;
    this.loading.set(true);
    this.sheetEndpoints.get(semesterId, subjectAgeGroupId ?? null, this.pageNumber(), this.pageSize()).subscribe({
      next: page => {
        this.records.set(page.content);
        this.totalPages.set(page.countPages);
        this.loading.set(false);
      },
      error: err => {
        this.matSnackBar.open(err.error?.Title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  private syncUrl() {
    const { semesterId, ageGroupId, subjectAgeGroupId } = this.filterForm.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        semesterId:        semesterId        ?? null,
        ageGroupId:        ageGroupId        ?? null,
        subjectAgeGroupId: subjectAgeGroupId ?? null,
        pageNumber:        this.pageNumber(),
        pageSize:          this.pageSize(),
      },
      queryParamsHandling: 'replace',
    });
  }

  openAddDialog() {
    const ref = this.dialog.open(StudentMarkSheetFormDialog, {
      width: '55%',
      data: {
        semesters:          this.semesters(),
        selectedSemesterId: this.filterForm.value.semesterId,
      },
    });
    ref.afterClosed().subscribe(r => { if (r?.reload) this.loadRecords(); });
  }

  openEditDialog(record: StudentMarkSheetModel) {
    const ref = this.dialog.open(StudentMarkSheetFormDialog, {
      width: '55%',
      data: {
        record,
        semesters:          this.semesters(),
        selectedSemesterId: this.filterForm.value.semesterId,
      },
    });
    ref.afterClosed().subscribe(r => { if (r?.reload) this.loadRecords(); });
  }

  openDeleteDialog(record: StudentMarkSheetModel) {
    const ref = this.dialog.open(DeleteDialog, {
      width: '40%',
      data: {
        title: this.language.transform('delete_student_mark_sheet'),
        action: () => {
          this.sheetEndpoints.delete(record.id).subscribe({
            next: () => {
              ref.close();
              this.records.update(list => list.filter(r => r.id !== record.id));
              this.matSnackBar.open(this.language.transform('success'), this.language.transform('close'), successMatSnackbarConfig(this.language));
            },
            error: err => {
              this.matSnackBar.open(err.error?.Title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
            },
          });
        },
      },
    });
  }
}
