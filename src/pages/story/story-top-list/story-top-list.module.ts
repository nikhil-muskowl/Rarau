import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoryTopListPage } from './story-top-list';

@NgModule({
  declarations: [
    StoryTopListPage,
  ],
  imports: [
    IonicPageModule.forChild(StoryTopListPage),
  ],
})
export class StoryTopListPageModule {}
