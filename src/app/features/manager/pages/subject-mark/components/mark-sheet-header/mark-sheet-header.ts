import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Language } from '../../../../../../core/services/language';

@Component({
  selector: 'app-mark-sheet-header',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; justify-content: space-between; align-items: center;
                flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button mat-icon-button (click)="backClicked.emit()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h2 style="margin: 0;">{{ language.transform('mark_entry_title') }}</h2>
          @if (subjectName) {
            <div style="font-size: 0.85rem; opacity: 0.6; margin-top: 2px;">
              {{ language.transform('age_group_title') }}: <b>{{ ageGroupName }}</b>
              &nbsp;·&nbsp;
              {{ language.transform('subject_title') }}: <b>{{ subjectName }}</b>
            </div>
          }
        </div>
      </div>

      @if (showActions) {
        <button mat-fab (click)="addMarkClicked.emit()">
          <mat-icon>add</mat-icon>
        </button>
      }
    </div>
  `,
})
export class MarkSheetHeaderComponent {
  language = inject(Language);

  @Input() ageGroupName = '';
  @Input() subjectName  = '';
  @Input() showActions  = true;

  @Output() addMarkClicked = new EventEmitter<void>();
  @Output() backClicked    = new EventEmitter<void>();
}
