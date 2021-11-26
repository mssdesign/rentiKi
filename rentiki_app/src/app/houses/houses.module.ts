import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HousesPageRoutingModule } from './houses-routing.module';
import { HousesPage } from './houses.page';
import { SlideComponentModule } from './slide/slide.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SlideComponentModule,
    HousesPageRoutingModule
  ],  
  declarations: [HousesPage]
})
export class HousesPageModule {}
