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
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet } from "@angular/router";
import { SettingButtonComponent } from "../../shared/components/setting-button-component/setting-button-component";
import { Language } from '../../../core/services/language';
import { ResponsiveScreen } from '../../../core/services/responsive-screen';
import { MenuItemComponent } from "./components/menu-item-component/menu-item-component";
import { SelectedAcademicYearService } from '../../../core/services/selected-academic-year.service';

const SIDEBAR_OPEN_KEY = 'adminSidebarOpen';

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
    MatTooltipModule,
    RouterOutlet,
    SettingButtonComponent,
    MenuItemComponent,
  ],
  templateUrl: './manager-layout.html',
  styleUrl: './manager-layout.scss',
})
export class DashboardLayout implements OnInit, OnDestroy  {

  @ViewChild('matSidenav') matSidenav!: MatSidenav;

  // A plain open/closed drawer — persisted so the choice survives a reload.
  // Material's own slide transition on the sidenav handles the animation,
  // so there's no custom width/rail state to keep in sync here.
  sidebarOpen = signal(typeof localStorage === 'undefined' || localStorage.getItem(SIDEBAR_OPEN_KEY) !== '0');

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
