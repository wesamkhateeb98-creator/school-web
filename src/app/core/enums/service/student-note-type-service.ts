import { inject, Inject, Injectable } from "@angular/core";
import { Language } from "../../services/language";

@Injectable({
  providedIn: 'root',
})

export class StudentNoteTypeService {

  private language = inject(Language);

  notes: { id: number; name: string }[];

  constructor() {
    this.notes = [
      { id: 1, name: this.language.transform('behavioral_title') },
      { id: 2, name: this.language.transform('academic_title') },
    ];
  }

  getNotesById(id: number) {
    return this.notes.find(p => p.id === id) ?? null;
  }
}


