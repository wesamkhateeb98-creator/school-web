import { Component, EventEmitter, inject, Input, OnInit, Output, signal, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Language } from '../../../../../core/services/language';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, map, skip, startWith, switchMap, takeWhile, tap } from 'rxjs';
import { MatIconModule } from "@angular/material/icon";
import { MatIconButton } from '@angular/material/button';
import { ParamsService } from '../../../../../core/services/params-service';
import { SemesterEndpoints } from '../../endpoints/semester-endpoints';
import { SemesterViewModel } from '../../../pages/semester/model/semester-view-model';
import { GetSemesterByAcademicYearModel } from '../../endpoints/models/semester/getSemesterByAcademicYearModel';
import { SelectedAcademicYearService } from '../../../../../core/services/selected-academic-year.service';

@Component({
  selector: 'app-academic-year-semester-auto-complete',
  imports: [
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatIconButton
],
  templateUrl: './academic-year-semester-auto-complete.html',
})
export class AcademicYearSemesterAutoComplete implements OnInit {
  @Input() form!: FormGroup;
  @Input() semester!: GetSemesterByAcademicYearModel|null;
  @Input() loading!: WritableSignal<boolean>;
  @Input() checkUrl!: boolean;

  fb = inject(FormBuilder);
  language = inject(Language);
  parmas = inject(ParamsService);
  semesterEndpoints = inject(SemesterEndpoints);
  selectedAcademicYearSvc = inject(SelectedAcademicYearService);

  ngOnInit(): void {
    this.form.addControl('semester', this.fb.control(this.semester));
    this.form.addControl('semesterId', this.fb.control(this.semester?.academicYearSemesterId??""));
    this.form.addControl('semesterFirstTime', this.fb.control(false));
    this.setupAutocompletes();
    if(this.checkUrl)
      this.loadDataFromUrl()
  }

  loadDataFromUrl(){
    const paramsItem = this.parmas.loadGenericFromUrl();
    if(paramsItem['semester'] || !this.form.get('semester')?.value )
      this.semesterEndpoints.getSemesterByAcademicYear({
        year: this.selectedAcademicYearSvc.selected()?.year,
        justStarted:false,
        PageNumber:1,
        pageSize:10
      })
        .subscribe(x=>{
          this.form.get('semester')?.setValue(x.content[0]??'',{emitEvent:false});
          this.form.get('semesterId')?.setValue(x.content[0].academicYearSemesterId??'',{emitEvent:false});
        })
  }

  semesterItems= signal<GetSemesterByAcademicYearModel[]>([]);
  
  setupAutocompletes() {
    const paramsItem = this.parmas.loadGenericFromUrl();
    
    const hasParam = !!paramsItem['semesterName'];

    let source$ = this.form.get('semester')!.valueChanges;

    if ((!hasParam || this.form.get('semesterLoadFirst')?.valid) && !this.semester) {
      source$ = source$.pipe(startWith(''));
    }

    source$.pipe(
      debounceTime(300),
      switchMap(() => this.semesterEndpoints.getSemesterByAcademicYear({
        year: this.selectedAcademicYearSvc.selected()?.year,
        justStarted:false,
        PageNumber:1,
        pageSize:20
      })),
      map(response => response.content),
      tap(() => this.loading.set(false))
    ).subscribe(x => {
      this.semesterItems.set(x);
      if(!this.form.get('semesterFirstTime')?.value ){
        let item;
        if(this.semester){
          item = x.find(x=>x.academicYearSemesterId == this.semester?.academicYearSemesterId);
          
        }else{
          item = x.find(x=>x.isActive);
        }
        // "semester" must land before "semesterId" in this same patch — FormGroup.patchValue
        // fires each control's own valueChanges as it sets that control, in object-key order.
        // Consumers that listen for semesterId changing and then read the full semester object
        // (its own template/date fields, not just the id) would otherwise see it still null,
        // since the previous two-call version emitted semesterId's change before semester was set.
        this.form.patchValue({
          semester: item ?? null,
          semesterId: item?.academicYearSemesterId ?? null,
          semesterFirstTime: true,
        });
      }
    });
  }
  

  displayFn = (option?: GetSemesterByAcademicYearModel): string =>  {
    return option ? `${option.year - 1}/${option.year} - ${option.startDate} ${this.language.transform('to')} ${option.endDate} - ${option.semesterName}` : '';
  }

  onSemesterSelected(event: any) {
    this.form.patchValue({ semesterId: event.option.value.academicYearSemesterId, semester: event.option.value });
    if(this.checkUrl)
      this.parmas.setToUrl(({...this.parmas.loadGenericFromUrl(),semesterId:event.option.value.id}))
  }

  clear(){
    this.form.patchValue({ semester: null , semesterId: null},{emitEvent:true});
    const { semesterId, ...r } = this.parmas.loadGenericFromUrl();
    this.parmas.setToUrl(({...r}))
  }
}
