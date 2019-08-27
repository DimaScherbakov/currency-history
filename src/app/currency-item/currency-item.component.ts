import { Component, OnInit } from '@angular/core';
import { TransactionAreaService } from '../services/transaction-area.service';

@Component({
  selector: 'app-currency-item',
  templateUrl: './currency-item.component.html',
  styleUrls: ['./currency-item.component.css']
})
export class CurrencyItemComponent implements OnInit {
  currencyData;
  constructor(private transactionAreaService: TransactionAreaService) {}

  ngOnInit() {
    this.transactionAreaService.transferCurrency$.subscribe(currencyData => {
      this.currencyData = currencyData;
      console.log(this.currencyData);
    });
  }
}
