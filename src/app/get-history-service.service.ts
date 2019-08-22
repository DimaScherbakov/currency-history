import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HistoryRequest } from './history-request';
import { map, switchMap } from 'rxjs/operators';
// import { retryWhen, delay, take, concatMap } from 'rxjs/operators';
// import { throwError } from 'rxjs';
import { CacheHistoryService } from './cache-history.service';
import { DateService } from './date.service';
import { GetExtremesService } from './get-extremes.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetHistoryServiceService {
  historyUrl = 'https://api.exchangeratesapi.io/history?'; // start_at=2018-01-01&end_at=2018-09-01&base=USD&symbols=GBP

  requestData: HistoryRequest = {
    start_at: '2009-01-01',
    end_at: this.dateService.getYesterdayDate(),
    base: '',
    symbols: ''
  };
  curResp;
  constructor(
    private http: HttpClient,
    private cacheHistoryService: CacheHistoryService,
    private dateService: DateService,
    private getExtremesService: GetExtremesService
  ) {}

  httpGetCurrencyHistory(requestData) {
    const httpOptions = {
      start_at: this.requestData.start_at,
      end_at: this.requestData.end_at,
      base: this.requestData.base,
      symbols: this.requestData.symbols
    };
    return (
      this.http
        .get(this.historyUrl, { params: httpOptions })
        // get data from response
        .pipe(
          map((resp: any) => {
            let currencyName;
            const rates = Object.keys(resp.rates).map(date => {
              // get name of key
              currencyName = Object.keys(resp.rates[date])[0];
              return { date: date, value: resp.rates[date][currencyName] };
            });
            return { rates: rates, base: resp.base, symbols: currencyName };
          })
        )
        // sort by date
        .pipe(
          map((resp: any) => {
            resp.rates.sort((a, b) => {
              // use new variables to calm down the linter
              const dateA: any = new Date(a.date);
              const dateB: any = new Date(b.date);
              return dateA - dateB;
            });
            return resp;
          })
        )
      // .pipe(
      //   retryWhen(errors =>
      //     errors.pipe(
      //       delay(4000),
      //       take(100)
      //     )
      //   )
      // )
    );
  }

  getCurrencyHistory(base, symbols) {
    this.requestData.base = base;
    this.requestData.symbols = symbols;
    return this.cacheHistoryService.getCachedHistory(base, symbols).pipe(
      switchMap((cachedData: any) => {
        this.requestData.base = cachedData.base;
        this.requestData.symbols = cachedData.symbols;
        // if there is some cached data in the storage it should been updated
        if (cachedData.rates && cachedData.rates.length > 0) {
          // get last date from cache
          this.requestData.start_at = this.dateService.getLastDate(
            cachedData.rates
          );

          // if the last date less than current, we should update data
          let getActualData;
          if (
            this.dateService.getLastDate(cachedData.rates) <
            this.requestData.end_at
          ) {
            getActualData = this.httpGetCurrencyHistory(this.requestData)
              // update
              .pipe(
                switchMap(response => {
                  return this.cacheHistoryService.updateCachedHistory(response);
                })
              )
              .pipe(
                switchMap(data => {
                  const updatedCache = this.cacheHistoryService.getCachedHistory(
                    base,
                    symbols
                  );
                  return updatedCache;
                })
              );
          } else {
            getActualData = of(cachedData);
          }
          return (
            getActualData
              // find extremes(min and max points)
              .pipe(
                map((resp: any) => {
                  resp.rates = this.getExtremesService.addExtremes(resp.rates);
                  return resp;
                })
              )
              .pipe(
                map((resp: any) => {
                  this.cacheHistoryService.setCachedHistory(resp);
                  return resp;
                })
              )
          );
          // if no data cached then get currency data for all period of dates
        } else {
          return (
            this.httpGetCurrencyHistory(this.requestData)
              // find extremes(min and max points)
              .pipe(
                map((resp: any) => {
                  resp.rates = this.getExtremesService.addExtremes(resp.rates);
                  return resp;
                })
              )
              .pipe(
                switchMap(response => {
                  this.curResp = response;
                  return this.cacheHistoryService.setCachedHistory(response);
                })
              )
              .pipe(
                switchMap(() => {
                  return of(this.curResp);
                })
              )
          );
        }
      })
    );
  }
}
