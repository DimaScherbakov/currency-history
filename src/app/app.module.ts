import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { HistoryTableComponent } from './history-table/history-table.component';
import { HistoryChartComponent } from './history-chart/history-chart.component';

@NgModule({
  declarations: [AppComponent, HistoryTableComponent, HistoryChartComponent],
  imports: [BrowserModule, HttpClientModule, ChartsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
