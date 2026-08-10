import { Component, OnDestroy, computed, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Language } from '../../../core/services/language';

const TYPE_SPEED_MS = 65;
const ERASE_SPEED_MS = 35;
const HOLD_FULL_MS = 2200;
const HOLD_EMPTY_MS = 500;

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout implements OnDestroy {

  displayedMotto = signal('');

  private typeTimer: ReturnType<typeof setTimeout> | null = null;
  private reducedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(public language:Language){
    const motto = computed(() => this.language.transform('login_motto'));

    effect(() => {
      this.startTypewriter(motto());
    });
  }

  private startTypewriter(text: string){
    if(this.typeTimer){
      clearTimeout(this.typeTimer);
    }

    if(this.reducedMotion){
      this.displayedMotto.set(text);
      return;
    }

    const step = (index: number, typing: boolean) => {
      this.displayedMotto.set(text.slice(0, index));

      if(typing){
        this.typeTimer = index < text.length
          ? setTimeout(() => step(index + 1, true), TYPE_SPEED_MS)
          : setTimeout(() => step(index, false), HOLD_FULL_MS);
      } else {
        this.typeTimer = index > 0
          ? setTimeout(() => step(index - 1, false), ERASE_SPEED_MS)
          : setTimeout(() => step(0, true), HOLD_EMPTY_MS);
      }
    };

    step(0, true);
  }

  ngOnDestroy(){
    if(this.typeTimer){
      clearTimeout(this.typeTimer);
    }
  }
}
