import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HistoryRequest } from './history-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetHistoryServiceService {
  historyUrl = 'https://api.exchangeratesapi.io/history?'; // start_at=2018-01-01&end_at=2018-09-01&base=USD&symbols=GBP

  // TODO : this is a mock , at real requestData should get params from current url
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
    return this.http.get(this.historyUrl, { params: httpOptions });
  }
}
