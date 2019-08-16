import { Component, OnInit } from '@angular/core';
import { currencies } from '../currency-list';
import { GetHistoryServiceService } from '../get-history-service.service';
import { GetExtremesService } from '../get-extremes.service';
import { forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionAreaService } from '../transaction-area.service';
import { Router } from '@angular/router';
import { CalculatorService } from '../calculator.service';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.css']
})
export class CurrencyListComponent implements OnInit {
  currencies = currencies.list;
  currencyList: MatTableDataSource<any[]>;
  currencyListObservables = [];
  displayedColumns: string[] = [
    'name',
    'min',
    'max',
    'minBorder',
    'maxBorder',
    'sell',
    'buy',
    'current'
  ];

  constructor(
    private getHistoryServiceService: GetHistoryServiceService,
    private getExtremesService: GetExtremesService,
    private transactionAreaService: TransactionAreaService,
    private router: Router,
    private calculatorService: CalculatorService
  ) {}

  ngOnInit() {
    let rates = [];
    const currencyList = [];

    let cs = this.currencies;
    let counter = 1;
    for (let i = cs.length - 1; i > 0; i--) {
      const b = cs[i];
      cs.forEach(symb => {
        if (b === symb) {
          return;
        }
        this.currencyListObservables.push(
          this.getHistoryServiceService.getCurrencyHistory(b, symb)
        );
        console.log(counter, b, symb);
        counter++;
      });
      cs = cs.slice(0, cs.length - 1);
    }
    forkJoin(this.currencyListObservables).subscribe((response: any) => {
      response.forEach(currencyPairData => {
        rates = currencyPairData.rates;
        const extremes = this.getExtremesService.getExtremes(rates);
        const transactionBorders = this.transactionAreaService.getBorders(
          rates,
          extremes
        );
        const maxBet = this.calculatorService.getMaxBet(
          rates,
          extremes,
          transactionBorders.recomendations,
          currencyPairData.base + ' ' + currencyPairData.symbols
        );
        currencyList.push({
          base: currencyPairData.base,
          symbols: currencyPairData.symbols,
          extremes: extremes,
          transactionBorders: transactionBorders,
          current: rates[rates.length - 1],
          rates: currencyPairData.rates,
          maxBet: maxBet
        });
      });
      this.currencyList = new MatTableDataSource(currencyList);
    });
  }

  navigate(currency) {
    this.router.navigate([
      'currency-item',
      `${currency.base}-${currency.symbols}`
    ]);
    this.transactionAreaService.emitCurrency(currency);
  }
}
