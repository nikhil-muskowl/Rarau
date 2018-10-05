import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { StoryScreenPage } from '../story-screen/story-screen';


@IonicPage()
@Component({
  selector: 'page-story-list',
  templateUrl: 'story-list.html',
})
export class StoryListPage {

  public user_id;
  public paramData;
  public data;
  private responseData;
  private latitude;
  private longitude;
  public searchCat;
  public searchUse;

  title = 'Kuala Lumpur, Malaysia';
  date = '30 May,18 03:00AM';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider
  ) {

    this.searchUse = this.navParams.get('searchUse');
    this.searchCat = this.navParams.get('searchCat');
    if (this.navParams.get('latitude')) {
      this.latitude = this.navParams.get('latitude');
    } else {
      this.latitude = 0;
    }
    if (this.navParams.get('longitude')) {
      this.longitude = this.navParams.get('longitude');
    } else {
      this.longitude = 0;
    }

    this.isLogin();
    this.getStories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoryListPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  getStories() {
    this.loadingProvider.present();
    this.paramData = {
      'user_id': this.user_id,
      'latitude': this.latitude,
      'longitude': this.longitude,
      'searchCat': this.searchCat,
      'searchUse': this.searchUse,
    };
    console.log('Story list page : ' + JSON.stringify(this.paramData));

    this.storyService.apiTopStory(this.paramData).subscribe(
      response => {
        this.responseData = response;
        this.data = this.responseData.data;
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  showStory(data) {
    if (this.user_id) {
      // this.navCtrl.push(StoryScreenPage, { story_id: data.id });
      this.navCtrl.push(StoryScreenPage, this.paramData);
    }
    else {
      this.alertProvider.title = 'Forbidden';
      this.alertProvider.message = 'Please Login to continue.';
      this.alertProvider.showAlert();
    }
  }

}
