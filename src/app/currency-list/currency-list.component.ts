import { Component, OnInit } from '@angular/core';
import { currencies } from '../currency-list';
import { GetHistoryServiceService } from '../services/get-history-service.service';
import { GetExtremesService } from '../services/get-extremes.service';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionAreaService } from '../services/transaction-area.service';
import { Router } from '@angular/router';
import { CalculatorService } from '../services/calculator.service';
import { from, of } from 'rxjs';
import { concatAll, switchMap, tap } from 'rxjs/operators';
import { TransferUserDataService } from '../services/transfer-user-data.service';
@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.css']
})
export class CurrencyListComponent implements OnInit {
  currencies = currencies.list;
  currencyList: MatTableDataSource<any[]>;
  displayedColumns: string[] = [
    'name',
    'min',
    'max',
    'minBorder',
    'maxBorder',
    'sell',
    'buy',
    'current',
    'maxBet'
  ];

  constructor(
    private getHistoryServiceService: GetHistoryServiceService,
    private getExtremesService: GetExtremesService,
    private transactionAreaService: TransactionAreaService,
    private router: Router,
    private calculatorService: CalculatorService,
    public transferUserDataService: TransferUserDataService
  ) {}

  ngOnInit() {
    const currencyList = [];
    const pairNames = this.generateCurrencyPairNames(this.currencies);
    const currencyListObservables = pairNames.map(pairName => {
      return this.getHistoryServiceService.getCurrencyHistory(
        pairName.base,
        pairName.symbols
      );
    });
    this.transferUserDataService.userData$
      .pipe(
        switchMap(() => {
          return from(currencyListObservables);
        })
      )
      .pipe(concatAll())
      .subscribe((currencyPairData: any) => {
        const rates = currencyPairData.rates;
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
        this.currencyList = new MatTableDataSource(currencyList);
      });
  }

  navigate(row) {
    this.router.navigate(['currency-item', `${row.base}-${row.symbols}`]);
    this.transactionAreaService.emitCurrency(row);
  }

  private generateCurrencyPairNames(
    names
  ): Array<{ base: string; symbols: string }> {
    let cs = names;
    const pairsNames = [];
    for (let i = cs.length - 1; i > 0; i--) {
      const b = cs[i];
      cs.forEach(symb => {
        if (b === symb) {
          return;
        }
        pairsNames.push({ base: b, symbols: symb });
      });
      cs = cs.slice(0, cs.length - 1);
    }
    return pairsNames;
  }
}
