import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaiduProvider } from '../../../providers/baidu/baidu';
import { LocationTrackerProvider } from '../../../providers/location-tracker/location-tracker';
import { AlertProvider } from '../../../providers/alert/alert';
import { DomSanitizer } from "@angular/platform-browser";
import { StoryCategoryPage } from '../story-category/story-category';

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
  public data: any;
  public image;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public locationTrackerProvider: LocationTrackerProvider,
    public baiduProvider: BaiduProvider,
    public sanitizer: DomSanitizer, ) {

    this.image = this.navParams.get('image');
    console.log('image on location page : ' + this.image);

    this.latitude;
    this.longitude;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
  }

  Next() {

    if (this.latitude == 0 && this.longitude == 0) {

      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
    else {
      console.log('next category');
      this.navCtrl.push(StoryCategoryPage, { image: this.image, locName: this.locName, latitude: this.latitude, longitude: this.longitude });
    }
  }

  public onInput(ev: any) {
    this.search = ev.target.value;
    this.locations = [];
    this.getLocation();
  }

  public onCancel(ev: any) {
    this.search = '';
  }

  public getLocation() {

    this.fileterData = {
      query: this.search,
      location: `${this.latitude},${this.longitude}`
    };

    this.baiduProvider.location(this.fileterData).subscribe(
      response => {
        console.log(response);
        this.responseData = response;
        this.locations = this.responseData.results;
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
      this.latitude = location.location.lat;
      this.longitude = location.location.lng;
    }

    console.log(this.latitude);
    console.log(this.longitude);
    this.locations = [];
  }
}