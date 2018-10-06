import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
    public languageProvider: LanguageProvider, ) {

    this.setText();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('why_dp').subscribe((text: string) => {
      this.title = text;
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WhyProfilePage');
  }
  dismiss() {
    this.navCtrl.pop();
  }
}
