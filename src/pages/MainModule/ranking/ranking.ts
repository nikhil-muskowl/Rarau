import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { BaiduProvider } from '../../../providers/baidu/baidu';
import { LocationTrackerProvider } from '../../../providers/location-tracker/location-tracker';
import { OthersProfilePage } from '../../AccountModule/others-profile/others-profile';
import { SingleStoryPage } from '../../story/single-story/single-story';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { ThrowStmt } from '@angular/compiler';

@IonicPage()
@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html',
})

export class RankingPage {
  @ViewChild(Content) content: Content;

  public title;
  public fileterData: any;
  private responseData: any;
  private recordsTotal: any;
  private rankItems: any = [];

  private id;
  private items;
  public language_id;
  public isSearch: boolean = false;
  private types;
  private story_type_id = 0;
  private filterData: any;
  public search = '';
  public locName = '';
  public country;
  public data: any;
  public cntryresponseData;
  public countries;
  public location: any;


  public length = 5;
  public start = 0;

  public rarau;
  public by;
  public from;
  public location_txt;
  public enter_value_serach;
  public search_country;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public baiduProvider: BaiduProvider,
    public storiesProvider: StoryServiceProvider,
    public alertProvider: AlertProvider,
    public locationTrackerProvider: LocationTrackerProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.isSearch = false;
  }

  ionViewWillEnter() {
    this.content.resize();
    this.setText();
    this.getTypes();
    this.getCountry();
    this.rankItems = [];
    this.location = undefined;
    this.language_id = this.languageProvider.getLanguageId();
    console.log(this.story_type_id);
  }

  openSearch() {
    this.isSearch = !this.isSearch;
    if (this.isSearch) {
      this.country = '';
      this.location = '';
      this.countries = [];
    }
    console.log("this.isSearch : " + this.isSearch);
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('ranking').subscribe((text: string) => {
      this.title = text;
    });
    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('from').subscribe((text: string) => {
      this.from = text;
    });
    this.translate.get('by').subscribe((text: string) => {
      this.by = text;
    });
    this.translate.get('enter_value_serach').subscribe((text: string) => {
      this.enter_value_serach = text;
    });
    this.translate.get('location').subscribe((text: string) => {
      this.location_txt = text;
    });
    this.translate.get('search_country').subscribe((text: string) => {
      this.search_country = text;
    });
  }

  getCountry() {

    this.storiesProvider.apiGetAllLocations(this.country).subscribe(
      response => {
        this.cntryresponseData = response;
        this.countries = this.cntryresponseData.data;
      },
      err => {
        console.error(err);
      }
    );
  }

  public onCancel(ev: any) {
    this.search = '';
  }

  public typeChanged(event) {
    this.rankItems = [];
    this.start = 0;
    this.story_type_id = event.id;
    this.getList();
  }

  public getList() {
    this.language_id = this.languageProvider.getLanguageId();
    this.loadingProvider.present();
    this.filterData = {
      story_type_id: this.story_type_id,
      length: this.length,
      start: this.start,
      language_id: this.language_id,
      location: this.location,
    };
    this.storiesProvider.getRankedStory(this.filterData).subscribe(
      response => {
        this.responseData = response;
        this.items = this.responseData.data;
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

  onScrollDown(infiniteScroll) {

    console.log(this.start);

    if (this.start <= this.recordsTotal) {
      this.start += this.length;
      this.getList();
    }

    infiniteScroll.complete();
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

  public onLocCancel(ev: any) {
    this.country = '';
  }

  public onLocInput(ev: any) {
    if (ev.target.value != "" || ev.target.value != undefined) {
      this.country = ev.target.value;
      this.countries = [];
      this.getCountry();
    }
  }

  public locItemSelected(location: any) {
    console.log(location);
    if (location) {
      this.country = location.location;
      this.location = location.location;
    }
    this.countries = [];
    this.getList();
  }
}
