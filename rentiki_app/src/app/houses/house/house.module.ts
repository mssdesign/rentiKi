import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlideComponentModule } from '../slide/slide.module';
import { IonicModule } from '@ionic/angular';
import { HousePageRoutingModule } from './house-routing.module';
import { HousePage } from './house.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SlideComponentModule,
    IonicModule,
    HousePageRoutingModule
  ],
  declarations: [HousePage]
})
export class HousePageModule {}
