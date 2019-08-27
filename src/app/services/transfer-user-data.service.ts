import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferUserDataService {
  private subjectSource = new Subject<any>();
  userData$ = this.subjectSource.asObservable();
  constructor() {}
  sendValue(value: any) {
    this.subjectSource.next(value);
  }
}
