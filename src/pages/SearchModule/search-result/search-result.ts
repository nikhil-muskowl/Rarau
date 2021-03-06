import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { OthersProfilePage } from '../../AccountModule/others-profile/others-profile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProfilePage } from '../../MainModule/profile/profile';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { SearchResProvider } from '../../../providers/search-res/search-res';
import { LoginProvider } from '../../../providers/login/login';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { NetworkProvider } from '../../../providers/network/network';

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})

export class SearchResultPage {

  public rarau;
  public search_result;
  public no_result;
  public no_result_found;

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
  private error_srcLoc;
  public user_id;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public platform: Platform,
    public network: NetworkProvider,
    public loadingProvider: LoadingProvider,
    public searchRes: SearchResProvider,
    public LoginProvider: LoginProvider,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.setText();
    this.searchTxt = this.navParams.data.searchUse;
    console.log('searchTxt: ' + JSON.stringify(this.navParams.data));
    this.getSearch(this.searchTxt);
    this.crearForm();
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('search_result').subscribe((text: string) => {
      this.search_result = text;
    });
    this.translate.get('no_result').subscribe((text: string) => {
      this.no_result = text;
    });
    this.translate.get('no_result_found').subscribe((text: string) => {
      this.no_result_found = text;
    });
    this.translate.get('error_srcLoc').subscribe((text: string) => {
      this.error_srcLoc = text;
    });
  }

//when view will be enter in page
  ionViewWillEnter() {
    this.isLogin();
  }

  //check user is logged in or not
  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  //get search result of user
  getSearch(search) {
    if (this.network.checkStatus() == true) {
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
            this.alertProvider.title = this.no_result;
            this.alertProvider.message = this.no_result_found;
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
    else {
      this.network.displayNetworkUpdate();
    }
  }

  //goto previous page
  goBack() {
    this.navCtrl.pop();
  }

  //bind data on load more
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

  //on scroll load more
  onScrollDown(infiniteScroll) {
    this.pageStart += this.pageLength;

    if (this.pageStart <= this.recordsTotal) {
      this.getSearch(this.search);
    }
    infiniteScroll.complete();
  }

  //goto user's profile
  getProfile(data: any) {
    if (data.id == this.user_id) {
      console.log('id Matched');
      this.navCtrl.push(ProfilePage);
    }
    else {
      this.navCtrl.push(OthersProfilePage, { id: data.id, user_id: this.user_id });
    }
  }

  //create and validate form
  crearForm() {
    this.searchpageForm = this.formBuilder.group({
      searchText: ['', Validators.required],
    });
  }

  //call search event result
  search(event) {
    event.stopPropagation();
    this.searchValue = this.searchpageForm.value.searchText;
    this.data = '';
    this.model = [];
    this.getSearch(this.searchValue);
  }
}