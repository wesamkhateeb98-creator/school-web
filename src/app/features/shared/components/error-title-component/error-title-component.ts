import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-error-title-component',
  imports: [],
  templateUrl: './error-title-component.html',
  styleUrl: './error-title-component.scss',
})
export class ErrorTitleComponent {
  @Input() message!: string;

}
