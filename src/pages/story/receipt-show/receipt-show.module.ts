import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiptShowPage } from './receipt-show';

@NgModule({
  declarations: [
    ReceiptShowPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiptShowPage),
  ],
})
export class ReceiptShowPageModule {}
