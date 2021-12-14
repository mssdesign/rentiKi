import { CommonModule } from '@angular/common';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ImagePickerComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [ImagePickerComponent]
})
export class SharedModule {}
