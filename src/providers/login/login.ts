import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import { ConfigProvider } from '../config/config';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Jsonp } from '@angular/http';

@Injectable()
export class LoginProvider {

  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  public responseData: any;
  private URL;
  public user_id;
  public user_group_id = '';
  public name = '';
  public email = '';
  public contact = '';

  constructor(public http: HttpClient,
    public storage: Storage,
    public platform: Platform,
    public ConfigProvider: ConfigProvider) {

    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
    this.user_id = this.isLogin();
  }

  apiRegister(data: any, gender, dob, image) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + 'user_module/api/users_api/register';

    this.formData.append('name', data.name);
    this.formData.append('email', data.email);
    this.formData.append('password', data.password);
    this.formData.append('passconf', data.passconf);
    this.formData.append('dob', dob);
    this.formData.append('gender_id', gender);
    this.formData.append('image', image);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiProfileUpload(images) {

    this.URL = ConfigProvider.BASE_URL + 'user_module/api/users_api/uploadprofile';
    this.formData.append('image', images);
    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiUpdatePassword(data: any) {
    this.URL = ConfigProvider.BASE_URL + 'user_module/api/users_api/updatepassword';
    this.formData.append('password', data.password);
    this.formData.append('passconf', data.passconf);
    this.formData.append('id', this.user_id);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiLogin(data: any) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + 'user_module/api/users_api/login';
    console.log(this.URL);
    this.formData.append('username', data.email);
    this.formData.append('password', data.password);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiForgot(data: any) {
    this.formData = new FormData();

    console.log(data);
    this.URL = ConfigProvider.BASE_URL + 'user_module/api/users_api/forgot';
    console.log(this.URL);
    this.formData.append('email', data.email);

    return this.http.post(this.URL, this.formData,
      {
        headers: this.headers,
      }
    );
  }

  public setData(data) {
    console.log('setData when login : '+JSON.stringify(data));
    this.user_id = data.id;
    try {
      window.localStorage.setItem('userId', data.id);
    } catch (error) {

    }
  }

  public unSetData() {
    this.clear();
    try {
      window.localStorage.removeItem('userId');
    } catch (error) {
    }
  }

  public isLogin() {
    try {
      return window.localStorage.getItem('userId');
    } catch (error) {
      return 0;
    }
  }

  clear() {
    this.user_id = 0;
    this.user_group_id = '0';
    this.name = '';
    this.email = '';
    this.contact = '';
  }
}
