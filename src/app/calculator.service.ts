import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  name;
  constructor() {}

  getMaxBet(rates, extremes, recommends, name) {
    this.name = name;
    const deposit = 100; // get data from user component
    const currentRate = rates.sort((a, b) => {
      // use new variables to calm down the linter
      const dateA: any = new Date(a.date);
      const dateB: any = new Date(b.date);
      return dateA - dateB;
    })[rates.length - 1];
    const worstRate = this.getWorstRate(extremes, recommends);
    if (!worstRate) {
      return null;
    }
    return deposit / (currentRate.value - worstRate);
  }

  private getWorstRate(extremes, recommends) {
    const errorText = `(${
      this.name
    }) We have recomendations to sell and buy currency at the same time, rates list might not have enough data`;
    if (recommends.sell && recommends.buy) {
      if (this.name !== 'BGN EUR') {
        // throw new Error(errorText);
        console.error(errorText);
      }
      console.error(errorText);
    }
    // choose which extremum to use , it depends on recommendation to sell or buy
    const totalRange = this.getTotalRange(extremes);
    const percentValue = this.getPercentValue(10, totalRange);
    if (recommends.buy) {
      return extremes.min.value - percentValue;
    }
    if (recommends.sell) {
      return extremes.max.value + percentValue;
    }
    return null;
  }

  private getTotalRange(extremes): number {
    return extremes.max.value - extremes.min.value;
  }
  getPercentValue(percent, totalRange): number {
    return (percent / 100) * totalRange;
  }
}
