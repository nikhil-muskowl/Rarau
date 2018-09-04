import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { ToastProvider } from '../../../providers/toast/toast';
import { LoginPage } from '../../AccountModule/login/login';
import { UpdatePasswordPage } from '../../AccountModule/update-password/update-password';
import { EditProfilePage } from '../../MainModule/edit-profile/edit-profile'
import { FollowersPage } from '../../FollowModule/followers/followers'
import { ProfilePhotoPage } from '../profile-photo/profile-photo'

//provider
import { LoadingProvider } from '../../../providers/loading/loading';
import { ProfileProvider } from '../../../providers/profile/profile';

//component
import { StoryComponent } from '../../../components/story/story';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {

  public title = 'Profile';
  public name;
  public email;
  public user_id;
  public result;
  public responseData;
  public userImage = 'assets/imgs/forgotPassword/user.png';

  public following;
  public followers;
  public flames;
  private user: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LoginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public toast: ToastProvider,
    public loadingProvider: LoadingProvider,
    public profileProvider: ProfileProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter() {
    this.isLogin();
    this.user = 'Stories';
  }

  isLogin() {

    this.user_id = this.LoginProvider.isLogin();
    console.log('userId', this.user_id);
    if (!this.user_id) {
      this.navCtrl.setRoot(LoginPage);
    }
    else {
      this.getProfileData(this.user_id);
    }
  }

  getProfileData(user_id) {

    console.log('user : ' + this.user_id);
    this.loadingProvider.present();
    this.profileProvider.apigetMyProfile(user_id).subscribe(
      response => {

        this.responseData = response;
        this.result = this.responseData.result;
        console.log(response);

        this.name = this.result.name;
        this.email = this.result.email;
        this.userImage = this.result.image_thumb;
        this.following = this.result.total_following;
        this.followers = this.result.total_followers;
        this.flames = this.result.total_flames;
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  logout() {

    this.alertProvider.Alert.confirm('Are you sure you want to logout?', 'Logout').then((res) => {
      console.log('confirmed');

      this.LoginProvider.unSetData();
      this.navCtrl.setRoot(LoginPage);

    }, err => {
      console.log('user cancelled');
    })

  }

  updatePass() {
    this.navCtrl.push(UpdatePasswordPage);
  }

  showFollowers() {
    this.navCtrl.push(FollowersPage);
  }

  editProfile() {

    this.navCtrl.push(EditProfilePage, {
      id: this.user_id,
      name: this.name,
      email: this.email
    });
  }

  changeProfilePhoto() {
    this.navCtrl.push(ProfilePhotoPage, { id: this.user_id, image: this.userImage });
  }
}
