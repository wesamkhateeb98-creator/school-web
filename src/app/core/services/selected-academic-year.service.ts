import { Injectable, signal, computed } from '@angular/core';
import { AcademicYearEndpoints } from '../../features/manager/shared/endpoints/academic-year-endpoints';
import { AcademicYearModel } from '../../features/manager/pages/academic-year/model/academic-year-model';

const STORAGE_KEY = 'selectedAcademicYearId';

@Injectable({ providedIn: 'root' })
export class SelectedAcademicYearService {
  academicYears = signal<AcademicYearModel[]>([]);
  selectedId    = signal<number | null>(null);
  loading       = signal<boolean>(true);

  selected = computed(() =>
    this.academicYears().find(y => y.id === this.selectedId()) ?? null
  );

  constructor(private endpoints: AcademicYearEndpoints) {
    this.loadYears();
  }

  private loadYears(): void {
    this.loading.set(true);
    this.endpoints.get(1, 100).subscribe({
      next: page => {
        this.academicYears.set(page.content);
        const savedId = localStorage.getItem(STORAGE_KEY);
        if (savedId) {
          const id = Number(savedId);
          const found = page.content.find(y => y.id === id);
          this.selectedId.set(found ? id : (page.content[0]?.id ?? null));
        } else {
          this.selectedId.set(page.content[0]?.id ?? null);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  select(id: number): void {
    this.selectedId.set(id);
    localStorage.setItem(STORAGE_KEY, String(id));
  }
}
