import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoryModalPage } from './story-modal';

@NgModule({
  declarations: [
    StoryModalPage,
  ],
  imports: [
    IonicPageModule.forChild(StoryModalPage),
  ],
})
export class StoryModalPageModule {}
