import { inject, Inject, Injectable } from "@angular/core";
import { Language } from "../../services/language";

@Injectable({
  providedIn: 'root',
})

export class PermissionService {

  private language = inject(Language);

  permissions: { id: number; name: string }[];

  constructor() {
    this.permissions = [
      { id: 1, name: this.language.transform('educational_supervisor_title') },
      { id: 2, name: this.language.transform('registrar_title') }
    ];
  }

  getPermissionById(id: number) {
    return this.permissions.find(p => p.id === id) ?? null;
  }
}


