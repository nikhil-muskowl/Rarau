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

  public setLocation() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      window.localStorage.setItem('latitude', String(data.coords.latitude));
      window.localStorage.setItem('longitude', String(data.coords.longitude));
    });
  }

  public clearLocation() {
    window.localStorage.removeItem('latitude');
    window.localStorage.removeItem('longitude');
  }

  public getLatitude() {
    this.latitude = window.localStorage.getItem('latitude');
    return this.latitude;
  }

  public getLongitude() {
    this.longitude = window.localStorage.getItem('longitude');
    return this.longitude;
  }

}
