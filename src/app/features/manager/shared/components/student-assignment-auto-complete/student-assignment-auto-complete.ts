import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { debounceTime } from 'rxjs';
import { Language } from '../../../../../core/services/language';
import { AssignmentEndpoints } from '../../endpoints/assignment-endpoint';
import { StudentForAssignmentItem } from '../../../pages/assignments/model/assignment.model';

@Component({
  selector: 'app-student-assignment-auto-complete',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatIconButton,
    MatProgressBarModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StudentAssignmentAutoComplete),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-assignment-auto-complete.html',
})
export class StudentAssignmentAutoComplete implements OnInit, ControlValueAccessor {
  @Input() classAssignmentId: number | null = null;

  language            = inject(Language);
  assignmentEndpoints = inject(AssignmentEndpoints);

  displayControl = new FormControl<StudentForAssignmentItem | string | null>(null);
  loading        = signal(false);
  options        = signal<StudentForAssignmentItem[]>([]);

  private _onChange: (value: number | null) => void = () => {};
  private _onTouched: () => void = () => {};

  ngOnInit() {
    this.displayControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(val => {
        if (typeof val === 'string') {
          this.search(val);
        }
      });
  }

  writeValue(value: number | null): void {
    if (!value) {
      this.displayControl.setValue(null, { emitEvent: false });
      this.options.set([]);
    }
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) this.displayControl.disable();
    else this.displayControl.enable();
  }

  onFocus() {
    if (typeof this.displayControl.value !== 'object' || this.displayControl.value === null) {
      this.search(typeof this.displayControl.value === 'string' ? this.displayControl.value : '');
    }
  }

  onBlur() {
    this._onTouched();
  }

  private search(name: string) {
    this.loading.set(true);
    this.assignmentEndpoints
      .getStudentsForDropdown(1, 20, this.classAssignmentId ?? undefined, name || undefined)
      .subscribe({
        next: page => {
          this.options.set(page.content);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  displayFn = (option?: StudentForAssignmentItem | string | null): string => {
    if (!option || typeof option === 'string') return (option as string) ?? '';
    return option.name;
  };

  onSelected(event: { option: { value: StudentForAssignmentItem } }) {
    this._onChange(event.option.value.studentId);
  }

  clear() {
    this.displayControl.setValue(null, { emitEvent: false });
    this.options.set([]);
    this.search('');
    this._onChange(null);
    this._onTouched();
  }
}
