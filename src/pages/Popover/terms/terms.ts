import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {

  title;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.setText();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('privacy_policy').subscribe((text: string) => {
      this.title = text;
    });
  }

  dismiss() {
    this.navCtrl.pop();
  }
}
