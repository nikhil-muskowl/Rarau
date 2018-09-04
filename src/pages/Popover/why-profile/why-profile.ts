import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-why-profile',
  templateUrl: 'why-profile.html',
})
export class WhyProfilePage {
  title = 'Why Profile Picture';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WhyProfilePage');
  }
  dismiss() {
    this.navCtrl.pop();
  }
}
