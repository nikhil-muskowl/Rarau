import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedStoriesPage } from './saved-stories';

@NgModule({
  declarations: [
    SavedStoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(SavedStoriesPage),
  ],
})
export class SavedStoriesPageModule {}
