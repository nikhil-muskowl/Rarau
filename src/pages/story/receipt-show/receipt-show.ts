import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-receipt-show',
  templateUrl: 'receipt-show.html',
})
export class ReceiptShowPage {

  public receipt;
  title;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.receipt = this.navParams.get('receipt');
    console.log('receipt : ' + this.receipt);
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('receipt').subscribe((text: string) => {
      this.title = text;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiptShowPage');
  }

  dismiss() {
    this.navCtrl.pop();
  }
}
