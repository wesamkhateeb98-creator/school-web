import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { NotificationEndpoint, NotificationItem } from '../../../manager/shared/endpoints/notification-endpoint';
import { Language } from '../../../../core/services/language';

@Component({
  selector: 'app-notification-bell',
  imports: [
    MatBadgeModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button
      [matMenuTriggerFor]="notifMenu"
      (menuOpened)="onOpen()"
      style="color: var(--mat-sys-on-primary);"
      [matBadge]="totalCount() > 0 ? totalCount() : null"
      matBadgeColor="warn"
      matBadgeSize="small">
      <mat-icon>notifications</mat-icon>
    </button>

    <mat-menu #notifMenu="matMenu" xPosition="before" class="notif-menu">
      <div style="min-width: 320px; max-width: 380px;" (click)="$event.stopPropagation()">

        <!-- Header -->
        <div style="padding: 12px 16px 8px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600; font-size: 0.95rem;">
            {{ language.transform('notifications') }}
          </span>
          @if (totalCount() > 0) {
            <span style="font-size: 0.75rem; opacity: 0.6;">{{ totalCount() }}</span>
          }
        </div>
        <mat-divider />

        <!-- Loading -->
        @if (loading()) {
          <div style="display: flex; justify-content: center; padding: 24px;">
            <mat-spinner diameter="32" />
          </div>
        }

        <!-- Empty -->
        @else if (notifications().length === 0) {
          <div style="display: flex; flex-direction: column; align-items: center; padding: 32px 16px; gap: 8px; opacity: 0.5;">
            <mat-icon style="font-size: 36px; width: 36px; height: 36px;">notifications_none</mat-icon>
            <span style="font-size: 0.875rem;">{{ language.transform('no_notifications') }}</span>
          </div>
        }

        <!-- List -->
        @else {
          <div style="max-height: 360px; overflow-y: auto;">
            @for (n of notifications(); track n.id) {
              <div style="padding: 10px 16px; display: flex; gap: 12px; align-items: flex-start; cursor: default;"
                   onmouseenter="this.style.background='var(--mat-sys-surface-container)'"
                   onmouseleave="this.style.background='transparent'">
                <mat-icon style="font-size: 20px; width: 20px; height: 20px; margin-top: 2px; opacity: 0.7; flex-shrink: 0;">
                  {{ typeIcon(n.notificationType) }}
                </mat-icon>
                <div style="flex: 1; min-width: 0;">
                  <div style="font-size: 0.85rem; line-height: 1.4;">{{ n.message }}</div>
                  <div style="font-size: 0.75rem; opacity: 0.55; margin-top: 2px;">
                    {{ n.createdAt | date:'yyyy-MM-dd  HH:mm' }}
                  </div>
                </div>
              </div>
              <mat-divider />
            }
          </div>

          <!-- Load more -->
          @if (hasMore()) {
            <div style="padding: 8px; text-align: center;">
              <button mat-button (click)="loadMore(); $event.stopPropagation()" style="font-size: 0.8rem;">
                {{ language.transform('load_more') }}
              </button>
            </div>
          }
        }

      </div>
    </mat-menu>
  `,
})
export class NotificationBellComponent implements OnInit {
  private endpoint = inject(NotificationEndpoint);
  language = inject(Language);

  loading       = signal(false);
  notifications = signal<NotificationItem[]>([]);
  totalCount    = signal(0);
  pageNumber    = signal(1);
  pageSize      = 10;

  get hasMore() {
    return () => this.notifications().length < this.totalCount();
  }

  ngOnInit() {
    this.load();
  }

  onOpen() {
    if (this.notifications().length === 0 && !this.loading()) {
      this.load();
    }
  }

  load() {
    this.loading.set(true);
    this.endpoint.get(1, this.pageSize).subscribe({
      next: page => {
        this.notifications.set(page.content);
        this.totalCount.set(page.countPages * this.pageSize);
        this.pageNumber.set(1);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadMore() {
    const next = this.pageNumber() + 1;
    this.endpoint.get(next, this.pageSize).subscribe({
      next: page => {
        this.notifications.update(prev => [...prev, ...page.content]);
        this.pageNumber.set(next);
      },
    });
  }

  typeIcon(type: number): string {
    switch (type) {
      case 0: return 'note';          // Notes
      case 1: return 'family_restroom'; // ParentVisit
      case 2: return 'check_circle';  // StudentAttendance
      case 3: return 'star';          // Points
      default: return 'notifications';
    }
  }
}
