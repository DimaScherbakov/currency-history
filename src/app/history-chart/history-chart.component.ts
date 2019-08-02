import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { GetHistoryServiceService } from '../get-history-service.service';
import { CacheHistoryService } from '../cache-history.service';

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.css']
})
export class HistoryChartComponent implements OnInit {
  public lineChartData = [];
  public lineChartLabels = [];
  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)'
          },
          ticks: {
            fontColor: 'red'
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'blue',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'white',
            content: 'LineAnno'
          }
        }
      ]
    }
  };
  public lineChartColors: Color[] = [
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(
    private getHistoryServiceService: GetHistoryServiceService,
    private cacheHistoryService: CacheHistoryService
  ) {}

  ngOnInit() {
    const values = [];
    if (!this.cacheHistoryService.isCachedData) {
      this.getHistoryServiceService.getCurrencyHistory$.subscribe(
        (response: any) => {
          response.rates.forEach(rate => {
            this.lineChartLabels.push(rate.date);
            values.push(rate.value);
          });
          this.lineChartData.push({
            data: values,
            label: response.symbols,
            yAxisID: 'y-axis-1'
          });
        }
      );
    } else {
      const cachedData = this.cacheHistoryService.getCachedHistory(
        this.getHistoryServiceService.requestData.base,
        this.getHistoryServiceService.requestData.symbols
      );
      const cachedRates = cachedData.rates;
      cachedRates.forEach(rate => {
        this.lineChartLabels.push(rate.date);
        values.push(rate.value);
      });
      this.lineChartData.push({
        data: values,
        label: cachedData.symbols,
        yAxisID: 'y-axis-1'
      });
    }
  }

  private generateNumber(i: number) {
    return Math.floor(Math.random() * (i < 2 ? 100 : 1000) + 1);
  }

  // events
  public chartClicked({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }
}
