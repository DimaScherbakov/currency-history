import { Component, OnInit } from '@angular/core';
import { GetHistoryServiceService } from '../get-history-service.service';
import { HistoryRequest } from '../history-request';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.css']
})
export class HistoryTableComponent implements OnInit {
  constructor(private getHistoryServiceService: GetHistoryServiceService) {}

  ngOnInit() {
    this.getHistoryServiceService.getCurrencyHistory().subscribe(resp => {
      console.log(resp);
    });
  }
}
