import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';

@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  latitude;
  longitude;
  
  constructor(public zone: NgZone,
    public geolocation: Geolocation) {
  }

  getPosition(): Promise<any> {
    return new Promise((resolve) => {
      let options = {
        frequency: 3000,
        enableHighAccuracy: true
      };

      this.watch = this.geolocation.watchPosition(options);

      this.watch.subscribe((position) => {
        resolve(position);
      });

    });
  }


  public setData(data) {
    try {
      window.localStorage.setItem('userId', data.id);
    } catch (error) {

    }
  }

  public unSetData() {
    this.clear();
    try {
      window.localStorage.removeItem('lati');
    } catch (error) {
    }
  }

  public isLogin() {
    try {
      return window.localStorage.getItem('location');
    } catch (error) {
      return 0;
    }

  }

  clear() {

  }
}
