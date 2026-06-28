import { Component, Inject, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Language } from '../../../../../core/services/language';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ClassModel } from '../../endpoints/models/class/class-model';
import { debounceTime, map, of, startWith, switchMap } from 'rxjs';
import { ClassEndpoints } from '../../endpoints/class-endpoint';
import { SelectedAcademicYearService } from '../../../../../core/services/selected-academic-year.service';
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
export class ClassAutoComplete implements OnInit,OnChanges {
  @Input() form!: FormGroup;
  @Input() ageGroupId!: number | undefined;
  
  fb = inject(FormBuilder);
  language = inject(Language);

  classEndpoints = inject(ClassEndpoints);
  selectedAcademicYearSvc = inject(SelectedAcademicYearService);

  ngOnInit(): void {
    this.form.addControl('class', this.fb.control(''));
    this.form.addControl('classId', this.fb.control(''));
    this.setupAutocompletes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ageGroupId']) {
      const prev = changes['ageGroupId'].previousValue;
      const curr = changes['ageGroupId'].currentValue;

      if (curr !== prev && curr != null) {
        this.form.patchValue({ class: '' });
      }
    }
  }



  class$ = of<ClassModel[]>([]);

  setupAutocompletes() {
    this.class$ = this.form.get('class')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        return this.classEndpoints.get({
          ageGroup: this.ageGroupId ? { id: this.ageGroupId } as any : undefined,
          academicYear: this.selectedAcademicYearSvc.selected() ?? undefined,
          pageNumber: 1,
          pageSize: 20,
        });
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
