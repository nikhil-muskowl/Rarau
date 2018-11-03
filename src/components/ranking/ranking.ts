import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { AlertProvider } from '../../providers/alert/alert';
import { OthersProfilePage } from '../../pages/AccountModule/others-profile/others-profile';
import { SingleStoryPage } from '../../pages/story/single-story/single-story';
import { StoryServiceProvider } from '../../providers/story-service/story-service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../providers/language/language';
import { LoginProvider } from '../../providers/login/login';

@Component({
  selector: 'ranking',
  templateUrl: 'ranking.html'
})
export class RankingComponent {
  @Input('userid') othr_user_id;

  private responseData: any;
  private id;
  private items;
  private types;
  private story_type_id = 0;
  private filterData: any;
  private user_id;

  public length = 5;
  public start = 0;

  public rarau;
  public by;
  public from;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public storiesProvider: StoryServiceProvider,
    public alertProvider: AlertProvider,
    public translate: TranslateService,
    public LoginProvider: LoginProvider,
    public languageProvider: LanguageProvider, ) {

    this.setText();
    this.getTypes();
    this.user_id = this.LoginProvider.isLogin();
    console.log(this.story_type_id);
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('from').subscribe((text: string) => {
      this.from = text;
    });
    this.translate.get('by').subscribe((text: string) => {
      this.by = text;
    });
  }

  public typeChanged(event) {
    this.story_type_id = event.id;
    this.getList();
  }

  public getList() {
    this.loadingProvider.present();
    let id;
    if (this.othr_user_id != undefined) {
      id = this.othr_user_id;
    }
    else {
      id = this.user_id;
    }
    console.log('whose profile : ' + id);
    this.filterData = {
      story_type_id: this.story_type_id,
      user_id: id,
      length: this.length,
      start: this.start
    };
    this.storiesProvider.getRankedStory(this.filterData).subscribe(
      response => {
        this.responseData = response;
        this.items = this.responseData.data;
        this.loadingProvider.dismiss();
      },
      err => {
        console.error(err);
        this.loadingProvider.dismiss();
      }
    );
    return event;
  }

  public goToProfile(user_id) {

    this.navCtrl.push(OthersProfilePage, { id: user_id });
  }

  public getTypes() {
    this.loadingProvider.present();
    this.storiesProvider.getCategory().subscribe(
      response => {
        this.responseData = response;
        this.types = this.responseData.data;
        this.story_type_id = this.types[0].id;

        this.getList();
        this.loadingProvider.dismiss();
        console.log('Story types : ' + JSON.stringify(this.types));
        console.log(JSON.stringify(this.types[0].id));
      },
      err => {
        console.error(err);
        this.loadingProvider.dismiss();
      }
    );
    return event;
  }

  public itemTapped(data: any) {
    this.navCtrl.push(SingleStoryPage, { story_id: data.id });
  }
}