import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BaiduProvider } from '../../../providers/baidu/baidu';
import { LocationTrackerProvider } from '../../../providers/location-tracker/location-tracker';
import { AlertProvider } from '../../../providers/alert/alert';
import { DomSanitizer } from "@angular/platform-browser";
import { StoryCategoryPage } from '../story-category/story-category';
import { ShowPhotoPage } from '../show-photo/show-photo';
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
  public my_location_txt;
  public enter_value_serach;
  public next;
  //for css
  public myLocBtn;
  public isMycurrLoc;
  //for story_title
  story_title;
  public story_title_txt;
  public error_story_title;

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

    //css for loc button
    this.isMycurrLoc = 0;
    this.myLocBtn = 'myLocBtn';

    this.setText();
    this.image = this.navParams.get('image');
    console.log('image on location page : ' + this.image);
    this.city_id = this.baiduProvider.getCity();

    this.latitude = this.locationTrackerProvider.getLatitude();
    this.longitude = this.locationTrackerProvider.getLongitude();

  }

  //setting text according to language
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
    this.translate.get('my_location').subscribe((text: string) => {
      this.my_location_txt = text;
    });
    this.translate.get('enter_story_title').subscribe((text: string) => {
      this.story_title_txt = text;
    });
    this.translate.get('error_story_title').subscribe((text: string) => {
      this.error_story_title = text;
    });
  }

  //for getting current location 
  MyLocation() {
    console.log("In my current location");
    if (this.isMycurrLoc == 0) {
      this.myLocBtn = 'myLocBtnclicked';
      this.isMycurrLoc = 1;
      this.story_title = '';
      this.selLatitude = this.latitude;
      this.selLongitude = this.longitude;
      console.log(" this.selLatitude : " + this.selLatitude);
    }
    else {
      this.myLocBtn = 'myLocBtn';
      this.isMycurrLoc = 0;
      this.selLatitude = 0;
      this.selLongitude = 0;
      console.log(" this.selLatitude : " + this.selLatitude);
    }
  }

  //goto previous page
  back() {
    this.navCtrl.push(ShowPhotoPage, { photo: this.image });
  }

  //goto next page with data
  Next() {
    if (this.isMycurrLoc == 1) {
      if (this.story_title != '') {
        this.locName = this.story_title;
        this.navCtrl.push(StoryCategoryPage, { image: this.image, locName: this.locName, latitude: this.selLatitude, longitude: this.selLongitude });
      } else {
        this.alertProvider.title = this.error;
        this.alertProvider.message = this.error_story_title;
        this.alertProvider.showAlert();
      }
    }
    else {
      if (this.selLatitude == 0 && this.selLongitude == 0) {

        this.alertProvider.title = this.error;
        this.alertProvider.message = this.enter_value_serach;
        this.alertProvider.showAlert();
      } else {
        console.log('next category');
        console.log("this.locName : " + this.locName);

        this.navCtrl.push(StoryCategoryPage, { image: this.image, locName: this.locName, latitude: this.selLatitude, longitude: this.selLongitude });
      }
    }
  }

  //on insert input in location search
  public onInput(ev: any) {
    if (ev.target.value != '' || ev.target.value != undefined) {
      this.search = ev.target.value;
      this.locations = [];
      this.getLocation();
    }
  }

  //on cancel input in search bar
  public onCancel(ev: any) {
    this.search = '';
  }

  //getting location on input search
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

  //on location item select from list
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