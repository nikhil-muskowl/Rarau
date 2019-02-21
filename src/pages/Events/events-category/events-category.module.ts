import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsCategoryPage } from './events-category';


@NgModule({
  declarations: [
    EventsCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(EventsCategoryPage),
  ],
})
export class EventsCategoryPageModule {}
