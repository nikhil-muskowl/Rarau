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
  private id;
  private items;
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

  ngOnInit() {
    this.content.resize();
    this.setText();
    this.getTypes();
    this.getCountry();
    this.location = undefined;
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
    this.story_type_id = event.id;
    this.getList();
  }

  public getList() {
    this.loadingProvider.present();
    this.filterData = {
      story_type_id: this.story_type_id,
      length: this.length,
      start: this.start,
      location: this.location,
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
