import { MatSnackBarConfig } from "@angular/material/snack-bar";
import { PhrasesType } from "./resource/phrases";
import { inject } from "@angular/core";
import { Language } from "./services/language";

export const errorMatSnackbarConfig:MatSnackBarConfig =
{
    duration: 3000,
    panelClass: ['error-snackbar'],
    horizontalPosition:'end',
    verticalPosition:'bottom'
}

export const successMatSnackbarConfig:MatSnackBarConfig =
{
    duration: 3000, 
    panelClass: ['success-snackbar'],
    horizontalPosition:'end',
    verticalPosition:'bottom'
}

export const messageTitle = (title: PhrasesType) => {
  return () => {
    const language = inject(Language);
    return language.transform(title);
  };
};