import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { EventProvider } from '../../../providers/event/event';
import { NetworkProvider } from '../../../providers/network/network';

@IonicPage()
@Component({
  selector: 'page-event-modal',
  templateUrl: 'event-modal.html',
})
export class EventModalPage {

  public sel_event;
  public events: any = [];
  public EveRes
  public EveData;
  public EveRecords;
  public PageStart = 0;
  public pageLength = 5;
  public ParamData;

  public EveId;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public network: NetworkProvider,
    private view: ViewController,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
    public eventProvider: EventProvider,
  ) {

    this.setText();
    if (this.network.checkStatus() == true) {
      this.getEvents();
    }
    else {
      this.network.displayNetworkUpdate();
    }
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('sel_event').subscribe((text: string) => {
      this.sel_event = text;
    });
  }

  //to get all events
  getEvents() {
    console.log("all event");
    this.ParamData = { 'start': this.PageStart, 'length': this.pageLength };

    this.loadingProvider.present();
    this.eventProvider.apiGetUpcomingEvents(this.ParamData).subscribe(
      response => {
        this.EveRes = response;
        this.EveRecords = this.EveRes.recordsTotal;
        this.EveData = this.EveRes.data;
        this.bindUpdata();
        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      });
  }

  //close modal and redirect to page where it is called
  closeModal() {
    this.view.dismiss();
  }

  //bind the list with new data
  bindUpdata() {

    for (let i = 0; i < this.EveData.length; i++) {
      this.events.push({
        id: this.EveData[i].id,
        title: this.EveData[i].title,
        description: this.EveData[i].description,
        from_date: this.EveData[i].from_date,
        to_date: this.EveData[i].to_date,
        user_id: this.EveData[i].user_id,
        user_name: this.EveData[i].user_name,
        user_image: this.EveData[i].user_image,
        user_image_thumb: this.EveData[i].user_image_thumb,
        image: this.EveData[i].image,
        image_thumb: this.EveData[i].image_thumb,
        banner: this.EveData[i].banner,
        banner_thumb: this.EveData[i].banner_thumb,
        latitude: this.EveData[i].latitude,
        longitude: this.EveData[i].longitude,
        location: this.EveData[i].location,
        status: this.EveData[i].status,
        created_date: this.EveData[i].created_date,
        modified_date: this.EveData[i].modified_date
      });
    }
  }

  //click on item to select
  ItemSelected(eves: any) {
    console.log(eves);
    if (eves) {
      this.EveId = eves.id;
      const data = {
        EveId: this.EveId
      }
      this.view.dismiss(data);

    }
  }
}
