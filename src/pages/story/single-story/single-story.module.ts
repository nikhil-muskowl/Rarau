import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleStoryPage } from './single-story';

@NgModule({
  declarations: [
    SingleStoryPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleStoryPage),
  ],
})
export class SingleStoryPageModule {}
