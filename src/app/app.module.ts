import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { HistoryTableComponent } from './history-table/history-table.component';
import { HistoryChartComponent } from './history-chart/history-chart.component';
import { CurrencyItemComponent } from './currency-item/currency-item.component';
import { CurrencyListComponent } from './currency-list/currency-list.component';

@NgModule({
  declarations: [AppComponent, HistoryTableComponent, HistoryChartComponent, CurrencyItemComponent, CurrencyListComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
