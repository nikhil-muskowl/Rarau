import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BaiduProvider {
  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  public responseData: any;
  private URL;

  constructor(public http: HttpClient) {
    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  //get location name from lat long
  location(data: any) {
    // this.URL = 'http://api.map.baidu.com/place/v2/search?query=' + data.query + '&location=39.915,116.404&output=json&ak=j7eig5KpXzk4YsWNwpagmybjL2WRGCZC';

    this.formData = new FormData();
    this.formData.append('query', data.query);
    this.formData.append('location', data.location);

    this.URL = 'http://social-app.muskowl.com/baidu/location';
    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //get list of cities from json
  getCities() {
    return this.http.get('assets/city/baidu_city.json');
  }

  //set city in storage
  public setCity(data) {
    console.log('setCity when setCity : ' + JSON.stringify(data));
    try {
      window.localStorage.setItem('City', data);
    } catch (error) {

    }
  }

  //clear city storage
  public unSetCity() {
    try {
      window.localStorage.removeItem('City');
    } catch (error) {
    }
  }

  //get city from storage
  public getCity() {
    try {
      return window.localStorage.getItem('City');
    } catch (error) {
      return 131;
    }
  }
}
