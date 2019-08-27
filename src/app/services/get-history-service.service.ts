import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HistoryRequest } from '../history-request';
import { map, switchMap, delay } from 'rxjs/operators';
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
      start_at: requestData.start_at,
      end_at: requestData.end_at,
      base: requestData.base,
      symbols: requestData.symbols
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
    );
  }
  // TODO: use local created object instead of global requestData
  getCurrencyHistory(base, symbols) {
    return this.cacheHistoryService.getCachedHistory(base, symbols).pipe(
      switchMap((cachedData: any) => {
        this.requestData.symbols = symbols;
        this.requestData.base = base;
        const localRequestData = Object.assign({}, this.requestData);
        // if there is some cached data in the storage it should been updated
        if (cachedData.rates && cachedData.rates.length > 0) {
          // get last date from cache
          localRequestData.start_at = this.dateService.getLastDate(
            cachedData.rates
          );
          // if the last date less than current, we should update data
          let getActualData;
          if (
            this.dateService.getLastDate(cachedData.rates) <
            localRequestData.end_at
          ) {
            getActualData = this.httpGetCurrencyHistory(localRequestData)
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
            this.httpGetCurrencyHistory(localRequestData)
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
