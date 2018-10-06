import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  private responseData;
  private languages;
  private settings;
  private language;
  private language_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.setText();
    this.language = this.languageProvider.getLanguage();
    this.getLanguages();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('settings').subscribe((text: string) => {
      this.settings = text;
    });
    this.translate.get('language').subscribe((text: string) => {
      this.language_txt = text;
    });
  }

  public getLanguages() {
    this.loadingProvider.present();
    this.languageProvider.getLanguages().subscribe(response => {
      this.responseData = response;
      this.languages = this.responseData.data;
      this.loadingProvider.dismiss();
    }, err => {
      console.error(err);
    }
    );
    this.loadingProvider.dismiss();
  }

  onChange(data: any) {
    this.languageProvider.setLanguage(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}
