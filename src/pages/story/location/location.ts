import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BaiduProvider } from '../../../providers/baidu/baidu';
import { LocationTrackerProvider } from '../../../providers/location-tracker/location-tracker';
import { AlertProvider } from '../../../providers/alert/alert';
import { DomSanitizer } from "@angular/platform-browser";
import { StoryCategoryPage } from '../story-category/story-category';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})

export class LocationPage {

  public locations: any;
  public fileterData: any;
  public responseData: any;
  public search = '';
  public locName = '';
  public latitude: number = 0;
  public longitude: number = 0;
  public selLatitude: number = 0;
  public selLongitude: number = 0;
  public data: any;
  public image;
  private city_id;
  public error;
  public location_txt;
  public enter_value_serach;
  public next;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public platform: Platform,
    public locationTrackerProvider: LocationTrackerProvider,
    public baiduProvider: BaiduProvider,
    public sanitizer: DomSanitizer,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.platform.registerBackButtonAction(() => {
      this.back();
    });

    this.setText();
    this.image = this.navParams.get('image');
    console.log('image on location page : ' + this.image);
    this.city_id = this.baiduProvider.getCity();
    //uncommnet below for HK testing 
    this.latitude = this.locationTrackerProvider.getLatitude();
    this.longitude = this.locationTrackerProvider.getLongitude();

    //uncommnet below for India testing 
    // this.latitude = 39.919981;
    // this.longitude = 116.414977;
    // console.log('this.locationTracker.getLatitude : ' + this.locationTracker.getLatitude());
    // console.log('this.locationTracker.getLongitude : ' + this.locationTracker.getLongitude());
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('error').subscribe((text: string) => {
      this.error = text;
    });
    this.translate.get('enter_value_serach').subscribe((text: string) => {
      this.enter_value_serach = text;
    });
    this.translate.get('location').subscribe((text: string) => {
      this.location_txt = text;
    });
    this.translate.get('next').subscribe((text: string) => {
      this.next = text;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
  }

  back() {
    this.navCtrl.pop();
  }

  Next() {

    if (this.selLatitude == 0 && this.selLongitude == 0) {

      this.alertProvider.title = this.error;
      this.alertProvider.message = this.enter_value_serach;
      this.alertProvider.showAlert();
    }
    else {
      console.log('next category');
      this.navCtrl.push(StoryCategoryPage, { image: this.image, locName: this.locName, latitude: this.selLatitude, longitude: this.selLongitude });
    }
  }

  public onInput(ev: any) {
    if (ev.target.value != '' || ev.target.value != undefined) {
      this.search = ev.target.value;
      this.locations = [];
      this.getLocation();
    }
  }

  public onCancel(ev: any) {
    this.search = '';
  }

  public getLocation() {

    this.fileterData = {
      query: this.search,
      location: this.city_id
      // location: `${this.latitude},${this.longitude}`
    };

    this.baiduProvider.location(this.fileterData).subscribe(
      response => {
        console.log(response);
        this.responseData = response;
        this.locations = this.responseData.result;
      },
      err => { console.error(err); }
    );
    console.log(this.locations);
  }

  public itemSelected(location: any) {
    console.log(location);
    if (location) {
      this.search = location.name;
      this.locName = location.name;
      this.selLatitude = location.location.lat;
      this.selLongitude = location.location.lng;
    }

    console.log(this.selLatitude);
    console.log(this.selLongitude);
    this.locations = [];
  }
}