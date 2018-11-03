import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityLogsPage } from './activity-logs';

@NgModule({
  declarations: [
    ActivityLogsPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityLogsPage),
  ],
})
export class ActivityLogsPageModule {}
