import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';
import { HousesPageRoutingModule } from './houses-routing.module';
import { HousesPage } from './houses.page';
import { SlideComponent } from './slide/slide.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    HousesPageRoutingModule
  ],
  declarations: [HousesPage, SlideComponent]
})
export class HousesPageModule {}
