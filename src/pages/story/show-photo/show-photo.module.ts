import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowPhotoPage } from './show-photo';

@NgModule({
  declarations: [
    ShowPhotoPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowPhotoPage),
  ],
})
export class ShowPhotoPageModule {}
