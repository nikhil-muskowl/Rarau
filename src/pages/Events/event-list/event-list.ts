import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { EventDetailsPage } from '../event-details/event-details';

//provider
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { EventProvider } from '../../../providers/event/event';
import { NetworkProvider } from '../../../providers/network/network';

@IonicPage()
@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html',
})
export class EventListPage {

  public upEvents: any = [];
  public upEveRes
  public upEveData;
  public upEveRecords;
  public upPageStart = 0;
  public pageLength = 5;
  public upParamData;

  public pastEvents: any = [];
  public pastEveRes;
  public pastEveRecords;
  public pastEveData;
  public pastPageStart = 0;
  public pastParamData;

  public user_id;

  public event_list;
  public event;
  public latest_event_txt;
  public past_event_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public platform: Platform,
    public network: NetworkProvider,
    public eventProvider: EventProvider,
    public languageProvider: LanguageProvider, ) {

  }

  ngOnInit() {
    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });
    //set segment
    this.event = 'Upcoming';

    this.user_id = this.loginProvider.isLogin();
    this.setText();

    if (this.network.checkStatus() == true) {
      this.UpcomingEve();
    }
    else {
      this.network.displayNetworkUpdate();
    }
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('event_list').subscribe((text: string) => {
      this.event_list = text;
    });
    this.translate.get('latest_event').subscribe((text: string) => {
      this.latest_event_txt = text;
    });
    this.translate.get('past_event').subscribe((text: string) => {
      this.past_event_txt = text;
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  UpcomingEve() {

    console.log("in upcoming event");
    this.upParamData = { 'start': this.upPageStart, 'length': this.pageLength };
    if (this.network.checkStatus() == true) {

      this.loadingProvider.present();
      this.eventProvider.apiGetUpcomingEvents(this.upParamData).subscribe(
        response => {
          this.upEveRes = response;
          this.upEveRecords = this.upEveRes.recordsTotal;
          this.upEveData = this.upEveRes.data;
          this.bindUpdata();
        },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        });
    }
    else {
      this.network.displayNetworkUpdate();
    }
  }

  PastEve() {
    console.log("in Past event");
    this.pastParamData = { 'start': this.pastPageStart, 'length': this.pageLength };

    if (this.network.checkStatus() == true) {
      this.loadingProvider.present();
      this.eventProvider.apiGetPastEvents(this.pastParamData).subscribe(
        response => {
          this.pastEveRes = response;
          this.pastEveRecords = this.pastEveRes.recordsTotal;
          this.pastEveData = this.pastEveRes.data;
          this.bindPastdata();
        },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        });
    }
    else {
      this.network.displayNetworkUpdate();
    }
  }

  bindUpdata() {

    for (let i = 0; i < this.upEveData.length; i++) {
      this.upEvents.push({
        id: this.upEveData[i].id,
        title: this.upEveData[i].title,
        description: this.upEveData[i].description,
        from_date: this.upEveData[i].from_date,
        to_date: this.upEveData[i].to_date,
        user_id: this.upEveData[i].user_id,
        user_name: this.upEveData[i].user_name,
        user_image: this.upEveData[i].user_image,
        user_image_thumb: this.upEveData[i].user_image_thumb,
        image: this.upEveData[i].image,
        image_thumb: this.upEveData[i].image_thumb,
        banner: this.upEveData[i].banner,
        banner_thumb: this.upEveData[i].banner_thumb,
        latitude: this.upEveData[i].latitude,
        longitude: this.upEveData[i].longitude,
        location: this.upEveData[i].location,
        status: this.upEveData[i].status,
        created_date: this.upEveData[i].created_date,
        modified_date: this.upEveData[i].modified_date
      });
    }
  }

  bindPastdata() {
    for (let j = 0; j < this.pastEveData.length; j++) {
      this.pastEvents.push({
        id: this.pastEveData[j].id,
        title: this.pastEveData[j].title,
        description: this.pastEveData[j].description,
        from_date: this.pastEveData[j].from_date,
        to_date: this.pastEveData[j].to_date,
        user_id: this.pastEveData[j].user_id,
        user_name: this.pastEveData[j].user_name,
        user_image: this.pastEveData[j].user_image,
        user_image_thumb: this.pastEveData[j].user_image_thumb,
        image: this.pastEveData[j].image,
        image_thumb: this.pastEveData[j].image_thumb,
        banner: this.pastEveData[j].banner,
        banner_thumb: this.pastEveData[j].banner_thumb,
        latitude: this.pastEveData[j].latitude,
        longitude: this.pastEveData[j].longitude,
        location: this.pastEveData[j].location,
        status: this.pastEveData[j].status,
        created_date: this.pastEveData[j].created_date,
        modified_date: this.pastEveData[j].modified_date
      });
    }
  }

  UplistScrollDown(infiniteScroll) {

    console.log(this.upPageStart);

    if (this.upPageStart <= this.upEveRecords) {
      this.upPageStart += this.pageLength;
      this.UpcomingEve();
    }

    infiniteScroll.complete();
  }

  PastlistScrollDown(infiniteScroll) {

    console.log(this.pastPageStart);

    if (this.pastPageStart <= this.pastEveRecords) {
      this.pastPageStart += this.pageLength;
      this.PastEve();
    }

    infiniteScroll.complete();
  }

  segmentChanged(segmentEvent) {

    console.log("change : " + JSON.stringify(segmentEvent.value));
    if (segmentEvent.value === 'Upcoming') {
      if (this.network.checkStatus() == true) {
        this.UpcomingEve();
      }
    }

    if (segmentEvent.value === 'History') {
      if (this.network.checkStatus() == true) {
        this.PastEve();
      }
    }
  }

  eveDetails(event) {
    if (this.network.checkStatus() == true) {
      this.navCtrl.push(EventDetailsPage, { id: event.id });
    }
  }
}
