import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';

@Injectable()
export class PeopleProvider {
  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  private URL;

  constructor(public http: HttpClient,
    public ConfigProvider: ConfigProvider) {

    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  getList() {
    this.URL = ConfigProvider.BASE_URL + 'users/search';
    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  sendFollow(user_id, follower_id) {
    
    this.URL = ConfigProvider.BASE_URL + 'follow_requests/send';
    console.log('user_id:'+ user_id);
    this.formData.append('user_id', user_id);
    this.formData.append('follower_id', follower_id);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }
  
}
