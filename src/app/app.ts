import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Theme } from './core/services/theme';
import { NgxMatTimepickerLocaleService } from 'ngx-mat-timepicker';
import { Language } from './core/services/language';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('school-web');

  constructor(theme:Theme,private localeService: NgxMatTimepickerLocaleService,private language:Language){
    localeService.updateLocale(language.getLanguageCode());
  }
}
