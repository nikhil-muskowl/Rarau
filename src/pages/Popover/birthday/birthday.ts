import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-birthday',
  templateUrl: 'birthday.html',
})
export class BirthdayPage {
  title = 'Why Birthday';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BirthdayPage');
  }
  dismiss() {
    this.navCtrl.pop();
  }
}
