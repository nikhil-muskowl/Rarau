import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoginPage } from '../../AccountModule/login/login';
import { LoginProvider } from '../../../providers/login/login';
import { ProfilePage } from "../profile/profile";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  private user_id;
  private responseData;
  private languages;
  private settings;
  private language;
  private language_txt;
  public sure_logout;
  public logout_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LoginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.setText();
    this.user_id = this.LoginProvider.isLogin();
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
    this.translate.get('sure_logout').subscribe((text: string) => {
      this.sure_logout = text;
    });
    this.translate.get('logout').subscribe((text: string) => {
      this.logout_txt = text;
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

  logout() {
    this.alertProvider.Alert.confirm(this.sure_logout, this.logout_txt).then((res) => {
      console.log('confirmed');
      this.LoginProvider.unSetData();
      this.navCtrl.setRoot(LoginPage);
    }, err => {
      console.log('user cancelled');
    });
  }

  goBack() {
    this.navCtrl.setRoot(ProfilePage);
  }

}
