import { Component, EventEmitter, inject, Input, OnInit, Output, signal, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Language } from '../../../../../core/services/language';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, map, skip, startWith, switchMap, takeWhile, tap } from 'rxjs';
import { AgeGroupEndpoints } from '../../endpoints/age-group-endpoint';
import { AgeGroupModel } from '../../endpoints/models/age-group/age-group-model';
import { MatIconModule } from "@angular/material/icon";
import { MatIconButton } from '@angular/material/button';
import { ParamsService } from '../../../../../core/services/params-service';
import { PeriodViewModel } from '../../../pages/period/model/period-view-model';
import { PeriodEndpoints } from '../../endpoints/period-endpoint';

@Component({
  selector: 'app-period-auto-complete',
  imports: [
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatIconButton
],
  templateUrl: './period-auto-complete.html',
})
export class PeriodAutoComplete implements OnInit {
  @Input() form!: FormGroup;
  @Input() period!: PeriodViewModel|null;
  @Input() loading!: WritableSignal<boolean>;
  @Input() checkUrl!: boolean;


  
  fb = inject(FormBuilder);
  language = inject(Language);
  parmas = inject(ParamsService);
  periodEndpoints = inject(PeriodEndpoints);

  ngOnInit(): void {
    this.form.addControl('period', this.fb.control(this.period));
    this.form.addControl('periodId', this.fb.control(this.period?.id??""));
    this.setupAutocompletes();
    if(this.checkUrl)
      this.loadDataFromUrl()
  }

  loadDataFromUrl(){
    const paramsItem = this.parmas.loadGenericFromUrl();
    console.log(paramsItem['periodId']);
    if(paramsItem['periodId'])
      this.periodEndpoints.getById(paramsItem['periodId'])
        .subscribe(x=>{
          this.form.get('period')?.setValue(x??'',{emitEvent:false});
          this.form.get('periodId')?.setValue(x?.id??'',{emitEvent:false});
        })
  }

  periodItems= signal<PeriodViewModel[]>([]);
  
  setupAutocompletes() {
    const paramsItem = this.parmas.loadGenericFromUrl();
    
    const hasParam = !!paramsItem['periodId'];

    let source$ = this.form.get('period')!.valueChanges;
    
    if (!hasParam) {
      source$ = source$.pipe(startWith(''));
    }

    source$.pipe(
      debounceTime(300),
      switchMap(value => this.periodEndpoints.get(1, 20)),
      map(response => response.content),
      tap(() => this.loading.set(false))
    ).subscribe(x => {
      this.periodItems.set(x);
    });
    this.form.patchValue({ periodId: undefined });
  }
  

  displayFn = (option?: PeriodViewModel): string =>  {
    return option ? `${this.language.transform('class_period')} ${option.lessonNumber} ( ${option.fromTime} => ${option.toTime} )` : '';
  }

  onPeriodSelected(event: any) {
    if(this.checkUrl)
      this.form.patchValue({ periodId: event.option.value.id });
    this.parmas.setToUrl(({...this.parmas.loadGenericFromUrl(),periodId:event.option.value.id}))
  }

  clear(){
    this.form.patchValue({ period: null , periodId: null});
    const { periodId, ...r } = this.parmas.loadGenericFromUrl();
    this.parmas.setToUrl(({...r}))
  }
}
