import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-receipt-show',
  templateUrl: 'receipt-show.html',
})
export class ReceiptShowPage {

  public receipt;
  title = 'Receipt';

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {

    this.receipt = this.navParams.get('receipt');
    console.log('receipt : ' + this.receipt);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiptShowPage');
  }

  dismiss() {
    this.navCtrl.pop();
  }
}
