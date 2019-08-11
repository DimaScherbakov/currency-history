import { Component, OnInit } from '@angular/core';
import { GetHistoryServiceService } from '../get-history-service.service';
import { CacheHistoryService } from '../cache-history.service';
@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.css']
})
export class HistoryTableComponent implements OnInit {
  rates = [];
  extremes;
  displayedColumns: string[] = ['date', 'value', 'min', 'max'];
  constructor(
    private getHistoryServiceService: GetHistoryServiceService,
    private cacheHistoryService: CacheHistoryService
  ) {}

  ngOnInit() {
    // this.getHistoryServiceService.getCurrencyHistory$.subscribe((resp: any) => {
    //   if (!this.cacheHistoryService.isCachedData) {
    //     this.rates = resp.rates;
    //   } else {
    //     const cachedData = this.cacheHistoryService.getCachedHistory(
    //       this.getHistoryServiceService.requestData.base,
    //       this.getHistoryServiceService.requestData.symbols
    //     );
    //     const cachedRates = cachedData.rates;
    //     this.rates = cachedRates;
    //   }
    // });
  }
}
