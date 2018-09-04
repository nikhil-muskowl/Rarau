import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagePhotoPage } from './manage-photo';

@NgModule({
  declarations: [
    ManagePhotoPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagePhotoPage),
  ],
})
export class ManagePhotoPageModule {}
