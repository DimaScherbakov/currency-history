import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetExtremesService {
  constructor() {}

  addExtremes(rates) {
    // sort rates by value
    let sortedRates = this.sortRates(rates);
    sortedRates = this.addMin(sortedRates);
    sortedRates = this.addMax(sortedRates);

    return this.sortByDate(sortedRates);
  }

  sortRates(rates) {
    return rates.sort((a, b) => a.value - b.value);
  }

  addMin(rates) {
    rates[0].min = true;
    return rates;
  }
  addMax(rates) {
    rates[rates.length - 1].max = true;
    return rates;
  }
  sortByDate(rates) {
    return rates.sort((a, b) => {
      // use new variables to calm down the linter
      const dateA: any = new Date(a.date);
      const dateB: any = new Date(b.date);
      return dateA - dateB;
    });
  }

  getExtremes(rates) {
    const extremes = {};
    rates.forEach(rate => {
      if (rate.min) {
        extremes['min'] = rate;
      }
      if (rate.max) {
        extremes['max'] = rate;
      }
    });
    return extremes;
  }
}
