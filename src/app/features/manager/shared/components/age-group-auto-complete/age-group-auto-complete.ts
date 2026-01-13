import { Component, EventEmitter, inject, Input, OnInit, Output, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Language } from '../../../../../core/services/language';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AgeGroupEndpoints } from '../../endpoints/age-group-endpoint';
import { AgeGroupModel } from '../../endpoints/models/age-group/age-group-model';
import { MatIconModule } from "@angular/material/icon";
import { MatIconButton } from '@angular/material/button';
import { ParamsService } from '../../../../../core/services/params-service';

@Component({
  selector: 'app-age-group-auto-complete',
  imports: [
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatIconModule,
    MatIconButton
],
  templateUrl: './age-group-auto-complete.html',
})
export class AgeGroupAutoComplete implements OnInit {
  @Input() form!: FormGroup;
  @Input() ageGroup!: AgeGroupModel|null;
  @Input() loading!: WritableSignal<boolean>;
  @Output() onAction = new EventEmitter<AgeGroupModel|null>();

  
  fb = inject(FormBuilder);
  language = inject(Language);
  parmas = inject(ParamsService);
  ageGroupEndpoints = inject(AgeGroupEndpoints);

  ngOnInit(): void {
    this.form.addControl('ageGroup', this.fb.control(this.ageGroup));
    this.form.addControl('ageGroupId', this.fb.control(this.ageGroup?.id??""));
    this.setupAutocompletes();
  }

  ageGroup$ = of<AgeGroupModel[]>([]);
  ageGroupName: string|undefined;
  
  setupAutocompletes() {

    const paramsItem = this.parmas.loadGenericFromUrl();
    this.ageGroupName = paramsItem['ageGroupName'];   

    this.ageGroup$ = this.form.get('ageGroup')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        this.loading.set(true);
        return this.ageGroupEndpoints.get(this.ageGroupName??value,1, 20);
      }),
      map(response => response.content),
      tap(_=>{
        this.loading.set(false)
      })
    );

    this.ageGroupName = undefined;
    
    this.ageGroup$.subscribe(x=>{
      this.onAction.emit(x[0]);
      if(this.ageGroup)
        this.form.get('ageGroup')?.setValue(x[0]??'',{emitEvent:false});
    })
    
  }
  

  displayFn = (option?: AgeGroupModel): string =>  {
    return option ? option.name : '';
  }

  onAgeGroupSelected(event: any) {
    this.form.patchValue({ AgeGroupId: event.option.value.id });
    this.onAction.emit(event.option.value);
  }

  clear(){
    this.form.patchValue({ AgeGroupId: null , ageGroup: null});
    this.onAction.emit(null);
  }
}
