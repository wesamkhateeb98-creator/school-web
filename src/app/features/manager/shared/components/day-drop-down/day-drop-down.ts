import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Language } from '../../../../../core/services/language';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DayService } from '../../../../../core/enums/service/day-service';
import { ParamsService } from '../../../../../core/services/params-service';

@Component({
  selector: 'app-day-drop-down',
  imports: [
    MatFormFieldModule,
    MatSelectModule, 
    MatInputModule, 
    FormsModule, 
    ReactiveFormsModule
  ],
  templateUrl: './day-drop-down.html'
})
export class DayDropDown  implements OnInit{
  @Input() form!: FormGroup;
  @Input() checkUrl!: boolean;

  fb = inject(FormBuilder);
  language = inject(Language);
  dayService = inject(DayService);
  parmas = inject(ParamsService);

  ngOnInit(): void {
    this.form.addControl('day', this.fb.control(1));
    if(this.checkUrl)
      this.loadDataFromUrl()
  }
  
  loadDataFromUrl(){
    const paramsItem = this.parmas.loadGenericFromUrl();
    this.onSelect(+paramsItem['day']);
  }

  onSelect(day:number){
    this.form.patchValue({
      day:day
    })
  }
}
