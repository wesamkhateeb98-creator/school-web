import { computed, effect, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Phrases, PhrasesType } from '../resource/phrases';

export type LanguageType = 'ar' | 'en';

export type DirectionType = 'ltr' | 'rtl';

const LANGUAGE = "language"

@Injectable({
  providedIn: 'root',
})

export class Language {
  
  public language = signal<LanguageType>('en');

  public direction = computed<DirectionType>(()=> this.language() == 'ar'? 'rtl':"ltr")

   constructor(public router:Router){
    if (typeof localStorage !== 'undefined') {
      const language = localStorage.getItem(LANGUAGE) as LanguageType
      
      if(language)
      {
        this.language.set(language); 
      }

      effect(()=>{
        document.documentElement.dir = this.direction();
        document.documentElement.lang = this.language();
        localStorage.setItem(LANGUAGE,this.language());
      })
    }
  }

  setLanguage(value:LanguageType){
    this.language.set(value);
    window.location.reload();
  }

  transform(value: PhrasesType ): string {
    return Phrases[this.language()][value];
  }
}
