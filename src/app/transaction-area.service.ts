import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionAreaService {
  transferCurrency$ = new EventEmitter();

  constructor() {}

  getBorders(
    rates: any[],
    extremes
  ): { minBorder; maxBorder; recomendations: {} } {
    const totalRange = this.getTotalRange(extremes);
    const transactionRange = this.getTransactionRange(10, totalRange);
    const minBorder = this.getMinBorder(extremes.min, transactionRange);
    const maxBorder = this.getMaxBorder(extremes.max, transactionRange);
    const recomendations = this.getRecommends(rates, minBorder, maxBorder);
    return {
      minBorder: minBorder,
      maxBorder: maxBorder,
      recomendations: recomendations
    };
  }

  getTotalRange(extremes): number {
    return extremes.max.value - extremes.min.value;
  }

  getTransactionRange(percent, totalRange): number {
    return (percent / 100) * totalRange;
  }

  getMinBorder(min, range) {
    const minBorder = min.value + range;
    return { date: min.date, value: minBorder };
  }
  getMaxBorder(max, range) {
    const maxBorder = max.value - range;
    return { date: max.date, value: maxBorder };
  }
  getRecommends(rates, minBorder, maxBorder) {
    const recommends = { sell: false, buy: false };
    const sortedRates = rates.sort((a, b) => {
      // use new variables to calm down the linter
      const dateA: any = new Date(a.date);
      const dateB: any = new Date(b.date);
      return dateA - dateB;
    });
    const lastRate = sortedRates[sortedRates.length - 1];
    if (lastRate.value <= minBorder.value) {
      recommends.buy = true;
    }
    if (lastRate.value >= maxBorder.value) {
      recommends.sell = true;
    }
    return recommends;
  }
  emitCurrency(value) {
    this.transferCurrency$.emit(value);
  }
}
