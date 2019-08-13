import { Injectable } from '@angular/core';
import { DateService } from './date.service';
@Injectable({
  providedIn: 'root'
})
export class CacheHistoryService {
  currencyData;
  constructor(private dataService: DateService) {}

  getCachedHistory(base, symbols) {
    const nameCurrencyPair = base + '__' + symbols;
    const rates = localStorage.getItem(nameCurrencyPair);
    return {
      rates: JSON.parse(rates),
      base: base,
      symbols: symbols
    };
  }

  setCachedHistory(response) {
    const nameCurrencyPair = response.base + '__' + response.symbols;
    localStorage.setItem(nameCurrencyPair, JSON.stringify(response.rates));
  }
  updateCachedHistory(response) {
    const nameCurrencyPair = response.base + '__' + response.symbols;
    const previousData = JSON.parse(localStorage.getItem(nameCurrencyPair));
    let allData = previousData.concat(response.rates);
    allData = this.removeDuplicatedRates(allData);
    localStorage.setItem(nameCurrencyPair, JSON.stringify(allData));
  }

  removeDuplicatedRates(rates) {
    return rates.reduce((acc, current) => {
      const x = acc.find(item => item.date === current.date);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  }
  removeOldRates(rates: Array<any>) {
    // set count of days to save in cache
    const scale = this.getScale(this.dataService.scale);
    const length = rates.length;
    const start = length - scale <= 0 ? 0 : length - scale;
    return rates.slice(start, length - 1);
  }

  getScale(scale) {
    switch (scale) {
      case 'month':
        return 30;
      default:
        return 30;
    }
  }
}
