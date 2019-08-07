import { Component, OnInit } from '@angular/core';
import { GetHistoryServiceService } from '../get-history-service.service';
import { CacheHistoryService } from '../cache-history.service';
import { StorageService } from '../storage.service';
@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.css']
})
export class HistoryTableComponent implements OnInit {
  rates = [];
  displayedColumns: string[] = ['date', 'value'];
  constructor(
    private getHistoryServiceService: GetHistoryServiceService,
    private cacheHistoryService: CacheHistoryService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.storageService.push(HistoryTableComponent, [
      { data: 'entityRaw', id: 1 }
    ]);
    this.storageService.push(HistoryTableComponent, [
      { data: 'entityRaw', id: 2 }
    ]);
    // this.storageService.peekOne(HistoryTableComponent, 0);
    this.storageService.peek(HistoryTableComponent);
    this.getHistoryServiceService.getCurrencyHistory$.subscribe((resp: any) => {
      if (!this.cacheHistoryService.isCachedData) {
        this.rates = resp.rates;
      } else {
        const cachedData = this.cacheHistoryService.getCachedHistory(
          this.getHistoryServiceService.requestData.base,
          this.getHistoryServiceService.requestData.symbols
        );
        const cachedRates = cachedData.rates;
        this.rates = cachedRates;
      }
    });
  }
}
