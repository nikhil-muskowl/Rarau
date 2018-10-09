import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { ToastProvider } from '../../../providers/toast/toast';
import { LoginPage } from '../../AccountModule/login/login';
import { UpdatePasswordPage } from '../../AccountModule/update-password/update-password';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { SettingsPage } from '../settings/settings';
import { FollowersPage } from '../../FollowModule/followers/followers';
import { ProfilePhotoPage } from '../profile-photo/profile-photo';
import { SavedStoriesPage } from '../../story/saved-stories/saved-stories';

//provider
import { LoadingProvider } from '../../../providers/loading/loading';
import { ProfileProvider } from '../../../providers/profile/profile';

//component
import { StoryComponent } from '../../../components/story/story';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {

  public title;
  public name;
  public email;
  public user_id;
  public id;
  public result;
  public responseData;
  public userImage = 'assets/imgs/forgotPassword/user.png';

  public following;
  public followers;
  public flames;
  public followed;
  private user: string;
  public status;

  public my_profile;
  public rarau;
  public followers_txt;
  public flames_txt;
  public stories;
  public ranking;
  public my_pet;
  public view_log;
  public saved_stories;
  public more;
  public sure_logout;
  public logout_txt;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LoginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public toast: ToastProvider,
    public loadingProvider: LoadingProvider,
    public profileProvider: ProfileProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {


  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    console.log("getLanguage() : " + this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('profile').subscribe((text: string) => {
      this.title = text;
    });
    this.translate.get('my_profile').subscribe((text: string) => {
      this.my_profile = text;
    });
    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('followers').subscribe((text: string) => {
      this.followers_txt = text;
    });
    this.translate.get('flames').subscribe((text: string) => {
      this.flames_txt = text;
    });
    this.translate.get('stories').subscribe((text: string) => {
      this.stories = text;
    });
    this.translate.get('ranking').subscribe((text: string) => {
      this.ranking = text;
    });
    this.translate.get('my_pet').subscribe((text: string) => {
      this.my_pet = text;
    });
    this.translate.get('view_log').subscribe((text: string) => {
      this.view_log = text;
    });
    this.translate.get('saved_stories').subscribe((text: string) => {
      this.saved_stories = text;
    });
    this.translate.get('more').subscribe((text: string) => {
      this.more = text;
    });
    this.translate.get('sure_logout').subscribe((text: string) => {
      this.sure_logout = text;
    });
    this.translate.get('logout').subscribe((text: string) => {
      this.logout_txt = text;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter() {
    this.setText();
    this.isLogin();
    this.user = 'Stories';
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
    if (!this.user_id) {
      this.navCtrl.setRoot(LoginPage);
    } else {
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
    this.alertProvider.Alert.confirm(this.sure_logout, this.logout_txt).then((res) => {
      console.log('confirmed');
      this.LoginProvider.unSetData();
      this.navCtrl.setRoot(LoginPage);
    }, err => {
      console.log('user cancelled');
    });
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

  savedStories() {
    this.navCtrl.push(SavedStoriesPage);
  }

  goSetting() {
    this.navCtrl.push(SettingsPage);
  }
}
