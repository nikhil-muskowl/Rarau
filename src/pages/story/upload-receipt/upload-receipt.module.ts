import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadReceiptPage } from './upload-receipt';

@NgModule({
  declarations: [
    UploadReceiptPage,
  ],
  imports: [
    IonicPageModule.forChild(UploadReceiptPage),
  ],
})
export class UploadReceiptPageModule {}
