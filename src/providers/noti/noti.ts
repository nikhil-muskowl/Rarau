import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';

@Injectable()
export class NotiProvider {

  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  private URL;

  constructor(public http: HttpClient,
    public ConfigProvider: ConfigProvider) {

    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  apiRegisterDevice(data) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + 'notifications_module/api/user_devices_api/register';
    console.log('my token  : ' + JSON.stringify(data));

    this.formData.append('user_id', data.user_id);
    this.formData.append('type', data.type);
    this.formData.append('code', data.code);
    this.formData.append('provider', data.provider);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  public setToken(data) {
    try {
      window.localStorage.setItem('token', data.code);
    } catch (error) {
    }
  }

  public getToken() {
    try {
      if (window.localStorage.getItem('token')) {
        return window.localStorage.getItem('token');
      } else {
        return '0';
      }

    } catch (error) {
      return '0';
    }
  }

  apiNotiList(data) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + 'notifications_module/api/user_notifications_api';

    this.formData.append('user_id', data.user_id);
    this.formData.append('language_id', data.language_id);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }
}
