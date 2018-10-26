import { Component } from '@angular/core';
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

@IonicPage()
@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html',
})

export class RankingPage {
  public title;
  public fileterData: any;
  private responseData: any;
  private id;
  private items;
  public isSearch:boolean=false;
  private types;
  private story_type_id = 0;
  private filterData: any;
  public search = '';
  public locName = '';
  public latitude: number = 0;
  public longitude: number = 0;
  public data: any;
  public locations: any;

  public length = 5;
  public start = 0;

  public rarau;
  public by;
  public from;
  public location_txt;
  public enter_value_serach;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public baiduProvider: BaiduProvider,
    public storiesProvider: StoryServiceProvider,
    public alertProvider: AlertProvider,
    public locationTrackerProvider: LocationTrackerProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {
      this.isSearch =false;

    this.setText();
    this.getTypes();

    console.log(this.story_type_id);
  }

  openSearch(){
    this.isSearch = !this.isSearch;
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
  }

  public onInput(ev: any) {
    this.search = ev.target.value;
    this.locations = [];
    this.getLocation();
  }

  public onCancel(ev: any) {
    this.search = '';
  }

  public getLocation() {

    this.fileterData = {
      query: this.search,
      location: `${this.latitude},${this.longitude}`
    };

    this.baiduProvider.location(this.fileterData).subscribe(
      response => {
        console.log(response);
        this.responseData = response;
        this.locations = this.responseData.results;
      },
      err => { console.error(err); }
    );
    console.log(this.locations);
  }

  public itemSelected(location: any) {
    console.log(location);
    if (location) {
      this.search = location.name;
      this.locName = location.name;
      this.latitude = location.location.lat;
      this.longitude = location.location.lng;

      this.getList();
    }

    console.log(this.latitude);
    console.log(this.longitude);
    this.locations = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RankingPage');
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
      latitude: this.latitude,
      longitude: this.longitude,
      distance: 10,
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
}
