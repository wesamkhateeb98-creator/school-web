import { Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { ManagerNavItemStateService } from '../shared/services/manager-state-nav-item-service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink, RouterOutlet } from "@angular/router";
import { SettingButtonComponent } from "../../shared/components/setting-button-component/setting-button-component";
import { Language } from '../../../core/services/language';
import { ResponsiveScreen } from '../../../core/services/responsive-screen';
import { AuthService } from '../../../core/services/auth-service';
import { MenuItemComponent } from "./components/menu-item-component/menu-item-component";
import { SelectedAcademicYearService } from '../../../core/services/selected-academic-year.service';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell';

const SIDEBAR_COLLAPSED_KEY = 'sidebarCollapsed';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDividerModule,
    RouterOutlet,
    SettingButtonComponent,
    MenuItemComponent
  ],
  templateUrl: './manager-layout.html',
  styleUrl: './manager-layout.scss',
})
export class DashboardLayout implements OnInit, OnDestroy  {

  @ViewChild('matSidenav') matSidenav!: MatSidenav;

  // Desktop icon-only rail state. Persisted so the choice survives a
  // reload — a collapse toggle that resets itself feels broken.
  collapsed = signal(typeof localStorage !== 'undefined' && localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1');

  // Header hides while scrolling down (reclaiming vertical space) and
  // reappears on scroll up — the classic auto-hide app-bar pattern.
  headerHidden = signal(false);
  private lastScrollTop = 0;

  constructor(
    public managerState:ManagerNavItemStateService,
    public language:Language,
    public responseScreen:ResponsiveScreen,
    public academicYearSvc: SelectedAcademicYearService,
  ){}

  ngOnInit(): void {  }

  ngOnDestroy(): void {
    this.responseScreen.destroy();
  }

  onYearChange(id: number): void {
    this.academicYearSvc.select(id);
    window.location.reload();
  }

  onNavItemClick(): void {
    if (this.responseScreen.isMobile()) {
      this.matSidenav.close();
    }
  }

  onContentScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    // Ignore the first ~40px so the header doesn't flicker away the
    // instant you nudge the page — only hide once you're meaningfully
    // scrolling down, and show again the moment you scroll back up.
    if (scrollTop > this.lastScrollTop && scrollTop > 40) {
      this.headerHidden.set(true);
    } else if (scrollTop < this.lastScrollTop) {
      this.headerHidden.set(false);
    }
    this.lastScrollTop = scrollTop;
  }

  toggleCollapsed(): void {
    const next = !this.collapsed();
    this.collapsed.set(next);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0');

    // Whatever recomputes the content area's width when the drawer's own
    // width changes reacts to a window resize, but wasn't picking up this
    // class-driven CSS width change on its own — nudge it once immediately
    // and once after the 200ms width transition finishes.
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => window.dispatchEvent(new Event('resize')), 220);
  }
}
