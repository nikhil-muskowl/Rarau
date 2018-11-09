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
import { TutorialPage } from '../tutorial/tutorial';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild(Slides) slides: Slides;
  @ViewChild('map') mapElement: ElementRef;

  public title = 'Home';
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
  public language_id;
  public stories: any;
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

    // this.images = [
    //   { categoryFirst: 'assets/icon/Front-Icons/food.png', text: '8', categoryPerson: 'assets/icon/user.png' },
    //   { categoryFirst: 'assets/icon/Front-Icons/VectorSmartObject.png', text: '5', categoryPerson: 'assets/icon/user.png' },
    //   { categoryFirst: 'assets/icon/Front-Icons/world.png', text: '7', categoryPerson: 'assets/icon/user.png' },
    //   { categoryFirst: 'assets/icon/Front-Icons/VectorSmartObject.png', text: '2', categoryPerson: 'assets/icon/user.png' },
    // ]
  }

  ngOnInit() {
    // Let's navigate from TabsPage to Page1
    this.user_id = this.LoginProvider.isLogin();
    this.language_id = this.languageProvider.getLanguageId();

    //uncommnet below for HK testing 
    // this.latitude = this.locationTrackerProvider.getLatitude();
    // this.longitude = this.locationTrackerProvider.getLongitude();

    //uncommnet below for India testing 
    this.latitude = 39.919981;
    this.longitude = 116.414977;
    // console.log('this.locationTracker.getLatitude : ' + this.locationTracker.getLatitude());
    // console.log('this.locationTracker.getLongitude : ' + this.locationTracker.getLongitude());

    this.showStories = false;

    this.setText();
    this.bindMap();
    this.setCategory();
    this.getLocation();
    this.getAdvertisement();
  }

  setCategory() {

    this.loadingProvider.present();

    this.storyService.getCategory().subscribe(
      response => {
        this.categoriesData = response;
        console.log('Category : ' + JSON.stringify(response));

        this.categories = this.categoriesData.data;
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

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

        this.serLatitude = data.searcLatitude;
        this.serLongitude = data.searcLongitude;
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

  getAdvertisement() {

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

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == this.Advdata.length) {
      this.slides.stopAutoplay();
    }
  }

  public bindMap() {
    this.markers = [];

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
        // 'latitude': this.latitude,
        // 'longitude': this.longitude
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
          console.log('responseData.data : ' + JSON.stringify(this.responseData.data));
          this.responseData.data.forEach(element => {
            this.markers.push({
              options: {
                // enableDragging: true,
                icon: {
                  imageUrl: element.marker_thumb,
                  size: {
                    height: 32,
                    width: 32
                  },
                  imageSize: {
                    height: 32,
                    width: 32
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
                lat: element.latitude,
                lng: element.longitude,
                zoom: 15
              }
            }

            this.options = {
              centerAndZoom: this.zoomlatLong,
              enableKeyboard: true,
              mapType: MapTypeEnum.BMAP_NORMAL_MAP
            };
          });
        }
        else {
          this.alertProvider.title = this.sorry;
          this.alertProvider.message = this.no_location;
          this.alertProvider.showAlert();
        }
        this.loadingProvider.dismiss();
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

  public resetStories() {
    this.showStories = false;
    this.stories = [];
  }

  closeList() {
    this.showStories = false;
    console.log("Click on close icon");
  }

  openTutorial() {
    this.navCtrl.setRoot(TutorialPage);
  }

  public getLocation() {

    this.filterData = {
      query: this.search,
      location: `${this.latitude},${this.longitude}`
    };

    this.baiduProvider.location(this.filterData).subscribe(
      response => {
        this.responseData = response;
        this.locations = this.responseData.results;
      },
      err => { console.error(err); }
    );
    console.log(this.locations);
  }

  public showWindow({ e, marker, map }: any): void {
    // var Param = {
    //   marker: JSON.stringify(marker.getPosition())
    // }    
    this.showStories = true;
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
        this.loadingProvider.hide();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.hide();
      }
    );
    this.loadingProvider.hide();
  }

  loadMap(map: any) {
    console.log('map instance here', map);
  }

  clickMarker(marker: any) {
    console.log(`The clicked marker is: ${marker}`);
  }

  clickmap(e: any) {
    // this.latitude = e.point.lat;
    // this.longitude = e.point.lng;
    console.log(`Map clicked with coordinate: ${e.point.lng}, ${e.point.lat}`);
  }

  goToList() {
    this.showStories = false;
    this.navCtrl.push(StoryListPage, this.paramData);
  }
}
