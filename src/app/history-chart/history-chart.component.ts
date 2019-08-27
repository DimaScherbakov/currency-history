import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { GetExtremesService } from '../services/get-extremes.service';

import { TransactionAreaService } from '../services/transaction-area.service';

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
      annotations: []
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
    private getExtremesService: GetExtremesService,
    private transactionAreaService: TransactionAreaService
  ) {}

  ngOnInit() {
    const values = [];
    let extremes: any = {};
    this.transactionAreaService.transferCurrency$.subscribe((response: any) => {
      response.rates.forEach(rate => {
        this.lineChartLabels.push(rate.date);
        values.push(rate.value);
      });
      this.lineChartData.push({
        data: values,
        label: response.symbols,
        yAxisID: 'y-axis-1'
      });
      extremes = this.getExtremesService.getExtremes(response.rates);
      // add min and max lines to the chart
      this.lineChartOptions.annotation.annotations.push(
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: extremes.min.value,
          borderColor: 'blue',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'white',
            content: 'Minimum'
          }
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: extremes.max.value,
          borderColor: 'red',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'white',
            content: 'Maximum'
          }
        }
      );
    });
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
