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

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchForm: FormGroup;
  private formData: any;
  searchUser;
  public catId: any;
  public categories: any;
  public categoriesData: any;
  public locations: any;
  public fileterData: any;
  public filterData: any;
  public responseData: any;
  public searchData: any;
  public searchResponse: any;
  public searchLoc = '';
  public searchUse = '';
  public searchCat = '';
  public locName = '';
  public latitude: number = 0;
  public longitude: number = 0;
  public paramData;
  public user_id;

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
    public searchProvider: SearchResProvider, ) {

    // this.createForm();
    this.getCategory();
  }

  getCategory() {

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

  createForm() {
    this.searchForm = this.formBuilder.group({
      searchCat: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  closeModal() {
    const data = {
      search: this.searchUser
    };
    this.view.dismiss(data);
  }

  public onCatChange(selectedValue) {
    this.catId = selectedValue;
    console.log(this.catId);
  }

  searchUsercat() {
    event.stopPropagation();
    console.log('searchUsercat : ' + this.searchCat);

    if (this.searchCat != '') {
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

  searchLocation() {
    event.stopPropagation();
    console.log('searchLoc : ' + this.searchLoc);

    if (this.searchLoc != '') {

      const data = {
        searchLoc: this.searchLoc,
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

  searchUsers() {
    event.stopPropagation();
    console.log('searchUse : ' + this.searchUse);

    if (this.searchUse != '') {

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

  public getLocation() {

    this.fileterData = {
      query: this.searchLoc,
      location: `${this.latitude},${this.longitude}`
    };

    this.baiduProvider.location(this.fileterData).subscribe(
      response => {
        console.log(response);
        this.responseData = response;
        this.locations = this.responseData.results;
      },
      err => { console.error(err); }
    );
    console.log(this.locations);
  }

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

  public locItemSelected(location: any) {
    console.log(location);
    if (location) {
      this.searchLoc = location.name;
      this.locName = location.name;
      this.latitude = location.location.lat;
      this.longitude = location.location.lng;
    }

    console.log(this.latitude);
    console.log(this.longitude);
    this.locations = [];
  }

  public searchItemSelected(searches: any) {
    console.log(searches);
    if (searches) {
      this.searchUse = searches.name;
    }

    this.searchData = [];
  }

  public onUserInput(ev: any) {
    this.searchUse = ev.target.value;
    this.searchData = [];
    this.getUsers();
  }

  public onUserCancel(ev: any) {
    this.searchUse = '';
  }

  public onLocInput(ev: any) {
    this.searchLoc = ev.target.value;
    this.locations = [];
    this.getLocation();
  }

  public onLocCancel(ev: any) {
    this.searchLoc = '';
  }

}
