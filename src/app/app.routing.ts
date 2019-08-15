import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CurrencyListComponent } from './currency-list/currency-list.component';
import { CurrencyItemComponent } from './currency-item/currency-item.component';

const AppRoutes: Routes = [
  { path: 'currency-item/:name', component: CurrencyItemComponent },
  {
    path: '',
    component: CurrencyListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
