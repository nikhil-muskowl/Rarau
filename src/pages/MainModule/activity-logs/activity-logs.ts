import { Component, createPlatformFactory } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ProfileProvider } from '../../../providers/profile/profile';

@IonicPage()
@Component({
  selector: 'page-activity-logs',
  templateUrl: 'activity-logs.html',
})
export class ActivityLogsPage {

  public activity_log;
  public rarau;
  public user_id;
  public responseData;
  public records;
  public pageStart = 0;
  public pageLength = 5;
  public recordsTotal;
  public recordsFiltered;
  public model: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LoginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public platform: Platform,
    public profileProvider: ProfileProvider,
    public languageProvider: LanguageProvider,
    public translate: TranslateService, ) {

    platform.registerBackButtonAction(() => {
      this.goBack();
    });
    this.user_id = this.LoginProvider.isLogin();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('activity_log').subscribe((text: string) => {
      this.activity_log = text;
    });
    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });

  }

  ionViewWillEnter() {
    this.setText();
    this.getActivity();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivityLogsPage');
  }

  getActivity() {
    console.log('user : ' + this.user_id);
    let param = {
      user_id: this.user_id
    };

    this.loadingProvider.present();

    this.profileProvider.apiGetActivities(param).subscribe(
      response => {
        this.responseData = response;
        this.records = this.responseData.data;
        this.binddata();
        console.log(JSON.stringify(response));

      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  goBack() {
    this.navCtrl.pop();
  }

  binddata() {
    for (let index = 0; index < this.records.length; index++) {
      this.model.push({
        id: this.records[index].id,
        user_name: this.records[index].user_name,
        type: this.records[index].type,
        type_id: this.records[index].type_id,
        text: this.records[index].text,
        user_image: this.records[index].user_image,
        user_image_thumb: this.records[index].user_image_thumb,
        status: this.records[index].status,
        created_date: this.records[index].created_date,
        modified_date: this.records[index].modified_date,
      });
    }
  }

  onScrollDown(infiniteScroll) {

    console.log(this.pageStart);

    if (this.pageStart <= this.recordsTotal) {
      this.pageStart += this.pageLength;
      this.getActivity();
    }

    infiniteScroll.complete();
  }
}
