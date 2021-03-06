import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  scale: string; // how may days are needed in cache
  constructor() {}

  getStartMonthDate(): string {
    this.scale = 'month';
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth()).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  getCurrentDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  getYesterdayDate(): string {
    const today = new Date();
    let dd = String(today.getDate() - 1).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    // don't use holidays, take friday instead
    if (today.getDay() === 0) {
      dd = String(today.getDate() - 2).padStart(2, '0');
    }
    if (today.getDay() === 6) {
      dd = String(today.getDate() - 1).padStart(2, '0');
    }
    return yyyy + '-' + mm + '-' + dd;
  }
  // takes array of rates and returns the last rate in the list
  getLastDate(rates: Array<{ date: string; value: number }>) {
    const last = rates[rates.length - 1].date;
    return last;
  }
}
