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
  const [year, month, day] = dateString.split("-").map(Number);
  
  return new Date(year, month - 1, day);
}

export function time12hTo24(time: string): string {
  const [timePart, modifier] = time.trim().split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);

  if (modifier.toUpperCase() === 'AM') {
    if (hours === 12) hours = 0;
  } else {
    if (hours !== 12) hours += 12;
  }

  return `${hours}:${minutes}:00`;
}

export function time24hTo12(time: string, language:Language): string {
  
  const [hours, minutes] = time.split(':').map(Number);
  
  let period = language.transform('am');
  let displayHours = hours;
  
  if (hours >= 12) {
    period = language.transform('pm');
    if (hours > 12) {
      displayHours = hours - 12;
    }
  }
  
  if (hours === 0) {
    displayHours = 12;
  }
  
  const paddedMinutes = minutes.toString().padStart(2, '0');

  return `${displayHours}:${paddedMinutes} ${period}`;
}