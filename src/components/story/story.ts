import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { LoadingProvider } from '../../providers/loading/loading';
import { StoryServiceProvider } from '../../providers/story-service/story-service';
import { LoginProvider } from '../../providers/login/login';
import { SingleStoryPage } from '../../pages/story/single-story/single-story';
import { NetworkProvider } from '../../providers/network/network';

@Component({
  selector: 'story',
  templateUrl: 'story.html'
})
export class StoryComponent {
  @Input('userid') user_id;
  text: string;

  public pageStart = 0;
  public pageLength = 5;
  public recordsTotal;
  public filterData;
  public responseData;
  public result;

  public records;
  public data;
  public model: any[] = [];
  public name;
  public params;
  public success;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public network: NetworkProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public storyProvider: StoryServiceProvider,
    public LoginProvider: LoginProvider,
  ) {
    console.log('Hello StoryComponent Component');
  }

  ngOnChanges() {
    console.log(this.user_id);
    // this.isLogin();
    if (this.network.checkStatus() == true) {
      this.getStories();
    }
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  getStories() {
    this.filterData = { 'start': this.pageStart, 'length': this.pageLength, 'user_id': this.user_id };

    console.log('user : ' + this.user_id);
    this.loadingProvider.present();
    this.storyProvider.getStory(this.filterData).subscribe(
      response => {

        this.records = response;
        this.recordsTotal = this.records.recordsTotal;
        this.data = this.records.data;
        console.log(JSON.stringify(this.data));

        this.binddata();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  binddata() {
    for (let index = 0; index < this.data.length; index++) {
      this.model.push({
        id: this.data[index].id,
        image_thumb: this.data[index].image_thumb,
        tags: this.data[index].tags,
        image: this.data[index].image,
        latitude: this.data[index].latitude,
        longitude: this.data[index].longitude,
        totalLikes: this.data[index].totalLikes,
        totalDislikes: this.data[index].totalDislikes,
        totalFlames: this.data[index].totalFlames,
      });
    }
  }

  gotoStoryDetail(data) {
    this.navCtrl.push(SingleStoryPage, { story_id: data.id });
  }
}
