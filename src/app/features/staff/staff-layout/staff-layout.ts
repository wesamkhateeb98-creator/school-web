import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Language } from '../../../core/services/language';
import { ResponsiveScreen } from '../../../core/services/responsive-screen';
import { StaffNavItemService } from './services/staff-nav-item.service';
import { StaffProfileService } from '../services/staff-profile.service';
import { SettingButtonComponent } from '../../shared/components/setting-button-component/setting-button-component';
import { MenuItemComponent } from '../../manager/manager-layout/components/menu-item-component/menu-item-component';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell';

@Component({
  selector: 'app-staff-layout',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    SettingButtonComponent,
    MenuItemComponent,
    NotificationBellComponent,
  ],
  templateUrl: './staff-layout.html',
  styleUrl: './staff-layout.scss',
})
export class StaffLayout implements OnInit, OnDestroy {
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
}
