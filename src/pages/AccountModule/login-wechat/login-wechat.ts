import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TermsPage } from "../../Popover/terms/terms";
import { BirthdayPage } from "../../Popover/birthday/birthday";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login-wechat',
  templateUrl: 'login-wechat.html',
})
export class LoginWechatPage {

  public date: String;
  loginwechatForm: FormGroup;
  private error_email = 'field is required';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder, ) {

    this.date = new Date().toISOString().split('T')[0];
    this.createForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginWechatPage');
  }

  ondateChange() {
    console.info("Selected Date:", this.date);
  }

  save() {

  }

  createForm() {
    this.loginwechatForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      date: ['', ''],
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  gototerms() {
    this.navCtrl.push(TermsPage);
  }

  gotobirthday() {
    this.navCtrl.push(BirthdayPage);
  }
}
