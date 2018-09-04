import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyPetPage } from './my-pet';

@NgModule({
  declarations: [
    MyPetPage,
  ],
  imports: [
    IonicPageModule.forChild(MyPetPage),
  ],
})
export class MyPetPageModule {}
