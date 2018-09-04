import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoryListPage } from './story-list';

@NgModule({
  declarations: [
    StoryListPage,
  ],
  imports: [
    IonicPageModule.forChild(StoryListPage),
  ],
})
export class StoryListPageModule {}
