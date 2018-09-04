import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoryCategoryPage } from './story-category';

@NgModule({
  declarations: [
    StoryCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(StoryCategoryPage),
  ],
})
export class StoryCategoryPageModule {}
