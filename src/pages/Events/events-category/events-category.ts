import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Slides } from 'ionic-angular';

//provider
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { EventProvider } from '../../../providers/event/event';
import { NetworkProvider } from '../../../providers/network/network';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { GalleryPage } from '../../story/gallery/gallery';

@IonicPage()
@Component({
  selector: 'page-events-category',
  templateUrl: 'events-category.html',
})
export class EventsCategoryPage {
  @ViewChild(Slides) rankSlides: Slides;

  public event;
  public user_id;
  public language_id;

  public filterData: any;
  private responseData: any;
  private recordsTotal: any;
  private rankItems: any = [];
  private items;

  public length = 5;
  public start = 0;

  public story_type_id;

  //text
  public add_story;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public platform: Platform,
    public storiesProvider: StoryServiceProvider,
    public network: NetworkProvider,
    public eventProvider: EventProvider,
    public languageProvider: LanguageProvider, ) {

    this.story_type_id = this.navParams.get('story_type_id');

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });
    this.language_id = this.languageProvider.getLanguageId();
    this.user_id = this.loginProvider.isLogin();
    this.setText();
    this.getList();
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('event').subscribe((text: string) => {
      this.event = text;
    });
    this.translate.get('add_story').subscribe((text: string) => {
      this.add_story = text;
    });
  }

  //goto previous page
  goBack() {
    this.navCtrl.pop();
  }

  //get list of stories of selected category
  public getList() {
    this.language_id = this.languageProvider.getLanguageId();
    if (this.network.checkStatus() == true) {
      this.loadingProvider.present();
      this.filterData = {
        story_type_id: this.story_type_id,
        length: this.length,
        start: this.start,
        language_id: this.language_id,
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
    }
    else {
      this.network.displayNetworkUpdate();
    }
  }

  //bind list of load more data
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

  //on scroll load more data
  onScrollDown(infiniteScroll) {

    console.log(this.start);
    this.start += this.length;
    if (this.start <= this.recordsTotal) {
      // this.start += this.length;
      this.getList();
    }
    infiniteScroll.complete();
  }

  //onsilde change
  slideChanged() {
    let currentIndex = this.rankSlides.getActiveIndex();
    let totals = currentIndex + 2;
    console.log("Current index is", currentIndex);
    if (totals == this.rankItems.length) {
      console.log("totals index is", totals);
      this.start += this.length;
      if (this.start <= this.recordsTotal) {
        // this.start += this.length;
        this.getList();
      }
    }
  }

  //goto add story page
  AddStory() {
    this.navCtrl.push(GalleryPage, { story_type_id: this.story_type_id });
  }
}
