import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EventProvider {
  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  public responseData: any;
  private URL;
  constructor(public http: HttpClient) {
    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  apiCreateEvent(data: any) {

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

  apiGetEvents(data: any) {

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

}
