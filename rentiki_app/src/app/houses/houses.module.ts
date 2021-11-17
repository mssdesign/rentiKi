import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HousesPageRoutingModule } from './houses-routing.module';

import { HousesPage } from './houses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HousesPageRoutingModule
  ],
  declarations: [HousesPage]
})
export class HousesPageModule {}
