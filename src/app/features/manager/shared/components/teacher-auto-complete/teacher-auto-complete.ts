import { Component, EventEmitter, inject, Input, OnInit, Output, signal, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Language } from '../../../../../core/services/language';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, map, skip, startWith, switchMap, takeWhile, tap } from 'rxjs';
import { MatIconModule } from "@angular/material/icon";
import { MatIconButton } from '@angular/material/button';
import { ParamsService } from '../../../../../core/services/params-service';
import { TeacherViewModel } from '../../../pages/teacher-page/view-model/teacher-view-model';
import { TeacherEndpoints } from '../../endpoints/teacher-endpoint';
import { TeacherFilterViewModel } from '../../../pages/teacher-page/view-model/teacher-filter-view-model';
import { TeacherModel } from '../../endpoints/models/teacher/teacher-model';

@Component({
  selector: 'app-teacher-auto-complete',
  imports: [
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatIconButton
],
  templateUrl: './teacher-auto-complete.html',
})
export class TeacherAutoComplete implements OnInit {
  @Input() form!: FormGroup;
  @Input() teacher!: TeacherViewModel|null;
  @Input() loading!: WritableSignal<boolean>;
  @Input() checkUrl!: boolean;


  
  fb = inject(FormBuilder);
  language = inject(Language);
  parmas = inject(ParamsService);
  teacherEndpoints = inject(TeacherEndpoints);

  ngOnInit(): void {
    this.form.addControl('teacher', this.fb.control(this.teacher));
    this.form.addControl('teacherId', this.fb.control(this.teacher?.id??""));
    this.setupAutocompletes();
    if(this.checkUrl)
      this.loadDataFromUrl()
  }

  loadDataFromUrl(){
    const paramsItem = this.parmas.loadGenericFromUrl();
    if(paramsItem['teacherName'])
      this.teacherEndpoints.get({
        pageNumber:1,
        pageSize:1,
        name: paramsItem['teacherName'],
        phonenumber:undefined,
      } as TeacherFilterViewModel)
        .subscribe(x=>{
          this.form.get('teacher')?.setValue(x.content[0]??'',{emitEvent:false});
          this.form.get('teacherId')?.setValue(x.content[0].id??'',{emitEvent:false});
        })
  }

  teacherItems= signal<TeacherModel[]>([]);
  
  setupAutocompletes() {
    const paramsItem = this.parmas.loadGenericFromUrl();
    
    const hasParam = !!paramsItem['teacherName'];

    let source$ = this.form.get('teacher')!.valueChanges;
    
    if (!hasParam) {
      source$ = source$.pipe(startWith(''));
    }

    source$.pipe(
      debounceTime(300),
      switchMap(value => this.teacherEndpoints.get({
        pageNumber:1,
        pageSize:10,
        name: paramsItem['teacherName'],
        phonenumber:undefined,
      } as TeacherFilterViewModel)),
      map(response => response.content),
      tap(() => this.loading.set(false))
    ).subscribe(x => {
      this.teacherItems.set(x);
    });
  }
  

  displayFn = (option?: TeacherModel): string =>  {
    return option ? option.fullName : '';
  }

  onTeacherSelected(event: any) {
    if(this.checkUrl)
      this.form.patchValue({ teacherId: event.option.value.id });
    this.parmas.setToUrl(({...this.parmas.loadGenericFromUrl(),teacherId:event.option.value.id}))
  }

  clear(){
    this.form.patchValue({ teacher: null , teacherId: null});
    const { teacherId, ...r } = this.parmas.loadGenericFromUrl();
    this.parmas.setToUrl(({...r}))
  }
}
