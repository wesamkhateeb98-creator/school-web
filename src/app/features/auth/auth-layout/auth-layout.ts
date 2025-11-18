import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { Language } from '../../../core/services/language';

@Component({
  selector: 'app-auth-layout',
  imports: [MatButtonModule, RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {

  constructor(public language:Language){
    
  }
}
