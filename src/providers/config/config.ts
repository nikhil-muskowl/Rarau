import { Injectable } from '@angular/core';


@Injectable()
export class ConfigProvider {

  public tute;

  static BASE_URL: string = 'http://social-app.muskowl.com/';
  // static BASE_URL: string = 'http://172.16.8.87/codeigniter/social_app/';

  constructor() {

  }

  public setisSeen(data) {
    console.log('setData when isSeen : ' + JSON.stringify(data));
    this.tute = data;
    try {
      window.localStorage.setItem('isSeen', data);
    } catch (error) {

    }
  }

  public unSetData() {
    this.clear();
    try {
      window.localStorage.removeItem('isSeen');
    } catch (error) {
    }
  }

  public isSeen() {
    try {
      return window.localStorage.getItem('isSeen');
    } catch (error) {
      return false;
    }
  }

  clear() {
    this.tute = false;
  }
}
