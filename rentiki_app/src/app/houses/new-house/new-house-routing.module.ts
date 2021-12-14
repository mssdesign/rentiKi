import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewHousePage } from './new-house.page';

const routes: Routes = [
  {
    path: '',
    component: NewHousePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class NewHousePageRoutingModule {}
