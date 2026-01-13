import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Language } from '../../../../../core/services/language';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ClassModel } from '../../endpoints/models/class/class-model';
import { debounceTime, map, of, startWith, switchMap } from 'rxjs';
import { ClassEndpoints } from '../../endpoints/class-endpoint';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-class-auto-complete',
  imports: [
    MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './class-auto-complete.html',
})
export class ClassAutoComplete {

  @Input() form!: FormGroup;
  @Input() ageGroupId!: number | undefined;

  language = inject(Language);

  classEndpoints = inject(ClassEndpoints);

  constructor(){
    this.setupAutocompletes();
  }

  class$ = of<ClassModel[]>([]);

  setupAutocompletes() {
    this.class$ = this.form.get('class')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        return this.classEndpoints.getByOpenAcademicYear(1, 20,this.ageGroupId);
      }),
      map(response => response.content),
    );
  }
  

  displayClass(item: ClassModel): string {
    return item?`${item.ageGroupName} ${item.section}`:"";
  }

  onClassSelected(event: any) {
    this.form.patchValue({ classId: event.option.value.id });
  }
}
