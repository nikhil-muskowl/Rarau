import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import { ConfigProvider } from '../config/config';

@Injectable()
export class MyPetProvider {

  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  private URL;

  constructor(public http: HttpClient,
    public ConfigProvider: ConfigProvider) {

    this.headers.set('Access-Control-Allow-Origin ', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  //Pet api of user
  apiMyPetList(data) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + 'pet_module/api/user_pets_api';
    console.log('my pet paramdata  : ' + JSON.stringify(data));

    this.formData.append('user_id', data.user_id);
    this.formData.append('language_id', data.language_id);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //pet details api
  apiPetDetails(id) {
    this.URL = ConfigProvider.BASE_URL + 'pet_module/api/user_pets_api/detail/' + id;

    return this.http.get(this.URL,
      {
        headers: this.headers,
      }
    );
  }

  //pet upgrade api
  apiPetUpgrade(data) {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + 'pet_module/api/user_pets_api/update_pet';
    console.log('my pet paramdata  : ' + JSON.stringify(data));

    this.formData.append('user_id', data.user_id);
    this.formData.append('pet_id', data.pet_id);
    this.formData.append('level', data.level);

    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

}
