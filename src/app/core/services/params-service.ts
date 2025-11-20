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

  loadFromUrl<T extends Params>(): T {
    const params = this.route.snapshot.queryParams;

    const filter: any = {};

    for (const key of Object.keys(params)) {
      const value = params[key];
      filter[key] = isNaN(+value) ? value : +value; // auto convert numbers
    }

    return filter as T;
  }

  setToUrl<T extends Params>(filter: T): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...filter },
      queryParamsHandling: 'merge'
    });
  }
}

