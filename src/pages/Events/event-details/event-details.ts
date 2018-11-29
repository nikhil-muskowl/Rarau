import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

//provider
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { EventProvider } from '../../../providers/event/event';

@IonicPage()
@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {

  public _id;
  public user_id;
  public EveResponse;
  public EveStatus;
  public EveResult;

  public responseData;
  public items;

  public event_detail;
  public event_name;
  public event_from_date;
  public event_to_date;
  public event_time;
  public event_city;
  public event_loc;
  public event_desc;

  public evnt_name;
  public evnt_from_date;
  public evnt_to_date;
  public evnt_time;
  public evnt_city;
  public evnt_banner;
  public evnt_loc_name;
  public event_story;
  public evnt_desc;

  private filterData: any;
  public length = 3;
  public start = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public platform: Platform,
    public eventProvider: EventProvider,
    public languageProvider: LanguageProvider, ) {
    this._id = this.navParams.get('id');
  }

  ngOnInit() {

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.user_id = this.loginProvider.isLogin();
    this.setText();
    this.getDetails(this._id);
    this.getList(this._id);
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
    this.translate.get('event_to_date').subscribe((text: string) => {
      this.event_to_date = text;
    });
    this.translate.get('event_from_date').subscribe((text: string) => {
      this.event_from_date = text;
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
    this.translate.get('event_story').subscribe((text: string) => {
      this.event_story = text;
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  getDetails(id) {
    this.eventProvider.apiGetEventDetails(id).subscribe(
      response => {
        this.EveResponse = response;
        this.EveStatus = this.EveResponse.status;
        this.EveResult = this.EveResponse.result;

        this.evnt_name = this.EveResult.title;
        console.log("this.evnt_name : " + this.evnt_name);
        this.evnt_from_date = this.EveResult.from_date;
        this.evnt_to_date = this.EveResult.to_date;
        this.evnt_banner = this.EveResult.image;
        // this.evnt_city = this.EveResult.location;
        this.evnt_loc_name = this.EveResult.location;
        this.evnt_desc = this.EveResult.description;
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      });
  }

  public getList(id) {
    this.loadingProvider.present();
    this.filterData = {
      event_id: id,
      length: this.length,
      start: this.start,
    };

    this.eventProvider.getRankedStory(this.filterData).subscribe(
      response => {
        this.responseData = response;
        this.items = this.responseData.data;
        this.loadingProvider.dismiss();
      },
      err => {
        console.error(err);
        this.loadingProvider.dismiss();
      }
    );
    return event;
  }

}
