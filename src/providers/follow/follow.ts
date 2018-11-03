import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';

@Injectable()
export class FollowProvider {
  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  private URL;
  constructor(public http: HttpClient,
    public ConfigProvider: ConfigProvider) {
    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  getList(user_id) {
    this.formData = new FormData();

    this.URL = ConfigProvider.BASE_URL + 'follow_requests';
    this.formData.append('user_id', user_id);
    console.log('user_id: ' + user_id);
    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  getFollowersList(data) {
    this.formData = new FormData();

    this.URL = ConfigProvider.BASE_URL + 'user_module/api/followers_api';
    this.formData.append('user_id', data.user_id);
    // this.formData.append('current_user_id', data.current_user_id);
    this.formData.append('start', data.start);
    this.formData.append('length', data.length);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  ActionFollow(user_id, curr_user_id) {

    this.formData = new FormData();

    this.URL = ConfigProvider.BASE_URL + 'user_module/api/followers_api/follow';
    console.log('user_id:' + user_id + curr_user_id);
    this.formData.append('user_id', user_id);
    this.formData.append('current_user_id', curr_user_id);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  ActionUnFollow(user_id, curr_user_id) {
    this.formData = new FormData();

    this.URL = ConfigProvider.BASE_URL + 'user_module/api/followers_api/unfollow';
    console.log('user_id:' + user_id + curr_user_id);
    this.formData.append('user_id', user_id);
    this.formData.append('current_user_id', curr_user_id);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }
}
