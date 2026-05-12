import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';
import { Language } from '../../../../../core/services/language';
import { AgeGroupEndpoints } from '../../endpoints/age-group-endpoint';
import { SubjectForAgeGroupModel } from '../../endpoints/models/age-group/subject-for-age-group-model';
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({
  selector: 'app-subject-age-group-auto-complete',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatIconButton,
    MatProgressBarModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subject-age-group-auto-complete.html',
})
export class SubjectAgeGroupAutoComplete implements OnInit {
  @Input() form!: FormGroup;
  @Input() required = false;
  @Input() initialSubjectAgeGroupId: number | null = null;

  @Input() set ageGroupId(val: number | null) {
    this._ageGroupId.set(val);
    if (this._initialized) {
      this.onAgeGroupIdChange(val);
    }
  }

  language         = inject(Language);
  ageGroupEndpoints = inject(AgeGroupEndpoints);

  displayControl = new FormControl<SubjectForAgeGroupModel | string | null>(null);

  private _ageGroupId   = signal<number | null>(null);
  private _initialized  = false;
  private _allSubjects  = signal<SubjectForAgeGroupModel[]>([]);

  loadingSubjects = signal(false);
  filtered        = signal<SubjectForAgeGroupModel[]>([]);
  disabled        = computed(() => this.loadingSubjects() || this._ageGroupId() === null);

  ngOnInit() {
    if (!this.form.contains('subjectAgeGroupId')) {
      const ctrl = new FormControl<number | null>(null);
      this.form.addControl('subjectAgeGroupId', ctrl);
    }

    this.displayControl.valueChanges.pipe(debounceTime(200)).subscribe(val => {
      if (!val || typeof val === 'string') {
        const search = (val as string | null)?.toLowerCase() ?? '';
        this.filtered.set(
          search
            ? this._allSubjects().filter(s => s.name.toLowerCase().includes(search))
            : this._allSubjects(),
        );
      }
    });

    const initialAgeGroupId = this._ageGroupId();
    if (initialAgeGroupId !== null) {
      this.loadSubjects(initialAgeGroupId);
    }

    this._initialized = true;
  }

  private onAgeGroupIdChange(val: number | null) {
    this.displayControl.setValue(null, { emitEvent: false });
    this.form.get('subjectAgeGroupId')!.setValue(null, { emitEvent: false });
    this._allSubjects.set([]);
    this.filtered.set([]);

    if (val !== null) {
      this.loadSubjects(val);
    }
  }

  private loadSubjects(ageGroupId: number) {
    this.loadingSubjects.set(true);
    this.displayControl.disable({ emitEvent: false });

    this.ageGroupEndpoints.getSubjects(ageGroupId, 1, 200).subscribe({
      next: page => {
        this._allSubjects.set(page.content);
        this.filtered.set(page.content);
        this.loadingSubjects.set(false);
        this.displayControl.enable({ emitEvent: false });

        if (this.initialSubjectAgeGroupId) {
          const match = page.content.find(s => s.id === this.initialSubjectAgeGroupId);
          if (match) {
            this.displayControl.setValue(match, { emitEvent: false });
            this.form.get('subjectAgeGroupId')!.setValue(match.id, { emitEvent: false });
          }
        }
      },
      error: () => {
        this.loadingSubjects.set(false);
        this.displayControl.enable({ emitEvent: false });
      },
    });
  }

  displayFn = (option?: SubjectForAgeGroupModel | string | null): string => {
    if (!option || typeof option === 'string') return (option as string) ?? '';
    return option.name;
  };

  onSelected(event: { option: { value: SubjectForAgeGroupModel } }) {
    this.form.get('subjectAgeGroupId')!.setValue(event.option.value.id, { emitEvent: true });
  }

  clear() {
    this.displayControl.setValue(null, { emitEvent: false });
    this.form.get('subjectAgeGroupId')!.setValue(null, { emitEvent: true });
    this.filtered.set(this._allSubjects());
  }
}
