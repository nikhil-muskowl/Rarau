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

  //get past events from server
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

  //get rankes story of event
  getRankedStory(data) {
    this.formData = new FormData();

    this.formData.append('event_id', data.event_id);
    this.formData.append('length', data.length);
    this.formData.append('start', data.start);
    this.formData.append('order[0][column]', '3');
    this.formData.append('order[0][dir]', 'desc');

    if (data.location != undefined)
      this.formData.append('location', data.location);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //get upcoming events from server
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

  //get event details from server
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
