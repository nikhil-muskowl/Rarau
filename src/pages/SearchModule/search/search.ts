import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { LoginProvider } from '../../../providers/login/login';
import { BaiduProvider } from '../../../providers/baidu/baidu';
import { SearchResProvider } from '../../../providers/search-res/search-res';
import { LocationTrackerProvider } from '../../../providers/location-tracker/location-tracker';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchForm: FormGroup;
  private formData: any;
  searchUser;
  public categories: any;
  public categoriesData: any;
  public locations: any;
  public fileterData: any;
  public filterData: any;
  public responseData: any;
  public searchData: any;
  public searchResponse: any;
  public searchLoc;
  public searchUse;
  public searchCat;
  public locName;
  public latitude;
  public longitude;
  public searcLatitude;
  public searcLongitude;
  public paramData;
  public user_id;
  public city_id;

  public story_srch_user;
  public story_srch_loc;
  public search_text;
  public category_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public storyService: StoryServiceProvider,
    public LoginProvider: LoginProvider,
    private view: ViewController,
    public formBuilder: FormBuilder,
    public locationTrackerProvider: LocationTrackerProvider,
    public baiduProvider: BaiduProvider,
    public searchProvider: SearchResProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    // this.setText();
    // this.getCategory();
    // this.city_id = this.baiduProvider.getCity();

    // this.locationTrackerProvider.setLocation();
    //uncommnet below for HK testing 
    // this.latitude = this.locationTrackerProvider.getLatitude();
    // this.longitude = this.locationTrackerProvider.getLongitude();

    //uncommnet below for India testing 
    // this.latitude = 39.919981;
    // this.longitude = 116.414977;
    // console.log('this.locationTracker.getLatitude : ' + this.locationTracker.getLatitude());
    // console.log('this.locationTracker.getLongitude : ' + this.locationTracker.getLongitude());
  }


  //when view will enter in page
  ionViewWillEnter() {
    this.setText();
    this.getCategory();
    this.city_id = this.baiduProvider.getCity();

    this.locationTrackerProvider.setLocation();
    //uncommnet below for HK testing 
    this.latitude = this.locationTrackerProvider.getLatitude();
    this.longitude = this.locationTrackerProvider.getLongitude();
  }

  //setting text according to language
  setText() {

    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('story_srch_user').subscribe((text: string) => {
      this.story_srch_user = text;
    });
    this.translate.get('story_srch_loc').subscribe((text: string) => {
      this.story_srch_loc = text;
    });
    this.translate.get('search').subscribe((text: string) => {
      this.search_text = text;
    });
    this.translate.get('category').subscribe((text: string) => {
      this.category_txt = text;
    });
  }

  //get all category from server
  getCategory() {
    this.categories = [];
    this.loadingProvider.present();

    this.storyService.getCategory().subscribe(
      response => {
        this.responseData = response;
        console.log('Category : ' + JSON.stringify(response));

        this.categories = this.responseData.data;
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  //close the modal and redirect to calling page with data
  closeModal() {
    const data = {
      // search: this.searchUser
    };
    this.view.dismiss();
  }

  //global search button click to set data
  globalSearch() {
    console.log('searchUsercat : ' + this.searchCat);
    console.log('searchUse : ' + this.searchUse);
    console.log('searchLoc : ' + this.searchLoc);
    console.log('searchlatitude : ' + this.searcLatitude);
    console.log('searclongitude : ' + this.searcLongitude);
    console.log('latitude : ' + this.latitude);
    console.log('longitude : ' + this.longitude);

    if (this.searchCat != undefined || this.searchUse != undefined || this.searchLoc != undefined) {
      const data = {
        searchCat: this.searchCat,
        searchUse: this.searchUse,
        searchLoc: this.searchLoc,
        latitude: this.searcLatitude,
        longitude: this.searcLongitude
      };
      console.log('data in modal : ' + JSON.stringify(data));
      this.view.dismiss(data);
    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

  //search category for a user
  searchUsercat() {
    console.log('searchUsercat : ' + this.searchCat);

    if (this.searchCat != undefined) {
      const data = {
        searchCat: this.searchCat
      };
      this.view.dismiss(data);

    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

  //search user's story
  searchUserStory() {
    console.log('searchUse : ' + this.searchUse);

    if (this.searchUse != undefined) {

      const data = {
        searchUse: this.searchUse,
      };
      this.view.dismiss(data);

    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

  //search by location
  searchLocation() {
    event.stopPropagation();
    console.log('searchLoc : ' + this.searchLoc);

    if (this.searchLoc != undefined) {

      const data = {
        latitude: this.latitude,
        longitude: this.longitude
      };
      this.view.dismiss(data);

    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

  //only search user
  searchUsers(event) {
    event.stopPropagation();
    this.searchUser = this.searchForm.value.searchUser;
    console.log('searchUser: ' + this.searchUser);

    if (this.searchForm.value.searchUser != '') {
      const data = {
        searchUsers: this.searchUser,
      };
      this.view.dismiss(data);
    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

  //get locations on autocomplete
  public getLocation() {

    this.fileterData = {
      query: this.searchLoc,
      location: this.city_id,
      latitude: this.latitude,
      longitude: this.longitude,
      // location: `${this.latitude},${this.longitude}`
    };

    this.baiduProvider.location(this.fileterData).subscribe(
      response => {
        console.log(response);
        this.responseData = response;
        this.locations = this.responseData.result;

        console.log('location : ' + JSON.stringify(this.locations));
      },
      err => { console.error(err); }
    );
    console.log(this.locations);
  }

  //get users on autocomplete
  public getUsers() {

    this.filterData = {
      search: this.searchUse,
      start: 0,
      length: 10
    };

    this.searchProvider.apiSearchRes(this.filterData).subscribe(
      response => {
        console.log(response);
        this.searchResponse = response;
        this.searchData = this.searchResponse.data;
      },
      err => { console.error(err); }
    );
    console.log(this.locations);
  }

  //on location select
  public locItemSelected(location: any) {
    console.log(location);
    if (location) {
      this.searchLoc = location.name;
      this.locName = location.name;
      this.searcLatitude = location.location.lat;
      this.searcLongitude = location.location.lng;
      // this.latitude = location.location.lat;
      // this.longitude = location.location.lng;
    }

    console.log(this.searcLatitude);
    console.log(this.searcLongitude);
    this.locations = [];
  }

  //on user select
  public searchItemSelected(searches: any) {
    console.log(searches);
    if (searches) {
      this.searchUse = searches.name;
    }

    this.searchData = [];
  }

  //input on user search autocomplete
  public onUserInput(ev: any) {
    this.searchUse = ev.target.value;
    this.searchData = [];
    this.getUsers();
  }

  //cancel on user search
  public onUserCancel(ev: any) {
    this.searchUse = '';
  }

  //input on location search autocomplete
  public onLocInput(ev: any) {
    if (ev.target.value != "" || ev.target.value != undefined) {
      this.searchLoc = ev.target.value;
      this.locations = [];
      this.getLocation();
    }
  }

  //cancel on user search
  public onLocCancel(ev: any) {
    this.searchLoc = '';
  }

}
