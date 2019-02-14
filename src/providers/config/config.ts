import { Injectable } from '@angular/core';


@Injectable()
export class ConfigProvider {


  static BASE_URL: string = 'http://social-app.muskowl.com/';
  // static BASE_URL: string = 'http://172.16.8.87/codeigniter/social_app/';

  constructor() {

  }

  //set tutorial is seen
  public setisSeen(data) {
    console.log('setData when isSeen : ' + JSON.stringify(data));
    try {
      window.localStorage.setItem('isSeen', data);
    } catch (error) {

    }
  }

  //cleat tutorial storage
  public unSetData() {
    try {
      window.localStorage.removeItem('isSeen');
    } catch (error) {
    }
  }

  //check tutorial is seen or not
  public isSeen() {
    try {
      return window.localStorage.getItem('isSeen');
    } catch (error) {
      return false;
    }
  }
}
