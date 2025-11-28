import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NavItemViewModel } from '../../../../shared/model/NavItemViewModel';
import { Language } from '../../../../../core/services/language';
import { MatListModule } from '@angular/material/list';
import { MenuItemLinkComponent } from "../menu-item-link-component/menu-item-link-component";

@Component({
  selector: 'app-menu-item-component',
  imports: [
    MatIconModule,
    MatListModule,
    MenuItemLinkComponent
],
  templateUrl: './menu-item-component.html',
  styleUrl: './menu-item-component.scss',
})
export class MenuItemComponent {
  
  @Input() navItem!:NavItemViewModel;

  @Input() level!:number;

  constructor(public language:Language){}

  GetWidth(){
    return `border-inline-start: 4px solid var(--mat-sys-surface-variant); `
  } 
}
