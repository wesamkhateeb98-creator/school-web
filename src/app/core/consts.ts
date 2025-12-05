import { MatSnackBarConfig } from "@angular/material/snack-bar";
import { PhrasesType } from "./resource/phrases";
import { inject } from "@angular/core";
import { Language } from "./services/language";

export const errorMatSnackbarConfig = (language:Language): MatSnackBarConfig=>
{
  return {
    duration: 3000,
    panelClass: ['error-snackbar'],
    horizontalPosition: language.direction() == 'ltr'? 'end': 'start',
    verticalPosition:'bottom'
  }
}

export const successMatSnackbarConfig = (language:Language): MatSnackBarConfig=>
{
  return {
    duration: 3000, 
    panelClass: ['success-snackbar'],
    horizontalPosition: language.direction() == 'ltr'? 'end': 'start',
    verticalPosition:'bottom'
  }
}

export const messageTitle = (title: PhrasesType) => {
  return () => {
    const language = inject(Language);
    return language.transform(title);
  };
};

export function ToDateOnly(date:Date)
{
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().substring(0, 10);
}

export function StringToDate(dateString:string){
  console.log(dateString)
  const [year, month, day] = dateString.split("-").map(Number);
  console.log(new Date(year, month - 1, day));
  return new Date(year, month - 1, day);
}