import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CameraOpenPage } from './camera-open';

@NgModule({
  declarations: [
    CameraOpenPage,
  ],
  imports: [
    IonicPageModule.forChild(CameraOpenPage),
  ],
})
export class CameraOpenPageModule {}
