import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { StoryScreenPage } from '../story-screen/story-screen';
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {

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

    this.translate.get('story').subscribe((text: string) => {
      this.title = text;
    });
    this.translate.get('forbidden').subscribe((text: string) => {
      this.forbidden = text;
    });
    this.translate.get('login_to_continue').subscribe((text: string) => {
      this.login_to_continue = text;
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
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  showStory(data) {
    if (this.user_id) {
      // this.navCtrl.push(StoryScreenPage, { story_id: data.id });
      this.navCtrl.push(StoryScreenPage, this.paramData);
    }
    else {

      this.alertProvider.title = this.forbidden;
      this.alertProvider.message = this.login_to_continue;
      this.alertProvider.showAlert();
    }
  }

}
