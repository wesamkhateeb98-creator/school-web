import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Language } from '../../../../core/services/language';

@Component({
  selector: 'app-subject-mark',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
      <button mat-icon-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <h2 style="margin: 0;">Subject Mark — ID: {{ subjectAgeGroupId }}</h2>
    </div>
    <p style="opacity: 0.5;">Content coming soon...</p>
  `,
})
export class SubjectMarkPage {
  language = inject(Language);
  location = inject(Location);
  route    = inject(ActivatedRoute);

  subjectAgeGroupId = this.route.snapshot.paramMap.get('subjectAgeGroupId') ?? '';

  goBack() { this.location.back(); }
}
