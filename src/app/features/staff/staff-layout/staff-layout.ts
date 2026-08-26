import { Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet } from '@angular/router';
import { Language } from '../../../core/services/language';
import { ResponsiveScreen } from '../../../core/services/responsive-screen';
import { StaffNavItemService } from './services/staff-nav-item.service';
import { StaffProfileService } from '../services/staff-profile.service';
import { SettingButtonComponent } from '../../shared/components/setting-button-component/setting-button-component';
import { MenuItemComponent } from '../../manager/manager-layout/components/menu-item-component/menu-item-component';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell';

const SIDEBAR_OPEN_KEY = 'staffSidebarOpen';

@Component({
  selector: 'app-staff-layout',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    SettingButtonComponent,
    MenuItemComponent,
    NotificationBellComponent,
  ],
  templateUrl: './staff-layout.html',
  styleUrl: './staff-layout.scss',
})
export class StaffLayout implements OnInit, OnDestroy {
  @ViewChild('matSidenav') matSidenav!: MatSidenav;

  // A plain open/closed drawer — persisted so the choice survives a reload.
  // Desktop: `opened` on the sidenav itself, so Material's own slide
  // transition handles the animation (no custom width/rail CSS to fight).
  sidebarOpen = signal(typeof localStorage === 'undefined' || localStorage.getItem(SIDEBAR_OPEN_KEY) !== '0');

  headerHidden = signal(false);
  private lastScrollTop = 0;

  constructor(
    public staffNav: StaffNavItemService,
    public language: Language,
    public responseScreen: ResponsiveScreen,
    public staffProfile: StaffProfileService,
  ) {}

  ngOnInit(): void {
    this.staffProfile.loadProfile();
  }

  ngOnDestroy(): void {
    this.responseScreen.destroy();
  }

  onNavItemClick(): void {
    if (this.responseScreen.isMobile()) {
      this.matSidenav.close();
    }
  }

  onContentScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    if (scrollTop > this.lastScrollTop && scrollTop > 40) {
      this.headerHidden.set(true);
    } else if (scrollTop < this.lastScrollTop) {
      this.headerHidden.set(false);
    }
    this.lastScrollTop = scrollTop;
  }

  toggleSidebar(): void {
    const next = !this.sidebarOpen();
    this.sidebarOpen.set(next);
    if (!this.responseScreen.isMobile()) {
      localStorage.setItem(SIDEBAR_OPEN_KEY, next ? '1' : '0');
    }
  }
}
