import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { StoryListPage } from '../story-list/story-list';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';

@IonicPage()
@Component({
  selector: 'page-story-top-list',
  templateUrl: 'story-top-list.html',
})
export class StoryTopListPage {

  public user_id;

  private status;
  private message;
  private data;
  private stories;
  private responseData;
  private latitude;
  private longitude;
  public paramData;
  public marker;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider,
    public platform: Platform,
  ) {

    if (this.navParams.get('marker')) {
      this.marker = JSON.parse(this.navParams.get('marker'));
      this.latitude = this.marker.lat;
      this.longitude = this.marker.lng;
    } else {
      this.latitude = 0;
      this.longitude = 0;
    }

    this.isLogin();

    this.paramData = {
      'user_id': this.user_id,
      'latitude': this.latitude,
      'longitude': this.longitude,
      'length': '2',
      'start': '0',
    };

    console.log(this.paramData);

    this.getStories();
  }

  //check user is logged in
  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  //get stories from server
  getStories() {
    this.storyService.apiTopStory(this.paramData).subscribe(
      response => {
        this.responseData = response;
        this.data = this.responseData.data;
      },
      err => console.error(err),
      () => {
      }
    );
  }

  //goto list of stories
  goToList() {
    this.navCtrl.push(StoryListPage, this.paramData);
  }
}
