import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { AlertProvider } from '../../providers/alert/alert';


@Injectable()
export class ConfigProvider {
  static BASE_URL: string = 'http://social-app.muskowl.com/';
  // static BASE_URL: string = 'http://172.16.8.87/codeigniter/social_app/';
  static BASE_URL_LOCAL: string = 'http://172.16.8.87/codeigniter/social_app/';
  static CUSTOMER_ID = 0;
  static API_TOKEN = '';
  private URL;
  private headers = new HttpHeaders();
  private formData: FormData = new FormData();
  private responseData;

  constructor(public http: HttpClient,
    public storage: Storage,
    public alertProvider: AlertProvider, ) {
    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');

    this.getData()
      .then((data) => {
        if (data) {
          ConfigProvider.API_TOKEN = data;
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  public apiLogin() {
    this.URL = ConfigProvider.BASE_URL;

    this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    ).subscribe(
      response => {
        // alert(JSON.stringify(response));
        this.responseData = response;

        if (this.responseData.success && this.responseData.success != '') {
          // this.alertProvider.title = 'Success';
          // this.alertProvider.message = this.responseData.success;
          // this.alertProvider.showAlert();
        }

        if (this.responseData.error) {
          if (this.responseData.error.ip && this.responseData.error.ip != '') {
            // this.alertProvider.title = 'Error';
            // this.alertProvider.message = this.responseData.error.ip;
            // this.alertProvider.showAlert();
          }
        }

        this.setData(this.responseData.api_token);
      },
      err => console.error(err),
      () => {
      }
    );
  }

  public setData(data) {
    return this.storage.set('API_TOKEN', data).then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );
  }

  public getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get('API_TOKEN')
        .then((data) => {
          resolve(data);
        })
        .catch(e => {
          console.log(e);
          reject(e);
        });
    });
  }

}
