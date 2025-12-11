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

export function maxYearValidator(maxYear: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; 

    const inputDate = new Date(control.value);
    if (isNaN(inputDate.getTime())) {
      return { invalidDate: true }; 
    }

    if (inputDate.getFullYear() > maxYear) {
      return { maxYearExceeded: { maxYear } };
    }

    return null;
  };
}