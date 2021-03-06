import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoginPage } from '../../AccountModule/login/login';
import { LoginProvider } from '../../../providers/login/login';
import { ProfilePage } from "../profile/profile";
import { BaiduProvider } from "../../../providers/baidu/baidu";
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { AlertModalPage } from '../../AccountModule/alert-modal/alert-modal';
import { TutorialPage } from '../tutorial/tutorial';

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
  private city;
  private city_id;
  private language_txt;
  public sure_logout;
  public cities;
  public logout_txt;
  private bye_bye;
  private logged_out;
  private ok_text;
  private cancel_text;
  private select_lang_text;
  private select_city_text;
  private tutorial_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LoginProvider: LoginProvider,
    public platform: Platform,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public baiduProvider: BaiduProvider,
    public languageProvider: LanguageProvider,
    private modal: ModalController,
    public http: HttpClient,
  ) {

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.loadCity();
    this.setText();
    this.user_id = this.LoginProvider.isLogin();
    this.city_id = this.baiduProvider.getCity();
    console.log("this.city_id : " + this.city_id);
    this.language = this.languageProvider.getLanguage();
    this.getLanguages();
  }

  //setting text according to language
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
    this.translate.get('logged_out').subscribe((text: string) => {
      this.logged_out = text;
    });
    this.translate.get('bye_bye').subscribe((text: string) => {
      this.bye_bye = text;
    });
    this.translate.get('ok').subscribe((text: string) => {
      this.ok_text = text;
    });
    this.translate.get('cancel').subscribe((text: string) => {
      this.cancel_text = text;
    });
    this.translate.get('select_language').subscribe((text: string) => {
      this.select_lang_text = text;
    });
    this.translate.get('select_city').subscribe((text: string) => {
      this.select_city_text = text;
    });
    this.translate.get('tutorial').subscribe((text: string) => {
      this.tutorial_txt = text;
    });

  }

  //get all cities
  loadCity() {
    this.cities = [];

    this.baiduProvider.getCities().subscribe(response => {
      this.cities = response;
      for (let i = 0; i < this.cities.length; i++) {
        if (this.cities[i].area_id == this.city_id) {
          this.city = this.cities[i].name;

        }
      }
    }, err => {
      console.error(err);
    });
  }

  //Goto tutorial page
  tutorial() {
    this.navCtrl.setRoot(TutorialPage);
  }

  //get all languages
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

  //on change current language
  onChange(data: any) {
    //language
    console.log('selected language : ' + JSON.stringify(data));
    this.languageProvider.setLanguage(data);
    this.setText();
  }

  //change current city
  onChangeCity(data: any) {
    console.log('selected city : ' + JSON.stringify(data));
    this.baiduProvider.setCity(data);

  }

  //logout user
  logout() {
    this.openModal();
  }

  //open modal to confirm Logout
  openModal() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = {
      welcome: this.bye_bye,
      image: 'assets/imgs/story/neg-flame.png',
      logged: this.logged_out,
      from: 0
    };

    const myModal: Modal = this.modal.create(AlertModalPage, { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {

      if (data) {
        var close = data.close;
        if (close) {
          this.LoginProvider.unSetData();
          this.navCtrl.setRoot(LoginPage);
        }
      }

    });

    myModal.onWillDismiss(() => {

    });
  }

  //Goto previous page
  goBack() {
    this.navCtrl.setRoot(ProfilePage);
  }

}
