import { Component, OnInit } from '@angular/core';
import { TransactionAreaService } from '../services/transaction-area.service';
@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.css']
})
export class HistoryTableComponent implements OnInit {
  rates = [];
  extremes;
  displayedColumns: string[] = ['date', 'value', 'min', 'max'];
  constructor(private transactionAreaService: TransactionAreaService) {}

  ngOnInit() {
    this.transactionAreaService.transferCurrency$.subscribe(resp => {
      this.rates = resp.rates;
    });
  }
}
