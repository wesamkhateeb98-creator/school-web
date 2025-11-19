import { MatSnackBarConfig } from "@angular/material/snack-bar";

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