import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';

@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  private latitude;
  private longitude;

  constructor(public zone: NgZone, public geolocation: Geolocation) {
    this.setLocation();
  }

  //set location in storage
  public setLocation() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log('location data' + JSON.stringify(data));
      window.localStorage.setItem('latitude', String(data.coords.latitude));
      window.localStorage.setItem('longitude', String(data.coords.longitude));
    });
  }

  //clear of current location data from storage
  public clearLocation() {
    window.localStorage.removeItem('latitude');
    window.localStorage.removeItem('longitude');
  }

  //get Latitude of current location
  public getLatitude() {
    this.latitude = window.localStorage.getItem('latitude');
    return this.latitude;
  }

  //get Longitude of current location
  public getLongitude() {
    this.longitude = window.localStorage.getItem('longitude');
    return this.longitude;
  }

}
