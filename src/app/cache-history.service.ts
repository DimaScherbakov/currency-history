import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CacheHistoryService {
  currencyData;
  isCachedData;
  constructor() {}

  getCachedHistory(base, symbols) {
    const nameCurrencyPair = symbols + '__' + base;
    const rates = localStorage.getItem(nameCurrencyPair);
    return {
      rates: JSON.parse(rates),
      base: base,
      symbols: symbols
    };
  }

  setCachedHistory(response) {
    const nameCurrencyPair = response.symbols + '__' + response.base;
    localStorage.setItem(nameCurrencyPair, JSON.stringify(response.rates));
  }
}
