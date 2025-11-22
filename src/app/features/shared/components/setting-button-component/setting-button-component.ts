import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { Theme } from '../../../../core/services/theme';
import { Language } from '../../../../core/services/language';
import { AuthService } from '../../../../core/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-button-component',
  imports: [MatMenuModule, MatButtonModule , MatIconModule, MatListModule],
  templateUrl: './setting-button-component.html',
  styleUrl: './setting-button-component.scss',
})

export class SettingButtonComponent {
  constructor(
    public theme:Theme,
    public language:Language, 
    public authService:AuthService,
    public router:Router
  ){}

  logout(){
    this.authService.removeAuth();
    this.router.navigate(['auth/login'])
  }
}
