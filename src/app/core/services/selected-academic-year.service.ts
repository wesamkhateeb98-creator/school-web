import { Injectable, signal, computed } from '@angular/core';
import { AcademicYearEndpoints } from '../../features/manager/shared/endpoints/academic-year-endpoints';
import { AcademicYearModel } from '../../features/manager/pages/academic-year/model/academic-year-model';
import { AcademicYearStatus } from '../enums/academic-year-status';

const STORAGE_KEY = 'selectedAcademicYearId';

@Injectable({ providedIn: 'root' })
export class SelectedAcademicYearService {
  academicYears = signal<AcademicYearModel[]>([]);
  selectedId    = signal<number | null>(null);
  loading       = signal<boolean>(true);
  hasError      = signal<boolean>(false);

  selected = computed(() =>
    this.academicYears().find(y => y.id === this.selectedId()) ?? null
  );

  constructor(private endpoints: AcademicYearEndpoints) {
    this.loadYears();
  }

  reload(): void {
    this.loadYears();
  }

  private loadYears(): void {
    this.loading.set(true);
    this.hasError.set(false);
    this.endpoints.get(1, 100).subscribe({
      next: page => {
        this.academicYears.set(page.content);

        const savedId = Number(localStorage.getItem(STORAGE_KEY));
        const found = savedId ? page.content.find(y => y.id === savedId) : null;

        if (found) {
          this.selectedId.set(found.id);
        } else {
          const defaultYear =
            page.content.find(y => y.status === AcademicYearStatus.Started) ??
            page.content[0];
          this.selectedId.set(defaultYear?.id ?? null);
        }

        this.loading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.loading.set(false);
      },
    });
  }

  select(id: number): void {
    this.selectedId.set(id);
    localStorage.setItem(STORAGE_KEY, String(id));
  }
}
