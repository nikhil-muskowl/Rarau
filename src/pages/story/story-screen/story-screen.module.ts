import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoryScreenPage } from './story-screen';

@NgModule({
  declarations: [
    StoryScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(StoryScreenPage),
  ],
})
export class StoryScreenPageModule { }
