import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface Params {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class ParamsService {
  constructor(private router: Router, private route: ActivatedRoute) {}

  loadFromUrl<T extends Params>(defaultFilter: T): T {
    const params = this.route.snapshot.queryParams;

    const filter: any = {};
    for (const key of Object.keys(defaultFilter)) {
      if (params.hasOwnProperty(key)) {
        const value = params[key];
        if (typeof defaultFilter[key] === 'string' || defaultFilter[key] === undefined) {
          filter[key] = value !== null && value !== undefined ? String(value) : null;
        } else {
          filter[key] = isNaN(+value) ? value : +value;
        }
      } else {
        filter[key] = null;
      }
    }

    return filter as T;
  }

  setToUrl<T extends Params>(filter: T): void {
    const queryParams: any = {};

    for (const key of Object.keys(filter)) {
      const value = filter[key];
      if (value !== null && value !== '') {
        if(typeof value == 'string' && value.trim().length == 0)
          continue;
        queryParams[key] = value;
      }
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace',
    });
  }
}
