import { Component, OnInit } from '@angular/core';
import { currencies } from '../currency-list';
import { GetHistoryServiceService } from '../get-history-service.service';
import { CacheHistoryService } from '../cache-history.service';
import { GetExtremesService } from '../get-extremes.service';
import { forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.css']
})
export class CurrencyListComponent implements OnInit {
  currencies = currencies.list;
  currencyList: MatTableDataSource<any[]>;
  currencyListObservables = [];
  displayedColumns: string[] = ['name', 'min', 'max'];
  constructor(
    private getHistoryServiceService: GetHistoryServiceService,
    private cacheHistoryService: CacheHistoryService,
    private getExtremesService: GetExtremesService
  ) {}

  ngOnInit() {
    let rates = [];
    const currencyList = [];
    this.currencies.forEach(curName => {
      this.currencyListObservables.push(
        this.getHistoryServiceService.getCurrencyHistory(curName)
      );
    });
    forkJoin(this.currencyListObservables).subscribe((response: any) => {
      response.forEach(currencyPairData => {
        if (!this.cacheHistoryService.isCachedData) {
          rates = currencyPairData.rates;
        } else {
          const cachedData = this.cacheHistoryService.getCachedHistory(
            this.getHistoryServiceService.requestData.base,
            this.getHistoryServiceService.requestData.symbols
          );
          const cachedRates = cachedData.rates;
          rates = cachedRates;
        }
        const extremes = this.getExtremesService.getExtremes(rates);
        currencyList.push({
          base: currencyPairData.base,
          symbols: currencyPairData.symbols,
          extremes: extremes
        });
      });
      this.currencyList = new MatTableDataSource(currencyList);
    });
  }
}
