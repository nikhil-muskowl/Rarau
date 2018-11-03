import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyPetDetailsPage } from './my-pet-details';

@NgModule({
  declarations: [
    MyPetDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyPetDetailsPage),
  ],
})
export class MyPetDetailsPageModule {}
