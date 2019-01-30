import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginPage } from '../../AccountModule/login/login';

//provider
import { LoadingProvider } from '../../../providers/loading/loading';
import { NotiProvider } from '../../../providers/noti/noti';
import { TranslateService } from '@ngx-translate/core';
import { LoginProvider } from '../../../providers/login/login';
import { LanguageProvider } from '../../../providers/language/language';
import { NetworkProvider } from '../../../providers/network/network';

@IonicPage()
@Component({
  selector: 'page-notification-list',
  templateUrl: 'notification-list.html',
})
export class NotificationListPage {

  public user_id;
  public language_id;
  public title;
  public responseData;
  public recordsTotal;
  public items;
  public notiItems: any = [];
  public length = 10;
  public start = 0;
  public isInfinite = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LoginProvider: LoginProvider,
    public platform: Platform,
    public network: NetworkProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public notiProvider: NotiProvider,
    public languageProvider: LanguageProvider, ) {

    this.setText();

    this.getList();


    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());

    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('notification').subscribe((text: string) => {
      this.title = text;
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  getList() {
    this.user_id = this.LoginProvider.isLogin();
    this.language_id = this.languageProvider.getLanguageId();
    var data = {
      user_id: this.user_id,
      language_id: this.language_id,
      length: this.length,
      start: this.start,
    }
    if (this.network.checkStatus() == true) {
      this.loadingProvider.show();
      this.notiProvider.apiNotiList(data).subscribe(
        response => {
          this.responseData = response;
          this.items = this.responseData.data;
          this.recordsTotal = this.responseData.recordsTotal;
          this.bindUpdata();
          this.loadingProvider.dismiss();
        },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        }
      );
    } else {
      this.network.displayNetworkUpdate();
    }
  }

  bindUpdata() {
    for (let i = 0; i < this.items.length; i++) {
      this.notiItems.push({
        id: this.items[i].id,
        title: this.items[i].title,
        description: this.items[i].description,
        type: this.items[i].type,
        type_id: this.items[i].type_id,
        user_id: this.items[i].user_id,
        user_notification_id: this.items[i].user_notification_id,
        is_view: this.items[i].is_view,
        image: this.items[i].image,
        image_thumb: this.items[i].image_thumb,
        status: this.items[i].status,
        created_date: this.items[i].created_date,
        modified_date: this.items[i].modified_date
      });
    }
  }

  onScrollDown(infiniteScroll) {

    console.log("this.start : " + this.start);
    console.log("this.recordsTotal : " + this.recordsTotal);
    this.start += this.length;
    if (this.start <= this.recordsTotal) {
      // this.start += this.length;
      this.getList();
      this.isInfinite = true;
    }
    else {
      this.isInfinite = false;
    }
    infiniteScroll.complete();
  }
}
