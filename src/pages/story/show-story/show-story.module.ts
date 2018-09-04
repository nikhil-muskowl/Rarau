import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowStoryPage } from './show-story';

@NgModule({
  declarations: [
    ShowStoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowStoryPage),
  ],
})
export class ShowStoryPageModule {}
