import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class FormatService {
  ToDateOnly(date:Date)
  {
    console.log(date);
    if(date.toString().match("^(0[1-9]|[12][0-9]|3[01])[\/-](0[1-9]|1[0-2])[\/-]\d{4}$"))
      return date.toString();
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().substring(0, 10);
  }

 stringToDate(dateString:string){
  const [year, month, day] = dateString.split("-").map(Number);
  
  return new Date(year, month - 1, day);
}
}
