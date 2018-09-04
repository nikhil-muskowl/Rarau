import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ProfileProvider } from '../../../providers/profile/profile';
import { LoginProvider } from '../../../providers/login/login';
import { FollowProvider } from '../../../providers/follow/follow';

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

  public responseData;
  public result;

  public userImage;
  public following;
  public followers;
  public flames;
  public followed;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public alertProvider: AlertProvider,
    public profileProvider: ProfileProvider,
    public LoginProvider: LoginProvider,
    public FollowProvider: FollowProvider) {

    this.user = 'Stories';
    this.isLogin();
    console.log('curruserId : ' + this.user_id);
    this.id = navParams.get('id');
    this.getProfile(this.id);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

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

  goBack() {
    this.navCtrl.pop();
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  dofollow() {
    this.loadingProvider.present();

    this.FollowProvider.ActionFollow(this.id, this.user_id).subscribe(
      response => {
        this.responseData = response;

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
  }

  doUnFollow() {
    this.loadingProvider.present();

    this.FollowProvider.ActionUnFollow(this.id, this.user_id).subscribe(
      response => {
        this.responseData = response;

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
  }
}
