import { Injectable } from '@angular/core';
import { DateService } from './date.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CacheHistoryService {
  currencyData;
  constructor(private dataService: DateService, private http: HttpClient) {}

  getCachedHistory(base, symbols) {
    const nameCurrencyPair = base + '__' + symbols;
    return this.http.get(`http://127.0.0.1:4000/${nameCurrencyPair}`).pipe(
      map((currency: any) => {
        let rates = null;
        if (currency) {
          rates = currency['rates'] || null;
        }
        return {
          rates: rates,
          base: base,
          symbols: symbols
        };
      })
    );
  }

  setCachedHistory(response) {
    const nameCurrencyPair = response.base + '__' + response.symbols;
    return this.http
      .post(`http://127.0.0.1:4000/${nameCurrencyPair}`, response.rates)
      .pipe(
        catchError(err => {
          return of({ base: response.base, symbols: response.symbols });
        })
      );
  }
  updateCachedHistory(response) {
    return this.getCachedHistory(response.base, response.symbols).pipe(
      switchMap((resp: any) => {
        resp.rates = resp.rates ? resp.rates : [];
        let allData = resp.rates.concat(response.rates);
        allData = this.removeDuplicatedRates(allData);
        return this.setCachedHistory({
          base: resp.base,
          symbols: resp.symbols,
          rates: allData
        }).pipe(
          switchMap(() => {
            return of({ base: response.base, symbols: response.symbols });
          })
        );
      })
    );
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
