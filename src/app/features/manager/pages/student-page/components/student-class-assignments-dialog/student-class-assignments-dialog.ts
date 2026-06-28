import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Language } from '../../../../../../core/services/language';
import { errorMatSnackbarConfig } from '../../../../../../core/consts';
import { StudentEndpoints } from '../../../../shared/endpoints/student-endpoint';
import { StudentClassAssignment } from '../../../../shared/endpoints/models/student/student-class-assignment';

const STUDENT_CLASS_STATUS: Record<number, { ar: string; en: string }> = {
  1: { ar: 'قيد السنة', en: 'In Progress' },
  2: { ar: 'ناجح', en: 'Passed' },
  3: { ar: 'راسب', en: 'Failed' },
  4: { ar: 'انتهت السنة', en: 'Year Ended' },
};

@Component({
  selector: 'app-student-class-assignments-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatIconModule,
    DatePipe,
  ],
  templateUrl: './student-class-assignments-dialog.html',
})
export class StudentClassAssignmentsDialog implements OnInit {
  dialogRef = inject(MatDialogRef<StudentClassAssignmentsDialog>);
  data: { studentId: number; studentName: string } = inject(MAT_DIALOG_DATA);
  language = inject(Language);
  matSnackBar = inject(MatSnackBar);
  studentEndpoints = inject(StudentEndpoints);

  loading = signal(false);
  assignments = signal<StudentClassAssignment[]>([]);

  headerTable = ['ageGroupName', 'section', 'academicYear', 'studentStatus', 'createdAt'];

  ngOnInit() {
    this.loading.set(true);
    this.studentEndpoints.getClassAssignments(this.data.studentId).subscribe({
      next: res => {
        this.assignments.set(res);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.matSnackBar.open(err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
      },
    });
  }

  getStatusLabel(status: number): string {
    return STUDENT_CLASS_STATUS[status]?.[this.language.language()] ?? String(status);
  }

  close() {
    this.dialogRef.close();
  }
}
