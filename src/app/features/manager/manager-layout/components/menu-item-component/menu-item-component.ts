import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NavItemViewModel } from '../../../view-model/NavItemViewModel';
import { Language } from '../../../../../core/services/language';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-menu-item-component',
  imports: [
    MatIconModule,
    RouterLink,
    MatListModule
  ],
  templateUrl: './menu-item-component.html',
  styleUrl: './menu-item-component.scss',
})
export class MenuItemComponent {
  
  @Input() navItem!:NavItemViewModel;

  constructor(public language:Language){}

}
