import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavItemViewModel } from '../../../../shared/model/NavItemViewModel';
import { Language } from '../../../../../core/services/language';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-menu-item-link-component',
  imports: [
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
  ],
  templateUrl: './menu-item-link-component.html',
  styleUrl: './menu-item-link-component.scss',
})
export class MenuItemLinkComponent {
  @Input() navItem!:NavItemViewModel;
  @Input() hasItems!:boolean;

  // Emitted only when a real route link is clicked (not the expand/collapse
  // trigger), so the mobile drawer can close itself on navigation.
  @Output() linkClick = new EventEmitter<void>();

  constructor(public language:Language){}

}
