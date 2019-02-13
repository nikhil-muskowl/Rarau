import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-why-profile',
  templateUrl: 'why-profile.html',
})
export class WhyProfilePage {
  title;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public platform: Platform,
    public languageProvider: LanguageProvider, ) {

    platform.registerBackButtonAction(() => {
      this.dismiss();
    });
    this.setText();
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('why_dp').subscribe((text: string) => {
      this.title = text;
    });
  }

  //click on close button
  dismiss() {
    this.navCtrl.pop();
  }
}
