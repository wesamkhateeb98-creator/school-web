import { Component, Input } from '@angular/core';
import { NavItemViewModel } from '../../../view-model/NavItemViewModel';
import { Language } from '../../../../../core/services/language';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu-item-link-component',
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './menu-item-link-component.html',
  styleUrl: './menu-item-link-component.scss',
})
export class MenuItemLinkComponent {
  @Input() navItem!:NavItemViewModel;

  constructor(public language:Language){}

}
