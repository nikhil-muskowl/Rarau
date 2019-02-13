import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { TermsPage } from "../../Popover/terms/terms";
import { BirthdayPage } from "../../Popover/birthday/birthday";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-login-wechat',
  templateUrl: 'login-wechat.html',
})
export class LoginWechatPage {

  public date: String;
  loginwechatForm: FormGroup;
  private error_email = 'field is required';

  private rarau;
  private sign_up_wechat;
  private sign_up;
  private birthday;
  private why_this;
  private by_clicking_sign_up;
  private terms_policy;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public platform: Platform,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.setText();
    this.date = new Date().toISOString().split('T')[0];
    this.createForm();
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('sign_up').subscribe((text: string) => {
      this.sign_up = text;
    });
    this.translate.get('sign_up_wechat').subscribe((text: string) => {
      this.sign_up_wechat = text;
    });
    this.translate.get('birthday').subscribe((text: string) => {
      this.birthday = text;
    });
    this.translate.get('why_this').subscribe((text: string) => {
      this.why_this = text;
    });
    this.translate.get('by_clicking_sign_up').subscribe((text: string) => {
      this.by_clicking_sign_up = text;
    });
    this.translate.get('terms_policy').subscribe((text: string) => {
      this.terms_policy = text;
    });

  }

  //to get date on change
  ondateChange() {
    console.info("Selected Date:", this.date);
  }

  //send form to WeChat login
  save() {

  }

  //create form and validations
  createForm() {
    this.loginwechatForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      date: ['', ''],
    });
  }

  //goto previous page
  goBack() {
    this.navCtrl.pop();
  }

  //goto terms page
  gototerms() {
    this.navCtrl.push(TermsPage);
  }

  //goto birthday page
  gotobirthday() {
    this.navCtrl.push(BirthdayPage);
  }
}
