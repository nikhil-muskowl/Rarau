import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { ShowStoryPage } from '../show-story/show-story';

@IonicPage()
@Component({
  selector: 'page-story-screen',
  templateUrl: 'story-screen.html',
})
export class StoryScreenPage {

  public story_id;
  public user_id;
  public paramData;
  public responseData;
  public data;
  private id;
  private user_name;
  private user_image_thumb;
  private title;
  private description;
  private html;
  private image;
  private tags;
  private comments;
  private totalLikes;
  private totalDislikes;
  private totalFlames;
  private created_date;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider,
    public toastCtrl: ToastController) {

    this.isLogin();
    this.story_id = this.navParams.get('story_id');
    this.getStories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoryScreenPage');
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  goBack() {
    this.navCtrl.pop();
  }

  getStories() {
    this.loadingProvider.present();

    this.paramData = {
      'story_id': this.story_id,
      'language_id': 1,
    };

    this.storyService.getStoryDetail(this.paramData).subscribe(
      response => {
        this.responseData = response;

        this.data = this.responseData.result;
        this.responseData.result[0].totalDislikes;
        console.log('story data : ' + JSON.stringify(this.data));
        this.title = this.responseData.result[0].title;
        this.description = this.responseData.result[0].description;
        this.user_name = this.responseData.result[0].user_name;
        this.user_image_thumb = this.responseData.result[0].user_image_thumb;
        this.html = this.responseData.result[0].html;
        this.image = this.responseData.result[0].image_thumb;
        this.tags = this.responseData.result[0].tags;
        this.totalLikes = this.responseData.result[0].totalLikes;
        this.totalDislikes = this.responseData.result[0].totalDislikes;
        this.totalFlames = this.responseData.result[0].totalFlames;
        this.created_date = this.responseData.result[0].created_date;
        this.comments = this.responseData.result[0].comments;
        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  goToComments() {

    this.navCtrl.push(ShowStoryPage, { story_id: this.story_id });
  }

  swipeAll(event: any): any {
    console.log('Swipe All', event);
  }

  swipeLeft(event: any): any {
    console.log('Swipe Left', event);
  }

  swipeRight(event: any): any {
    console.log('Swipe Right', event);
  }

  swipeUp(event: any): any {
    console.log('Swipe Up', event);
    this.rankStory(1);
  }

  swipeDown(event: any): any {
    console.log('Swipe Down', event);
    this.rankStory(0);
  }

  public rankStory(rank: number) {
    // this.loadingProvider.present();
    var likes = 0;
    var dislikes = 0;

    if (rank == 1) {
      likes = 1;
    } else {
      dislikes = 0;
    }

    var data = {
      'user_id': this.user_id,
      'story_id': this.story_id,
      'likes': likes,
      'dislikes': dislikes,
    };

    this.storyService.rankStory(data).subscribe(
      response => {
        this.responseData = response;
        if (this.responseData.status) {
          if (rank == 1) {
            this.totalLikes++;
          } else {
            this.totalDislikes++;
          }

        } else {
          this.responseData.result.forEach(element => {

            if (element.id == 'story_id') {

              let toast = this.toastCtrl.create({
                message: element.text,
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            }
          });
        }
        // this.loadingProvider.dismiss();
      },
      err => {
        console.error(err);
        // this.loadingProvider.dismiss();
      }
    );


    // this.loadingProvider.dismiss();
  }
}
