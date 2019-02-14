import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Platform } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { ShowStoryPage } from '../show-story/show-story';
import { ReceiptShowPage } from '../receipt-show/receipt-show';
import { Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { ReportPage } from '../../Popover/report/report';

@IonicPage()
@Component({
  selector: 'page-story-screen',
  templateUrl: 'story-screen.html',
})
export class StoryScreenPage {
  @ViewChild(Slides) slides: Slides;

  public story_id;
  public user_id;
  public paramData;
  public responseData;
  public status;
  public data;
  private id;
  private user_name;
  private user_image;
  private title;
  private description;
  private html;
  private image;
  private tags;
  private totalLikes;
  private totalDislikes;
  private totalFlames;
  private created_date;
  private latitude;
  private longitude;
  public searchCat;
  public searchUse;

  public story;
  public emoji;
  public swipe_comment;
  public rarau;
  public already_saved;
  public saved;
  public story_saved;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });
    this.setText();

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

    // this.story_id = this.navParams.get('story_id');
    this.isLogin();
    this.getStories();
  }

  //report user's story
  reportStory(id) {
    console.log('Report user');
    let params = {
      'story_id': id,
      'type': 2
    };

    this.navCtrl.push(ReportPage, params);
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('story').subscribe((text: string) => {
      this.story = text;
    });
    this.translate.get('emoji').subscribe((text: string) => {
      this.emoji = text;
    });
    this.translate.get('swipe_comment').subscribe((text: string) => {
      this.swipe_comment = text;
    });
    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('already_saved').subscribe((text: string) => {
      this.already_saved = text;
    });
    this.translate.get('saved').subscribe((text: string) => {
      this.saved = text;
    });
    this.translate.get('story_saved').subscribe((text: string) => {
      this.story_saved = text;
    });
  }

  //check user is logged in
  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  //show receipt page
  showReceipt(receipt) {
    this.navCtrl.push(ReceiptShowPage, { receipt: receipt });
  }

  //goto previous page
  goBack() {
    this.navCtrl.pop();
  }

  //get story from server
  getStories() {
    this.loadingProvider.present();

    // this.paramData = {
    //   'story_id': this.story_id,
    //   'language_id': 1,
    // };

    this.paramData = {
      'user_id': this.user_id,
      'latitude': this.latitude,
      'longitude': this.longitude,
      'searchCat': this.searchCat,
      'searchUse': this.searchUse,
    };

    // this.storyService.getStoryDetail(this.paramData).subscribe(
    //   response => {

    //     this.responseData = response;

    //     this.data = this.responseData.result;
    //     this.responseData.result[0].totalDislikes;
    //     this.title = this.responseData.result[0].title;
    //     this.description = this.responseData.result[0].description;
    //     this.user_name = this.responseData.result[0].user_name;
    //     this.user_image = this.responseData.result[0].user_image;
    //     this.html = this.responseData.result[0].html;
    //     this.image = this.responseData.result[0].image;
    //     this.tags = this.responseData.result[0].tags;
    //     this.totalLikes = this.responseData.result[0].totalLikes;
    //     this.totalDislikes = this.responseData.result[0].totalDislikes;
    //     this.totalFlames = this.responseData.result[0].totalFlames;
    //     this.created_date = this.responseData.result[0].created_date;
    //     this.loadingProvider.dismiss();
    //   },
    //   err => console.error(err),
    //   () => {
    //     this.loadingProvider.dismiss();
    //   }
    // );

    this.storyService.apiTopStory(this.paramData).subscribe(
      response => {
        this.responseData = response;
        this.data = this.responseData.data;
        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  //on slide change
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == this.data.length) {
      this.slides.stopAutoplay();
    }
  }

  //goto comments page
  goToComments(event: any, slide): any {
    console.log('Swipe comment', event);
    console.log('slide data ', JSON.stringify(slide));

    this.navCtrl.push(ShowStoryPage, { story_id: slide.id });
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

  //swipe up to like story
  swipeUp(event: any): any {
    console.log('Swipe Up', event);

    this.rankStory(1);

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="http://social-app.muskowl.com/assets/images/ranking/like.png" height="400">`,
      cssClass: 'my-loading-fire',
      duration: 1000
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();
  }

  //swipe down to dislike story
  swipeDown(event: any): any {
    console.log('Swipe Down', event);
    this.rankStory(0);

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="http://social-app.muskowl.com/assets/images/ranking/dislike.png" height="400">`,
      cssClass: 'my-loading-water',
      duration: 1000
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();
  }

  //rank story
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

              // let toast = this.toastCtrl.create({
              //   message: element.text,
              //   duration: 3000,
              //   position: 'bottom'
              // });

              // toast.present();
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

  }

  //save story
  saveStory() {
    this.loadingProvider.present();
    console.log('clicked to save story');
    var data = {
      'user_id': this.user_id,
      'story_id': this.story_id,
    };
    console.log('this.user_id' + this.user_id);

    this.storyService.saveStory(data).subscribe(
      response => {

        this.responseData = response;
        this.status = this.responseData.status;
        if (!this.status) {
          this.alertProvider.title = this.already_saved;
          if (this.responseData.result) {
            this.responseData.result.forEach(element => {
              if (element.id == 'story_id') {
                this.alertProvider.message = element.text;
              }
            });
          }
        }
        else {
          this.alertProvider.title = this.saved;
          this.alertProvider.message = this.story_saved;
        }
        this.loadingProvider.dismiss();

        this.alertProvider.showAlert();
      },
      err => {
        console.error(err);
        this.loadingProvider.dismiss();
      }
    );
  }
}
