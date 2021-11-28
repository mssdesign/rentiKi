import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewHousePageRoutingModule } from './new-house-routing.module';
import { NewHousePage } from './new-house.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NewHousePageRoutingModule
  ],
  declarations: [NewHousePage]
})
export class NewHousePageModule {}
