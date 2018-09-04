import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';
import { Platform } from 'ionic-angular';

@Injectable()
export class SearchResProvider {

  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  private URL;

  constructor(public http: HttpClient,
    public platform: Platform,
    public ConfigProvider: ConfigProvider) {

    console.log('Hello SearchResProvider Provider');
    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }


  apiSearchRes(data) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + 'user_module/api/users_api';

    this.formData.append('search[value]', data.search);
    this.formData.append('start', data.start);
    this.formData.append('length', data.length);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }
}
