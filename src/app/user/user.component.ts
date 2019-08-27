import { Component, OnInit } from '@angular/core';
import { CalculatorService } from '../services/calculator.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TransferUserDataService } from '../services/transfer-user-data.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  constructor(
    public calculatorService: CalculatorService,
    public transferUserDataService: TransferUserDataService
  ) {}
  private _createForm() {
    this.userForm = new FormGroup({
      deposit: new FormControl(0, [
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])
    });
  }

  ngOnInit() {
    this._createForm();
    this.userForm.get('deposit').valueChanges.subscribe(v => {
      this.calculatorService.deposit = v;
    });
  }
  onSubmit() {
    this.transferUserDataService.sendValue('');
  }
}
