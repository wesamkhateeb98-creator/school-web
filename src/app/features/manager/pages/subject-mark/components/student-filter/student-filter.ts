import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Language } from '../../../../../../core/services/language';
import { StudentMarkEntryEndpoints } from '../../../../shared/endpoints/student-mark-entry-endpoint';
import { StudentSimpleModel } from '../../../../shared/endpoints/models/student/student-simple-model';

@Component({
  selector: 'app-student-filter',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field style="min-width: 300px; flex: 1;">
      <mat-label>{{ language.transform('full_name_title') }}</mat-label>
      <input matInput [formControl]="searchControl" [matAutocomplete]="auto" />

      @if (loading()) {
        <mat-spinner matSuffix diameter="18" />
      } @else if (hasValue()) {
        <button matSuffix mat-icon-button (click)="clear()">
          <mat-icon>close</mat-icon>
        </button>
      }

      <mat-autocomplete #auto [displayWith]="displayFn"
                        (optionSelected)="onSelect($event.option.value)">
        @for (student of students(); track student.id) {
          <mat-option [value]="student">{{ student.fullName }}</mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
})
export class StudentFilterComponent implements OnInit {
  language   = inject(Language);
  endpoints  = inject(StudentMarkEntryEndpoints);
  destroyRef = inject(DestroyRef);

  @Input() subjectAgeGroupId!: number;
  @Input() set initialStudent(val: { id: number; name: string } | null) {
    if (val) {
      this.searchControl.setValue({ id: val.id, fullName: val.name } as StudentSimpleModel, { emitEvent: false });
    }
  }

  @Output() studentSelected = new EventEmitter<number | null>();

  searchControl = new FormControl<StudentSimpleModel | string>('');
  students      = signal<StudentSimpleModel[]>([]);
  loading       = signal(false);

  hasValue = () => {
    const v = this.searchControl.value;
    return v !== null && v !== '' && v !== undefined;
  };

  displayFn = (s: StudentSimpleModel | string | null): string => {
    if (!s) return '';
    return typeof s === 'string' ? s : s.fullName;
  };

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        const name = typeof val === 'string' ? val.trim() : '';
        this.loading.set(true);
        return this.endpoints.getStudents(this.subjectAgeGroupId, 1, 20, name || undefined);
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: page => { this.students.set(page.content); this.loading.set(false); },
      error: ()   => this.loading.set(false),
    });
  }

  onSelect(student: StudentSimpleModel) {
    this.studentSelected.emit(student.id);
  }

  clear() {
    this.searchControl.setValue('', { emitEvent: true });
    this.studentSelected.emit(null);
  }
}
