import { Component, OnInit } from '@angular/core';
import { GetHistoryServiceService } from '../get-history-service.service';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.css']
})
export class HistoryTableComponent implements OnInit {
  rates = [];

  constructor(private getHistoryServiceService: GetHistoryServiceService) {}

  ngOnInit() {
    this.getHistoryServiceService.getCurrencyHistory$.subscribe((resp: any) => {
      this.rates = resp.rates;
    });
  }
}
