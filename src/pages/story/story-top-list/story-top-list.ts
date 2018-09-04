import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider, ) {

    this.isLogin();
    this.getStories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoryTopListPage');
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  getStories() {
    this.loadingProvider.present();

    this.paramData = {
      'user_id': this.user_id
    };

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

  goToList() {
    this.navCtrl.push(StoryListPage, { user_id: this.user_id });
  }
}
