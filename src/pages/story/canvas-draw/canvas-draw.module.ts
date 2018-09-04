import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CanvasDrawPage } from './canvas-draw';

@NgModule({
  declarations: [
    CanvasDrawPage,
  ],
  imports: [
    IonicPageModule.forChild(CanvasDrawPage),
  ],
})
export class CanvasDrawPageModule {}
