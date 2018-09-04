import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';

@Injectable()
export class ProfileProvider {

  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  public responseData: any;
  private URL;

  constructor(public http: HttpClient) {
    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  apiUpdateProfile(data: any, id) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + 'user_module/api/users_api/updatedetail';

    console.log('Pro Id' + id);
    console.log('name' + data.name);
    console.log('email' + data.email);
    this.formData.append('id', id);
    this.formData.append('name', data.name);
    this.formData.append('email', data.email);
    this.formData.append('contact', '');
    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apigetProfile(id, user_id) {
    this.formData = new FormData();

    this.formData.append('user_id', id);
    this.formData.append('current_user_id', user_id);
    this.URL = ConfigProvider.BASE_URL + 'user_module/api/users_api/detail';

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  apigetMyProfile(id) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + 'user_module/api/users_api/detail/' + id;

    return this.http.get(this.URL,
      {
        headers: this.headers,
      }
    );
  }

  apiuploadProfilePic(id, image) {
    this.formData = new FormData();

    this.formData.append('id', id);
    this.formData.append('image', image);
    this.URL = ConfigProvider.BASE_URL + 'user_module/api/users_api/updateprofilepic';

    return this.http.post(this.URL, this.formData,
      {
        headers: this.headers,
      }
    );
  }
}
