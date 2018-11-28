import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, LoadingController } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { ShowStoryPage } from '../show-story/show-story';
import { ReceiptShowPage } from '../receipt-show/receipt-show';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { ReportPage } from '../../Popover/report/report';
import { LoginPage } from '../../AccountModule/login/login';

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
  private language_id;
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
  private forbidden;
  private login_to_continue;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.setText();
    this.language_id = this.languageProvider.getLanguageId();
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
    this.translate.get('forbidden').subscribe((text: string) => {
      this.forbidden = text;
    });
    this.translate.get('login_to_continue').subscribe((text: string) => {
      this.login_to_continue = text;
    });
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
      'language_id': this.language_id,
    };

    this.storyService.getStoryDetail(this.paramData).subscribe(
      response => {

        this.responseData = response;

        this.data = this.responseData.result;
        this.responseData.result[0].totalDislikes;
        this.id = this.responseData.result[0].id;
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
        // this.comments = this.responseData.result[0].comments;
        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  reportStory() {
    console.log('Report user');
    console.log('Swipe comment', event);
    this.isLogin();

    if (this.user_id) {
      let params = {
        'story_id': this.id,
        'type': 2
      };

      this.navCtrl.push(ReportPage, params);
    } else {

      this.loginAlert();
    }
  }

  showReceipt() {
    this.navCtrl.push(ReceiptShowPage, { receipt: this.receipt });
  }

  goToComments(event: any): any {
    console.log('Swipe comment', event);
    this.isLogin();

    if (this.user_id) {
      this.navCtrl.push(ShowStoryPage, { story_id: this.story_id });
    } else {
      this.loginAlert();
    }
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
    this.isLogin();

    if (this.user_id) {

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
    } else {
      this.loginAlert();
    }
  }

  swipeDown(event: any): any {
    console.log('Swipe Down', event);

    this.isLogin();

    if (this.user_id) {

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
    } else {
      this.loginAlert();
    }
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
            this.totalFlames++;

          } else {
            this.totalDislikes++;
            this.totalFlames--;
          }
          console.log("this.totalLikes : " + this.totalLikes);
          console.log("this.totalDislikes : " + this.totalDislikes);

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

  saveStory() {

    this.isLogin();

    if (this.user_id) {

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
    } else {
     this.loginAlert();
    }
  }

  loginAlert() {
    this.alertProvider.title = this.forbidden;
    this.alertProvider.message = this.login_to_continue;
    // this.alertProvider.showAlert();
    this.alertProvider.Alert.confirm(this.login_to_continue, this.forbidden).then((res) => {
      console.log('confirmed');
      this.navCtrl.setRoot(LoginPage);
    }, err => {
      console.log('user cancelled');
    });
  }
}
