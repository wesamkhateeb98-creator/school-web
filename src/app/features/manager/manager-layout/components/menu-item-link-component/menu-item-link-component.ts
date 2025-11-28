import { Component, Input } from '@angular/core';
import { NavItemViewModel } from '../../../../shared/model/NavItemViewModel';
import { Language } from '../../../../../core/services/language';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-menu-item-link-component',
  imports: [
    MatIconModule,
    RouterLink,
    MatListModule
  ],
  templateUrl: './menu-item-link-component.html',
  styleUrl: './menu-item-link-component.scss',
})
export class MenuItemLinkComponent {
  @Input() navItem!:NavItemViewModel;
  @Input() hasItems!:boolean;


  constructor(public language:Language){}

}
