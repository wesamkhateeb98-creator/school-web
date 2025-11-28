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
