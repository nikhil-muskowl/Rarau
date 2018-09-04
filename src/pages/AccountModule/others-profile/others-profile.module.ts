import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OthersProfilePage } from './others-profile';

@NgModule({
  declarations: [
    OthersProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(OthersProfilePage),
  ],
})
export class OthersProfilePageModule {}
