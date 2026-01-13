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

@Component({
  selector: 'app-age-group-auto-complete',
  imports: [
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatIconButton
],
  templateUrl: './age-group-auto-complete.html',
})
export class AgeGroupAutoComplete implements OnInit {
  @Input() form!: FormGroup;
  @Input() ageGroup!: AgeGroupModel|null;
  @Input() loading!: WritableSignal<boolean>;

  
  fb = inject(FormBuilder);
  language = inject(Language);
  parmas = inject(ParamsService);
  ageGroupEndpoints = inject(AgeGroupEndpoints);

  ngOnInit(): void {
    this.form.addControl('ageGroup', this.fb.control(this.ageGroup));
    this.form.addControl('ageGroupId', this.fb.control(this.ageGroup?.id??""));
    this.setupAutocompletes();
    this.loadDataFromUrl()
  }

  loadDataFromUrl(){
    const paramsItem = this.parmas.loadGenericFromUrl();
    if(paramsItem['ageGroupName'])
      this.ageGroupEndpoints.get(paramsItem['ageGroupName'],1, 20)
        .subscribe(x=>{
          this.form.get('ageGroup')?.setValue(x.content[0]??'',{emitEvent:false});
        })
  }

  ageGroupItems= signal<AgeGroupModel[]>([]);
  
  setupAutocompletes() {
    const paramsItem = this.parmas.loadGenericFromUrl();
    
    const hasParam = !!paramsItem['ageGroupName'];

    let source$ = this.form.get('ageGroup')!.valueChanges;

    if (!hasParam) {
      source$ = source$.pipe(startWith(null));
    }

    source$.pipe(
      debounceTime(300),
      switchMap(value => this.ageGroupEndpoints.get(value, 1, 20)),
      map(response => response.content),
      tap(() => this.loading.set(false))
    ).subscribe(x => {
      this.ageGroupItems.set(x);
    });
    
  }
  

  displayFn = (option?: AgeGroupModel): string =>  {
    return option ? option.name : '';
  }

  onAgeGroupSelected(event: any) {
    this.form.patchValue({ AgeGroupId: event.option.value.id });
    this.parmas.setToUrl(({...this.parmas.loadGenericFromUrl(),ageGroupName:event.option.value.name}))
  }

  clear(){
    this.form.patchValue({ AgeGroupId: null , ageGroup: null});
    const { ageGroupName, ...r } = this.parmas.loadGenericFromUrl();
    this.parmas.setToUrl(({...r}))
  }
}
