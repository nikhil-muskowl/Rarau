import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

//provider
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html',
})
export class EventListPage {

  public events: any = [];
  public user_id;
  public event_list;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public platform: Platform,
    public languageProvider: LanguageProvider, ) {
      
  }

  ngOnInit() {
    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.user_id = this.loginProvider.isLogin();
    this.setText();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('event_list').subscribe((text: string) => {
      this.event_list = text;
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  getDetails() {

  }
}
