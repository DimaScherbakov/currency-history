import { Component, OnInit } from '@angular/core';
import { GetHistoryServiceService } from '../get-history-service.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.css']
})
export class HistoryTableComponent implements OnInit {
  rates = [];

  constructor(private getHistoryServiceService: GetHistoryServiceService) {}

  ngOnInit() {
    this.getHistoryServiceService
      .getCurrencyHistory()
      // get data from response
      .pipe(
        map((resp: any) => {
          return Object.keys(resp.rates).map(date => {
            // get name of key
            const currencyName = Object.keys(resp.rates[date])[0];
            // TODO: set base and symbosl from url
            return { date: date, value: resp.rates[date][currencyName] };
          });
        })
      )
      // sort by date
      .pipe(
        map((resp: any) => {
          return resp.sort((a, b) => {
            // use new variables to calm down the linter
            const dateA: any = new Date(a.date);
            const dateB: any = new Date(b.date);
            return dateA - dateB;
          });
        })
      )
      .subscribe(resp => {
        this.rates = resp;
      });
  }
}
