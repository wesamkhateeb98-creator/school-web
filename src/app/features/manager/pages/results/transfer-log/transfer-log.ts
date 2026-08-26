import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../../../core/services/language';
import { errorMatSnackbarConfig } from '../../../../../core/consts';
import { PromotionEndpoints } from '../../../shared/endpoints/promotion-endpoint';
import { TransferLogResponse } from '../../../shared/endpoints/models/promotion/transfer-log-response';
import { TransferAction } from '../../../../../core/enums/transfer-action';

@Component({
  selector: 'app-transfer-log',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatTooltipModule, DatePipe],
  templateUrl: './transfer-log.html',
  styleUrl: './transfer-log.scss',
})
export class TransferLogPage implements OnInit {
  language = inject(Language);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);
  promotionEndpoints = inject(PromotionEndpoints);

  studentId!: number;
  loading = signal(true);
  log = signal<TransferLogResponse | null>(null);

  TransferAction = TransferAction;

  actionLabelKey(action: number) {
    switch (action) {
      case TransferAction.Enrolled: return 'action_enrolled_title' as const;
      case TransferAction.Promoted: return 'action_promoted_title' as const;
      case TransferAction.Repeated: return 'action_repeated_title' as const;
      case TransferAction.Graduated: return 'action_graduated_title' as const;
      default: return 'action_enrolled_title' as const;
    }
  }

  ngOnInit(): void {
    this.studentId = +(this.route.snapshot.paramMap.get('id') ?? '0');
    if (this.studentId <= 0) {
      this.loading.set(false);
      return;
    }
    this.promotionEndpoints.getTransferLog(this.studentId).subscribe({
      next: response => {
        this.log.set(response);
        this.loading.set(false);
      },
      error: err => {
        this.matSnackBar.open(err.error?.title ?? err.message, this.language.transform('close'), errorMatSnackbarConfig(this.language));
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/manager/results/students', this.studentId], {
      queryParams: this.route.snapshot.queryParams,
    });
  }
}
