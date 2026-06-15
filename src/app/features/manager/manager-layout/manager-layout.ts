import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
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
}
