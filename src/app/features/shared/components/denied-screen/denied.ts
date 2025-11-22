import { Component, inject } from '@angular/core';
import { Language } from '../../../../core/services/language';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-denied-screen',
  imports: [],
  templateUrl: './denied.html',
  styleUrl: './denied.scss',
})
export class Denied {
  language = inject(Language)
  authService = inject(AuthService)
}
