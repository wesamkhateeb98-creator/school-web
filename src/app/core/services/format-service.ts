import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class FormatService {
  ToDateOnly(date:Date)
  {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().substring(0, 10);
  }
}
