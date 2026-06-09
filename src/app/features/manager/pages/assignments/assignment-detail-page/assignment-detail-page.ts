import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig } from '../../../../../core/consts';
import { AssignmentEndpoints } from '../../../shared/endpoints/assignment-endpoint';
import { AssignmentResponse, ASSIGNMENT_TYPE_LABELS, AssignmentType } from '../model/assignment.model';

@Component({
  selector: 'app-assignment-detail-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignment-detail-page.html',
})
export class AssignmentDetailPage implements OnInit {
  language            = inject(Language);
  router              = inject(Router);
  route               = inject(ActivatedRoute);
  matSnackBar         = inject(MatSnackBar);
  assignmentEndpoints = inject(AssignmentEndpoints);

  loading    = signal(false);
  assignment = signal<AssignmentResponse | null>(null);
  id!: number;

  ngOnInit() {
    this.id = +(this.route.snapshot.paramMap.get('id') ?? '0');
    this.load();
  }

  load() {
    this.loading.set(true);
    this.assignmentEndpoints.getById(this.id).subscribe({
      next: res => {
        this.assignment.set(res);
        this.loading.set(false);
      },
      error: err => {
        this.matSnackBar.open(err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  getTypeLabel(type: AssignmentType): string {
    return ASSIGNMENT_TYPE_LABELS[type] ?? '';
  }

  goBack() {
    this.router.navigate(['manager/assignments']);
  }
}
