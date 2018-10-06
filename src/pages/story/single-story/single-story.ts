import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { ShowStoryPage } from '../show-story/show-story';
import { ReceiptShowPage } from '../receipt-show/receipt-show';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-single-story',
  templateUrl: 'single-story.html',
})
export class SingleStoryPage {

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
  private receipt_private;
  private receipt;
  private tags;
  private comments;
  private totalLikes;
  private totalDislikes;
  private totalFlames;
  private created_date;

  private story;
  private rarau;
  private emoji;
  private swipe_comment;
  private already_saved;
  private saved;
  private story_saved;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {

    this.setText();
    this.story_id = this.navParams.get('story_id');
    console.log('story_id : ' + this.story_id);
    this.isLogin();
    this.getStories();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('story').subscribe((text: string) => {
      this.story = text;
    });
    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('emoji').subscribe((text: string) => {
      this.emoji = text;
    });
    this.translate.get('swipe_comment').subscribe((text: string) => {
      this.swipe_comment = text;
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleStoryPage');
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
        this.title = this.responseData.result[0].title;
        this.description = this.responseData.result[0].description;
        this.user_name = this.responseData.result[0].user_name;
        this.user_image = this.responseData.result[0].user_image;
        this.html = this.responseData.result[0].html;
        this.image = this.responseData.result[0].image;
        this.tags = this.responseData.result[0].tags;
        this.receipt_private = this.responseData.result[0].receipt_private;
        console.log('receipt_private : ' + this.receipt_private);
        this.receipt = this.responseData.result[0].receipt;
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

  showReceipt() {

    this.navCtrl.push(ReceiptShowPage, { receipt: this.receipt });
  }

  goToComments(event: any): any {
    console.log('Swipe comment', event);
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

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="http://social-app.muskowl.com/upload/fire.png" height="400">`,
      cssClass: 'my-loading-fire',
      duration: 1000
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();
  }

  swipeDown(event: any): any {
    console.log('Swipe Down', event);
    this.rankStory(0);

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="http://social-app.muskowl.com/upload/water.png" height="400">`,
      cssClass: 'my-loading-water',
      duration: 1000
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();
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

  }

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
