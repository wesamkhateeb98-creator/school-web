import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Language } from '../../../../../../core/services/language';

@Component({
  selector: 'app-mark-sheet-header',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-toolbar" style="margin-bottom: 16px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div>
          <h2 class="page-toolbar__title">{{ language.transform('mark_entry_title') }}</h2>
          @if (subjectName) {
            <div style="font-size: 0.85rem; opacity: 0.6; margin-top: 2px;">
              {{ language.transform('age_group_title') }}: <b>{{ ageGroupName }}</b>
              &nbsp;·&nbsp;
              {{ language.transform('subject_title') }}: <b>{{ subjectName }}</b>
            </div>
          }
        </div>
      </div>

      <div class="page-toolbar__actions">
        <button class="toolbar-btn toolbar-btn--secondary" [matTooltip]="language.transform('back')" (click)="backClicked.emit()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        @if (showActions) {
          <button class="toolbar-btn toolbar-btn--primary" (click)="addMarkClicked.emit()">
            <mat-icon>add</mat-icon>
            <span>{{ language.transform('add') }}</span>
          </button>
        }
      </div>
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
