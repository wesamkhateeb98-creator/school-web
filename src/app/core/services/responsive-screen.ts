import { Injectable, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveScreen {
  isMobile = signal(false);  
  subscribe:Subscription | undefined;


  constructor(private breakpointObserver:BreakpointObserver ){
      this.subscribe = breakpointObserver
        .observe([Breakpoints.XSmall])
        .subscribe(result => {
          this.isMobile.set(result.matches);
        });
  }

  destroy():void{
    this.subscribe?.unsubscribe;
  }
}
