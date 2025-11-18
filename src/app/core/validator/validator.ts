import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function equalValidator(num: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return control.value === num ? null : { notEqual: true };
    };
}


export function startDateMustLessEndDateValidator(control: AbstractControl) : ValidationErrors | null {
  const start = control.get('startDate')?.value;
  
  const end = control.get('endDate')?.value;
  
  if (start && end && new Date(start) > new Date(end)) {
    return { dateRangeInvalid: true };
  }
  return null;
}