import { Inject, inject, Injectable, LOCALE_ID, Optional } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Language } from '../../core/services/language';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {

  constructor(public language:Language) {
    super();
    
  }

  // 1. Customize the length-of-page label
  override itemsPerPageLabel = '';

  // 3. Customize the range text (e.g., "1 – 10 de 100")
  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0) {
      return `1 ${this.language.transform('of')} 1`;
    }
    const startIndex = page * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, length);
    return `${startIndex} - ${endIndex} ${this.language.transform('of')} ${length}`;
  };
}