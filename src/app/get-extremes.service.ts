import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetExtremesService {
  constructor() {}

  setExtremes(rates) {
    let ratesWithExtremes = rates;
    const extremes = this.getExtremes(rates);
    ratesWithExtremes = this.setMin(extremes, ratesWithExtremes);
    ratesWithExtremes = this.setMax(extremes, ratesWithExtremes);
    return ratesWithExtremes;
  }

  getExtremes(rates) {
    const constRatesByValue = rates.sort((a, b) => a.value - b.value);
    return {
      min: constRatesByValue[0],
      max: constRatesByValue[constRatesByValue.length - 1]
    };
  }

  setMin(extremes, rates): Array<any> {
    debugger;
    return rates.map(rate => {
      if (rate.value === extremes.min) {
        rate.min = true;
      }
      return rate;
    });
  }

  setMax(extremes, rates): Array<any> {
    return rates.map(rate => {
      if (rate.value === extremes.max) {
        rate.max = true;
      }
      return rate;
    });
  }
}
