import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ManagerNavItemStateService } from '../services/manager-state-nav-item-service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterOutlet } from "@angular/router";
import { SettingButtonComponent } from "../../shared/components/setting-button-component/setting-button-component";
import { Language } from '../../../core/services/language';
import { ResponsiveScreen } from '../../../core/services/responsive-screen';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    RouterLink,
    RouterOutlet,
    SettingButtonComponent
],
  templateUrl: './manager-layout.html',
  styleUrl: './manager-layout.scss',
})
export class DashboardLayout implements OnInit, OnDestroy  {
  
  constructor(
    public managerState:ManagerNavItemStateService, 
    public language:Language,
    public responseScreen:ResponsiveScreen
  ){}

  ngOnInit(): void {  }

  ngOnDestroy(): void {
    this.responseScreen.destroy();
  }
}
