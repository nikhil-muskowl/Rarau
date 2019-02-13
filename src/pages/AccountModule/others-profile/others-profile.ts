import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ProfileProvider } from '../../../providers/profile/profile';
import { LoginProvider } from '../../../providers/login/login';
import { FollowProvider } from '../../../providers/follow/follow';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { ReportPage } from '../../Popover/report/report';
import { LoginPage } from '../login/login';
import { NetworkProvider } from '../../../providers/network/network';

@IonicPage()
@Component({
  selector: 'page-others-profile',
  templateUrl: 'others-profile.html',
})
export class OthersProfilePage {

  public title = 'Profile';
  public user;
  public user_id;
  public id;
  public name;
  public email;
  public contact;
  public status;
  public report_user;

  public responseData;
  public result;

  public userImage;
  public following;
  public followers;
  public flames;
  public followed;

  public followers_txt;
  public flames_txt;
  public following_txt;
  public follow_txt;
  public push;
  public view_activity_log;
  public stories;
  public ranking;
  private rarau;
  private forbidden;
  private login_to_continue;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public alertProvider: AlertProvider,
    public profileProvider: ProfileProvider,
    public LoginProvider: LoginProvider,
    public platform: Platform,
    public network: NetworkProvider,
    public FollowProvider: FollowProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.setText();
    this.user = 'Stories';
    this.isLogin();
    console.log('curruserId : ' + this.user_id);

    this.id = navParams.get('id');
    console.log('userId : ' + this.id);
    if (this.network.checkStatus() == true) {
      this.getProfile(this.id);
    }
    else {
      this.network.displayNetworkUpdate();
    }
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('followers').subscribe((text: string) => {
      this.followers_txt = text;
    });
    this.translate.get('report_user').subscribe((text: string) => {
      this.report_user = text;
    });
    this.translate.get('flames').subscribe((text: string) => {
      this.flames_txt = text;
    });
    this.translate.get('following').subscribe((text: string) => {
      this.following_txt = text;
    });
    this.translate.get('follow').subscribe((text: string) => {
      this.follow_txt = text;
    });
    this.translate.get('push').subscribe((text: string) => {
      this.push = text;
    });
    this.translate.get('view_activity_log').subscribe((text: string) => {
      this.view_activity_log = text;
    });
    this.translate.get('stories').subscribe((text: string) => {
      this.stories = text;
    });
    this.translate.get('ranking').subscribe((text: string) => {
      this.ranking = text;
    });
    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('forbidden').subscribe((text: string) => {
      this.forbidden = text;
    });
    this.translate.get('login_to_continue').subscribe((text: string) => {
      this.login_to_continue = text;
    });
  }

  //get Profile data
  getProfile(id) {
    console.log('this.user_id : ' + this.user_id);

    this.loadingProvider.present();

    this.profileProvider.apigetProfile(id, this.user_id).subscribe(
      response => {

        this.responseData = response;
        if (this.responseData.status) {
          this.result = this.responseData.result;
          console.log('result : ' + JSON.stringify(this.result));
          this.name = this.result.name;
          this.email = this.result.email;
          this.userImage = this.result.image_thumb;
          this.following = this.result.total_following;
          this.followers = this.result.total_followers;
          this.flames = this.result.total_flames;
          this.followed = this.result.followed;
          console.log('followed : ' + this.followed);
        }
      },
      err => {
        console.error(err);
        this.loadingProvider.dismiss();
      },
      () => {
        this.loadingProvider.dismiss();
      }
    );

  }

  //goto Previous page
  goBack() {
    this.navCtrl.pop();
  }

  //checking is user is login or not
  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  //to report user's story
  reportStory() {
    console.log('Report user');
    this.isLogin();
    if (this.user_id) {
      let params = {
        'user_id': this.id,
        'type': 1
      };

      this.navCtrl.push(ReportPage, params);
    } else {
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

  //Follow user
  dofollow() {
    if (this.user_id) {
      if (this.network.checkStatus() == true) {
        this.loadingProvider.present();
        this.FollowProvider.ActionFollow(this.id, this.user_id).subscribe(
          response => {
            this.responseData = response;
            console.log('follow response : ' + JSON.stringify(this.responseData));
            this.status = this.responseData.status;
            if (this.status) {
              // this.alertProvider.title = 'Success';
              // this.alertProvider.message = 'Follow Request Sent';
              // this.alertProvider.showAlert();

              this.followed = true;
            }
          },
          err => console.error(err),
          () => {
            this.loadingProvider.dismiss();
          }
        );
        this.loadingProvider.dismiss();
      }
      else {
        this.network.displayNetworkUpdate();
      }
    } else {
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

  //UnFollow user
  doUnFollow() {
    if (this.user_id) {
      if (this.network.checkStatus() == true) {
        this.loadingProvider.present();

        this.FollowProvider.ActionUnFollow(this.id, this.user_id).subscribe(
          response => {
            this.responseData = response;
            console.log('unfollow response : ' + JSON.stringify(this.responseData));

            this.status = this.responseData.status;
            if (this.status) {
              // this.alertProvider.title = 'Success';
              // this.alertProvider.message = 'Follow Request Sent';
              // this.alertProvider.showAlert();
              this.followed = false;
            }
          },
          err => console.error(err),
          () => {
            this.loadingProvider.dismiss();
          }
        );
        this.loadingProvider.dismiss();
      }
      else {
        this.network.displayNetworkUpdate();
      }
    } else {
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
}
