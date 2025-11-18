import { computed, effect, Injectable, signal } from '@angular/core';

const THEME_COLOR = "theme-color"
const THEME_MODE = "theme-mode"

export type ThemeType = 'light'|'dark' | 'system';

export type ColorType = 'green' | 'blue';


@Injectable({
  providedIn: 'root'
})

export class Theme {
  
  public theme = signal<ThemeType>('light');
  public color = signal<ColorType>('blue');

  public currenctTheme = computed(()=> `${this.theme() == 'system'? 'light dark' : this.theme()} ${this.color()}`)

  constructor(){
    if (typeof localStorage !== 'undefined') {
      const color = localStorage.getItem(THEME_COLOR) as ColorType
      
      this.color.set(color?color:'green'); 
      

      const theme = localStorage.getItem(THEME_MODE) as ThemeType
      
      
      this.theme.set(theme?theme:'light'); 
      

      effect(()=>{
        document.documentElement.className = this.currenctTheme();
        localStorage.setItem(THEME_COLOR,this.color())
        localStorage.setItem(THEME_MODE, this.theme())
      })
    }
    
  }

  setMode(value:ThemeType){
    this.theme.set(value);
  }

  setColor(value:ColorType){
    this.color.set(value);
  }
}
