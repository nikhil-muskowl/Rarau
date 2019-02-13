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
import { NetworkProvider } from '../../providers/network/network';

@Component({
  selector: 'ranking',
  templateUrl: 'ranking.html'
})
export class RankingComponent {
  @Input('userid') othr_user_id;

  private responseData: any;
  private recordsTotal: any;
  private rankItems: any = [];
  private id;
  private language_id;
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
    public network: NetworkProvider,
    public loadingProvider: LoadingProvider,
    public storiesProvider: StoryServiceProvider,
    public alertProvider: AlertProvider,
    public translate: TranslateService,
    public LoginProvider: LoginProvider,
    public languageProvider: LanguageProvider, ) {

    this.setText();
    this.user_id = this.LoginProvider.isLogin();
    console.log(this.story_type_id);
    this.language_id = this.languageProvider.getLanguageId();

    if (this.network.checkStatus() == true) {
      this.getTypes();
    }
  }

  //setting text according to language
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

  //on category change
  public typeChanged(event) {
    this.story_type_id = event.id;
    this.rankItems = [];
    this.start = 0;
    this.getList();
  }

  //getting ranking list
  public getList() {
    this.language_id = this.languageProvider.getLanguageId();
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
      language_id: this.language_id,
      length: this.length,
      start: this.start
    };

    this.storiesProvider.getProfileStoriesRank(this.filterData).subscribe(
      response => {
        this.responseData = response;
        this.items = this.responseData.data;
        console.log("Here" + JSON.stringify(this.items));
        this.recordsTotal = this.responseData.recordsTotal;
        this.bindUpdata();
        this.loadingProvider.dismiss();
      },
      err => {
        console.error(err);
        this.loadingProvider.dismiss();
      }
    );
    return event;
  }

  //bind data OnScroll
  bindUpdata() {

    for (let i = 0; i < this.items.length; i++) {
      this.rankItems.push({
        id: this.items[i].id,
        title: this.items[i].title,
        description: this.items[i].description,
        rank: this.items[i].rank,
        rank_image: this.items[i].rank_image,
        user_id: this.items[i].user_id,
        user_name: this.items[i].user_name,
        user_level: this.items[i].user_level,
        user_image: this.items[i].user_image,
        user_image_thumb: this.items[i].user_image_thumb,
        image: this.items[i].image,
        image_thumb: this.items[i].image_thumb,
        banner: this.items[i].banner,
        banner_thumb: this.items[i].banner_thumb,
        tags: this.items[i].tags,
        categories: this.items[i].categories,
        latitude: this.items[i].latitude,
        longitude: this.items[i].longitude,
        location: this.items[i].location,
        distance: this.items[i].distance,
        totalLikes: this.items[i].totalLikes,
        totalDislikes: this.items[i].totalDislikes,
        totalFlames: this.items[i].totalFlames,
        status: this.items[i].status,
        created_date: this.items[i].created_date,
        modified_date: this.items[i].modified_date
      });
    }
  }

  //for user profile
  public goToProfile(user_id) {

    // this.navCtrl.push(OthersProfilePage, { id: user_id });
  }

  //get Ranking categories
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

  //On ranking item click 
  public itemTapped(data: any) {
    this.navCtrl.push(SingleStoryPage, { story_id: data.id });
  }

  //load more on Scroll Down 
  onScrollDown(infiniteScroll) {

    console.log(this.start);

    if (this.start <= this.recordsTotal) {
      this.start += this.length;
      this.getList();
    }

    infiniteScroll.complete();
  }
}