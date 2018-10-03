import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OthersProfilePage } from '../../AccountModule/others-profile/others-profile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProfilePage } from '../../MainModule/profile/profile';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { SearchResProvider } from '../../../providers/search-res/search-res';
import { LoginProvider } from '../../../providers/login/login';

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})

export class SearchResultPage {

  public searchTxt;
  public responseData;
  public data;
  public SearchPage: string;
  public pageStart = 0;
  public pageLength = 5;
  public recordsTotal;
  public filterData;
  public searchValue;
  public model: any[] = [];

  searchpageForm: FormGroup;
  private formData: any;
  private error_srcLoc = 'field is required';
  public user_id;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public searchRes: SearchResProvider,
    public LoginProvider: LoginProvider,
    public formBuilder: FormBuilder, ) {

    this.searchTxt = this.navParams.data.searchUsers;
    console.log('searchTxt: ' + JSON.stringify(this.navParams.data));
    this.getSearch(this.searchTxt);
    this.crearForm();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.isLogin();
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  getSearch(search) {

    this.loadingProvider.present();
    this.filterData = { "search": search, "start": this.pageStart, "length": this.pageLength };

    this.searchRes.apiSearchRes(this.filterData).subscribe(
      response => {
        this.responseData = response;
        this.recordsTotal = this.responseData.recordsTotal;
        this.data = this.responseData.data;

        if (this.data.length > 0) {
          this.binddata();
        }
        else {
          this.alertProvider.title = 'No Result';
          this.alertProvider.message = 'No search result found.!!!';
          this.alertProvider.showAlert();
        }
      },
      err => {
        console.error(err);
        this.loadingProvider.dismiss();
      },
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  goBack() {
    this.navCtrl.pop();
  }

  binddata() {
    for (let index = 0; index < this.data.length; index++) {
      this.model.push({
        id: this.data[index].id,
        name: this.data[index].name,
        image_thumb: this.data[index].image_thumb,
        status: this.data[index].status,
      });
    }
  }

  onScrollDown(infiniteScroll) {
    if (this.pageStart <= this.recordsTotal) {
      this.pageStart += this.pageLength;
      this.getSearch(this.search);
    }

    infiniteScroll.complete();
  }

  getProfile(data: any) {
    if (data.id == this.user_id) {
      console.log('id Matched');
      this.navCtrl.push(ProfilePage);
    }
    else {
      this.navCtrl.push(OthersProfilePage, { id: data.id, user_id: this.user_id });
    }
  }

  crearForm() {
    this.searchpageForm = this.formBuilder.group({
      searchText: ['', Validators.required],
    });
  }

  search(event) {
    event.stopPropagation();
    this.searchValue = this.searchpageForm.value.searchText;
    this.data = '';
    this.model = [];
    this.getSearch(this.searchValue);
  }
}