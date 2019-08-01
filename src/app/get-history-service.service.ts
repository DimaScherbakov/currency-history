import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HistoryRequest } from './history-request';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetHistoryServiceService {
  historyUrl = 'https://api.exchangeratesapi.io/history?'; // start_at=2018-01-01&end_at=2018-09-01&base=USD&symbols=GBP

  // TODO : this is a mock , at real requestData should get params from current url
  // TODO : service makes two requests: one for chart and one for table,
  //        it should make only one request and use data for all other features
  requestData: HistoryRequest = {
    start_at: '2019-07-01',
    end_at: '2019-08-01',
    base: 'USD',
    symbols: 'GBP'
  };
  constructor(private http: HttpClient) {}

  getCurrencyHistory(): Observable<Object> {
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
    );
  }
}
