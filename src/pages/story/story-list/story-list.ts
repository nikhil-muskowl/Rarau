import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { StoryScreenPage } from '../story-screen/story-screen';
import { SingleStoryPage } from '../single-story/single-story';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-story-list',
  templateUrl: 'story-list.html',
})
export class StoryListPage {

  public user_id;
  public paramData;
  public data;
  private responseData;
  private latitude;
  private longitude;
  public searchCat;
  public searchUse;

  title;
  private forbidden;
  private login_to_continue;
  private lvl_txt;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {

    platform.registerBackButtonAction(() => {
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

    this.isLogin();
    this.getStories();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('forbidden').subscribe((text: string) => {
      this.forbidden = text;
    });
    this.translate.get('login_to_continue').subscribe((text: string) => {
      this.login_to_continue = text;
    });
    this.translate.get('lvl').subscribe((text: string) => {
      this.lvl_txt = text;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoryListPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  getStories() {
    this.loadingProvider.present();
    this.paramData = {
      'user_id': this.user_id,
      'latitude': this.latitude,
      'longitude': this.longitude,
      'searchCat': this.searchCat,
      'searchUse': this.searchUse,
    };
    console.log('Story list page : ' + JSON.stringify(this.paramData));

    this.storyService.apiTopStory(this.paramData).subscribe(
      response => {
        this.responseData = response;
        this.data = this.responseData.data;
        this.title = this.data[0].title;
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  showStory(data) {
    if (this.user_id) {

      // this.navCtrl.push(StoryScreenPage, this.paramData);
      this.navCtrl.push(SingleStoryPage, { story_id: data.id });

    }
    else {

      this.alertProvider.title = this.forbidden;
      this.alertProvider.message = this.login_to_continue;
      this.alertProvider.showAlert();
    }
  }

}
