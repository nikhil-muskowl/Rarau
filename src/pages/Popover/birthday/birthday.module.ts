import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BirthdayPage } from './birthday';

@NgModule({
  declarations: [
    BirthdayPage,
  ],
  imports: [
    IonicPageModule.forChild(BirthdayPage),
  ],
})
export class BirthdayPageModule {}
