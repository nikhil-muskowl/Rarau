import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';

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

  apiGetPastEvents(data: any) {

    this.formData = new FormData();

    this.URL = ConfigProvider.BASE_URL + 'event_module/api/events_api';
    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiGetUpcomingEvents(data: any) {

    this.formData = new FormData();

    this.URL = ConfigProvider.BASE_URL + 'event_module/api/events_api';
    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apiGetEventDetails(id: any) {

    this.formData = new FormData();

    this.URL = ConfigProvider.BASE_URL + 'event_module/api/events_api/detail/' + id;
    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

}
