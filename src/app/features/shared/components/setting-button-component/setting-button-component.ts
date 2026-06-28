import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Theme } from '../../../../core/services/theme';
import { Language } from '../../../../core/services/language';
import { AuthService } from '../../../../core/services/auth-service';
import { HttpHelper } from '../../../../core/services/http-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-button-component',
  imports: [MatMenuModule, MatButtonModule, MatIconModule, MatListModule, MatDividerModule],
  templateUrl: './setting-button-component.html',
  styleUrl: './setting-button-component.scss',
})

export class SettingButtonComponent {
  constructor(
    public theme:Theme,
    public language:Language,
    public authService:AuthService,
    public router:Router,
    public http:HttpHelper
  ){}

  logout(){
    this.http.post('user/logout', {}).subscribe({
      next: () => {
        this.authService.removeAuth();
        this.router.navigate(['auth/login']);
      },
      error: () => {
        this.authService.removeAuth();
        this.router.navigate(['auth/login']);
      },
    });
  }
}
