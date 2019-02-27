import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, Modal, ModalController, ModalOptions, IonicPage, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchResultPage } from '../../SearchModule/search-result/search-result';
import { StoryListPage } from '../../story/story-list/story-list';
import { LocationTrackerProvider } from '../../../providers/location-tracker/location-tracker';
import { BaiduProvider } from '../../../providers/baidu/baidu';
import { ControlAnchor, Marker, MapOptions, NavigationControlOptions, NavigationControlType, Point, MapTypeEnum, MarkerOptions } from 'angular2-baidu-map';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { LoginProvider } from '../../../providers/login/login';
import { SearchPage } from '../../SearchModule/search/search';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { Slides } from 'ionic-angular';
import { OthersProfilePage } from '../../AccountModule/others-profile/others-profile';
import { EventListPage } from '../../Events/event-list/event-list';
import { EventsCategoryPage } from '../../Events/events-category/events-category';
import { GalleryPage } from '../../story/gallery/gallery';
import { RankingPage } from '../ranking/ranking';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild(Slides) homeSlides: Slides;
  @ViewChild(Slides) slides: Slides;

  public BdMap;
  public images: Array<any>;
  public latLong;
  public zoomlatLong;
  public locations: any;
  public filterData: any;
  public responseData: any;
  public search = '';
  public latitude;
  public longitude;
  public data: any;

  //for css
  public myLocBtn;
  public isMycurrLoc;

  public Advdata: any;
  public Advres;

  options: MapOptions;
  markers: Array<Marker> = [];
  point: Point;
  navOptions: NavigationControlOptions;

  searchForm: FormGroup;
  private formData: any;
  searchLocation;
  searchUser;
  public paramStryData;
  public paramData;
  public user_id;
  public city_id;
  public language_id;
  public stories: any = [];
  public showStories: boolean = false;
  public markerHtml;

  public categories;
  public categoriesData;

  public searchCat;
  public searchUse;
  public serLatitude;
  public serLongitude;

  public rarau;
  public click_to_search;
  public sorry;
  public no_location;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private view: ViewController,
    private modal: ModalController,
    public alertProvider: AlertProvider,
    public locationTrackerProvider: LocationTrackerProvider,
    public baiduProvider: BaiduProvider,
    public formBuilder: FormBuilder,
    public loadingProvider: LoadingProvider,
    public storyService: StoryServiceProvider,
    public LoginProvider: LoginProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

  }

  //on change initialize
  ngOnInit() {
    this.InitMethods();
  }

  //next header category slide
  homeSlidesNext() {
    this.homeSlides.slideNext();
  }

  //previous header category slide
  homeSlidesPrev() {
    this.homeSlides.slidePrev();
  }

  //init methods for reloading
  InitMethods() {
    // Let's navigate from TabsPage to Page1
    this.user_id = this.LoginProvider.isLogin();
    this.language_id = this.languageProvider.getLanguageId();

    //css for loc button
    this.isMycurrLoc = 0;
    this.myLocBtn = 'myLocBtn';

    this.latitude = this.locationTrackerProvider.getLatitude();
    this.longitude = this.locationTrackerProvider.getLongitude();

    this.city_id = this.baiduProvider.getCity();
    this.showStories = false;

    this.setText();
    this.bindMap();
    this.setCategory();
    this.getAdvertisement();
  }

  //setting category to header slider
  setCategory() {

    this.loadingProvider.present();

    this.storyService.getCategory().subscribe(
      response => {
        this.categoriesData = response;
        this.categories = this.categoriesData.data;
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  //goto user profile page
  gotoUsers(_id) {
    if (_id) {
      this.navCtrl.push(OthersProfilePage, { id: _id, user_id: this.user_id });
    }
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('click_to_search').subscribe((text: string) => {
      this.click_to_search = text;
    });
    this.translate.get('sorry').subscribe((text: string) => {
      this.sorry = text;
    });
    this.translate.get('no_location').subscribe((text: string) => {
      this.no_location = text;
    });
  }

  //open search modal for searching
  openModal() {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = {
      name: 'Nikhil Suwalka',
      occupation: 'Android Developer'
    };

    const myModal: Modal = this.modal.create(SearchPage, { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      console.log("I have dismissed.");
      console.log('data from model : ' + JSON.stringify(data));

      if (data) {
        console.log('data.searchStoryUse : ' + data.searchUse);
        console.log('data.searchLoc : ' + data.searchLoc);
        console.log('data.searchCat : ' + data.searchCat);
        console.log('data.latitude : ' + data.latitude);
        console.log('data.longitude : ' + data.longitude);

        this.serLatitude = data.latitude;
        this.serLongitude = data.longitude;
        this.searchUse = data.searchUse;
        this.searchCat = data.searchCat;
        if (data.searchCat == undefined && data.latitude == undefined && data.longitude == undefined && data.searchUse != undefined) {
          this.navCtrl.push(SearchResultPage, data);
        }
        else {
          this.bindMap();
        }
      }
    });

    myModal.onWillDismiss((data) => {
      console.log("I'm about to dismiss");
      console.log(data);
    });
  }

  //open story upload page
  postStory() {
    this.navCtrl.setRoot(GalleryPage);
  }

  //getting Advertisement data list
  getAdvertisement() {
    this.language_id = this.languageProvider.getLanguageId();
    let param;
    param = {
      'language_id': this.language_id
    };

    this.storyService.apiGetAdvertisment(param)
      .subscribe(response => {

        this.Advres = response;
        this.Advdata = this.Advres.data;

        console.log('Advdata  : ' + JSON.stringify(this.Advres));

        this.loadingProvider.dismiss();
      },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        }
      );
  }

  //call on advert slide change
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == this.Advdata.length) {
      this.slides.stopAutoplay();
    }
  }

  //getting current location as well reload map
  getCurrenLocation() {
    this.locationTrackerProvider.setLocation();

    // if (this.isMycurrLoc == 0) {
    //   this.myLocBtn = 'myLocBtnclicked';
    //   this.isMycurrLoc = 1;
    //   this.bindMap();
    // }
    // else {
    //   this.myLocBtn = 'myLocBtn';
    //   this.isMycurrLoc = 0;
    //   this.searchCat = undefined;
    //   this.searchUse = undefined;
    //   this.serLatitude = undefined;
    //   this.serLongitude = undefined;
    // }

    this.searchCat = undefined;
    this.searchUse = undefined;
    this.serLatitude = undefined;
    this.serLongitude = undefined;
    this.bindMap();
  }

  //bind map with search result or reload
  public bindMap() {
    this.user_id = this.LoginProvider.isLogin();
    this.markers = [];
    console.log("this.serLatitude && this.serLongitude : " + this.serLatitude + ' ' + this.serLongitude);
    if (this.serLatitude != undefined && this.serLongitude != undefined) {
      this.latLong = {
        lat: this.serLatitude,
        lng: this.serLongitude,
        zoom: 17
      }
    }
    else {
      this.latLong = {
        lat: this.latitude,
        lng: this.longitude,
        zoom: 15
      }
    }

    this.options = {
      centerAndZoom: this.latLong,
      enableKeyboard: true,
      mapType: MapTypeEnum.BMAP_NORMAL_MAP
    };

    if (this.serLatitude != undefined && this.serLongitude != undefined) {
      this.paramStryData = {
        'user_id': this.user_id,
        'searchCat': this.searchCat,
        'searchUse': this.searchUse,
        'latitude': this.serLatitude,
        'longitude': this.serLongitude
      };
    }
    else if (this.searchCat != undefined) {
      this.paramStryData = {
        'user_id': this.user_id,
        'searchCat': this.searchCat,
        'searchUse': this.searchUse,
        'latitude': this.latitude,
        'longitude': this.longitude
      };
    }
    else {
      this.paramStryData = {
        'user_id': this.user_id,
        'searchCat': this.searchCat,
        'searchUse': this.searchUse,
        'latitude': this.latitude,
        'longitude': this.longitude
      };
    }

    console.log('bind map paramStryData : ' + JSON.stringify(this.paramStryData));
    this.storyService.apiTopStoryMarker(this.paramStryData).subscribe(
      response => {
        this.responseData = response;

        if (this.responseData.data.length > 0) {
          this.responseData.data.forEach(element => {
            this.markers.push({
              options: {
                // enableDragging: true,
                icon: {
                  imageUrl: element.marker_thumb,
                  size: {
                    height: 50,
                    width: 50
                  },
                  imageSize: {
                    // height: 32,
                    // width: 32
                    height: 50,
                    width: 50
                  }
                }
              },
              point: {
                lat: element.latitude,
                lng: element.longitude
              }
            });

            if (this.serLatitude != undefined && this.serLongitude != undefined) {
              this.zoomlatLong = {
                lat: this.serLatitude,
                lng: this.serLongitude,
                zoom: 17
              }
            }
            else {
              this.zoomlatLong = {
                // lat: element.latitude,
                // lng: element.longitude,
                lat: this.latitude,
                lng: this.longitude,
                zoom: 15
              }
            }

            this.options = {
              centerAndZoom: this.zoomlatLong,
              enableKeyboard: true,
              enableScrollWheelZoom: true,
              enableInertialDragging: true,
              mapType: MapTypeEnum.BMAP_NORMAL_MAP
            };
          });
        }
        else {
          this.alertProvider.title = this.sorry;
          this.alertProvider.message = this.no_location;
          this.alertProvider.showAlert();
        }

        if (this.serLatitude != undefined && this.serLongitude != undefined) {
          this.markers.push({
            options: {
              // enableDragging: true,
              icon: {
                imageUrl: 'assets/imgs/location.png',
                size: {
                  height: 50,
                  width: 50
                },
                imageSize: {
                  height: 50,
                  width: 50
                }
              }
            },
            point: {
              lat: this.serLatitude,
              lng: this.serLongitude
            }
          });
        }
        else {
          this.markers.push({
            options: {
              // enableDragging: true,
              icon: {
                imageUrl: 'assets/imgs/location.png',
                size: {
                  height: 50,
                  width: 50
                },
                imageSize: {
                  height: 50,
                  width: 50
                }
              }
            },
            point: {
              lat: this.latitude,
              lng: this.longitude
            }
          });
        }

        this.loadingProvider.dismiss();

        console.log("this.markers : " + JSON.stringify(this.markers));
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );

    this.navOptions = {
      anchor: ControlAnchor.BMAP_ANCHOR_TOP_RIGHT,
      type: NavigationControlType.BMAP_NAVIGATION_CONTROL_LARGE
    };

  }

  //reset story on click map markers
  public resetStories() {
    this.showStories = false;
    this.stories = [];
  }

  //close the story list on map markers
  closeList() {
    this.showStories = false;
    console.log("Click on close icon");
  }

  //open event page
  openEvents() {
    this.navCtrl.push(EventListPage);
  }

  //Open window panel for that location stories
  public showWindow({ e, marker, map }: any): void {

    this.user_id = this.LoginProvider.isLogin();
    let markerData = JSON.parse(JSON.stringify(marker.getPosition()));
    console.log('Marker position latitude' + JSON.stringify(markerData));
    this.paramData = {
      'user_id': this.user_id,
      'latitude': parseFloat(markerData.lat),
      'longitude': parseFloat(markerData.lng),
      'searchCat': this.searchCat,
      'searchUse': this.searchUse,
      'length': '3',
      'start': '0',
    };
    console.log('markerData.lat ' + parseFloat(markerData.lat) + " markerData.lng " + parseFloat(markerData.lng));
    this.loadingProvider.show();
    this.storyService.apiTopStory(this.paramData).subscribe(
      response => {
        this.responseData = response;
        this.stories = this.responseData.data;

        if (this.stories.length > 0) {
          this.showStories = true;
        }
        this.loadingProvider.hide();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.hide();
      }
    );
    this.loadingProvider.hide();
  }

  //for loading baidu map
  loadMap(map: any) {
    console.log('map instance here', map);
    this.BdMap = map;
    var cntr = this.BdMap.getCenter();
    console.log('map center here', JSON.stringify(cntr));
  }

  //event page
  gotoEvents(story_type_id) {
    this.navCtrl.push(EventsCategoryPage, { story_type_id: story_type_id });
  }

  //openRanks
  gotoRanks(story_type_id) {
    this.navCtrl.push(RankingPage);
  }

  //on click on marker
  clickMarker(marker: any) {
    console.log(`The clicked marker is: ${marker}`);
  }

  // on click on location and get lat lng
  clickmap(e: any) {
    // this.latitude = e.point.lat;
    // this.longitude = e.point.lng;
    console.log(`Map clicked with coordinate: ${e.point.lng}, ${e.point.lat}`);
  }

  //goto list of stories
  goToList() {
    this.showStories = false;
    this.navCtrl.push(StoryListPage, this.paramData);
  }
}