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
  
export function fromTimeMustLessThanToTimeValidator(
  control: AbstractControl
): ValidationErrors | null {

  const fromTime = control.get('fromTime')?.value;
  const toTime   = control.get('toTime')?.value;

  if (!fromTime || !toTime) {
    return null;
  }

  const fromMinutes = convert12HourTimeToMinutes(fromTime);
  
  const toMinutes   = convert12HourTimeToMinutes(toTime);
  
  if (fromMinutes >= toMinutes) {
    
    return { timeRangeInvalid: true };
  }

  return null;
}

function convert12HourTimeToMinutes(time: string): number {
  // Example: "12:00 AM", "01:30 PM"
  const [timePart, modifier] = time.trim().split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);

  if (modifier.toUpperCase() === 'AM') {
    if (hours === 12) hours = 0;
  } else { // PM
    if (hours !== 12) hours += 12;
  }

  return hours * 60 + minutes;
}


export function MinutesAndHoursTimeValidator(
  control: AbstractControl
): ValidationErrors | null {

  const hours = control.get('hours')?.value ?? 0 as number;
  const minutes   = control.get('minutes')?.value ?? 0 as number;

  if (hours < 0 || hours > 23) {
    return { invalidHours: true };
  }
  
  if (minutes < 0 || minutes > 59) {
    return { invalidMinutes: true };
  }

  if (hours == 0 && minutes == 0) {
    return { timeCannotBeZero: true };
  }

  return null;
}