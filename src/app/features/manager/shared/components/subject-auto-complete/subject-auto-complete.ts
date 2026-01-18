import { Component, EventEmitter, inject, Input, OnInit, Output, signal, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Language } from '../../../../../core/services/language';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, map, skip, startWith, switchMap, takeWhile, tap } from 'rxjs';
import { MatIconModule } from "@angular/material/icon";
import { MatIconButton } from '@angular/material/button';
import { ParamsService } from '../../../../../core/services/params-service';1
import { SubjectViewModel } from '../../../pages/subject/model/subject-view-model';
import { SubjectEndpoints } from '../../endpoints/subject-endpoint';

@Component({
  selector: 'app-subject-auto-complete',
  imports: [
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatIconButton
],
  templateUrl: './subject-auto-complete.html',
})
export class SubjectAutoComplete implements OnInit {
  @Input() form!: FormGroup;
  @Input() subject!: SubjectViewModel|null;
  @Input() loading!: WritableSignal<boolean>;
  @Input() checkUrl!: boolean;


  
  fb = inject(FormBuilder);
  language = inject(Language);
  parmas = inject(ParamsService);
  subjectEndpoints = inject(SubjectEndpoints);

  ngOnInit(): void {
    this.form.addControl('subject', this.fb.control(this.subject));
    this.form.addControl('subjectId', this.fb.control(this.subject?.id??""));
    this.setupAutocompletes();
    if(this.checkUrl)
      this.loadDataFromUrl()
  }

  loadDataFromUrl(){
    const paramsItem = this.parmas.loadGenericFromUrl();
    if(paramsItem['subjectName'])
      this.subjectEndpoints.get(1,1,paramsItem['subjectName'])
        .subscribe(x=>{
          this.form.get('subject')?.setValue(x.content[0]??'',{emitEvent:false});
          this.form.get('subjectId')?.setValue(x.content[0].id??'',{emitEvent:false});
        })
  }

  subjectItems= signal<SubjectViewModel[]>([]);
  
  setupAutocompletes() {
    const paramsItem = this.parmas.loadGenericFromUrl();
    
    const hasParam = !!paramsItem['subjectName'];

    let source$ = this.form.get('subject')!.valueChanges;
    
    if (!hasParam) {
      source$ = source$.pipe(startWith(''));
    }

    source$.pipe(
      debounceTime(300),
      switchMap(value => this.subjectEndpoints.get(1, 20,value)),
      map(response => response.content),
      tap(() => this.loading.set(false))
    ).subscribe(x => {
      this.subjectItems.set(x);
    });
  }
  

  displayFn = (option?: SubjectViewModel): string =>  {
    return option ? option.name : '';
  }

  onsubjectSelected(event: any) {
    this.form.patchValue({ subjectId: event.option.value.id });
    if(this.checkUrl)
    this.parmas.setToUrl(({...this.parmas.loadGenericFromUrl(),subjectId:event.option.value.id}))
  }

  clear(){
    this.form.patchValue({ subject: null , subjectId: null});
    const { subjectId, ...r } = this.parmas.loadGenericFromUrl();
    this.parmas.setToUrl(({...r}))
  }
}
