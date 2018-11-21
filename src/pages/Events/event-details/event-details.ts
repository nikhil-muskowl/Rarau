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
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {

  public user_id;

  public event_detail;
  public event_name;
  public event_date;
  public event_time;
  public event_city;
  public event_loc;
  public event_desc;

  public evnt_name;
  public evnt_date;
  public evnt_time;
  public evnt_city;
  public evnt_loc_name;
  public evnt_desc;

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

    this.translate.get('event_detail').subscribe((text: string) => {
      this.event_detail = text;
    });
    this.translate.get('event_name').subscribe((text: string) => {
      this.event_name = text;
    });
    this.translate.get('event_date').subscribe((text: string) => {
      this.event_date = text;
    });
    this.translate.get('event_time').subscribe((text: string) => {
      this.event_time = text;
    });
    this.translate.get('event_loc').subscribe((text: string) => {
      this.event_loc = text;
    });
    this.translate.get('event_desc').subscribe((text: string) => {
      this.event_desc = text;
    });
    this.translate.get('event_city').subscribe((text: string) => {
      this.event_city = text;
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  getDetails() {

    this.evnt_name;
    this.evnt_date;
    this.evnt_time;
    this.evnt_city;
    this.evnt_loc_name;
    this.evnt_desc;
  }

}
