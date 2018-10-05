import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, PopoverController, Popover } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchResultPage } from '../../SearchModule/search-result/search-result';
import { ProfilePage } from '../profile/profile';
import { StoryTopListPage } from '../../story/story-top-list/story-top-list';
import { StoryListPage } from '../../story/story-list/story-list';
import { LocationTrackerProvider } from '../../../providers/location-tracker/location-tracker';
import { BaiduProvider } from '../../../providers/baidu/baidu';
import { ControlAnchor, Marker, MapOptions, NavigationControlOptions, NavigationControlType, Point, MapTypeEnum, MarkerOptions } from 'angular2-baidu-map';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { LoginProvider } from '../../../providers/login/login';
import { Modal, ModalController, ModalOptions, IonicPage, ViewController } from 'ionic-angular';
import { SearchPage } from '../../SearchModule/search/search';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public title = 'Home';
  public images: Array<any>;
  public popover: Popover;
  public latLong;
  public locations: any;
  public filterData: any;
  public responseData: any;
  public search = '';
  public latitude;
  public longitude;
  public data: any;

  options: MapOptions;
  markers: Array<Marker> = [];
  point: Point;
  navOptions: NavigationControlOptions;

  private error_srcLoc = 'field is required';
  private error_srcUser = 'field is required';

  searchForm: FormGroup;
  private formData: any;
  searchLocation;
  searchUser;
  public paramStryData;
  public paramData;
  public user_id;
  public stories: any;
  public showStories: boolean;
  public markerHtml;

  public searchCat;
  public searchUse;
  public serLatitude;
  public serLongitude;


  @ViewChild('map') mapElement: ElementRef;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private view: ViewController,
    private modal: ModalController,
    public alertProvider: AlertProvider,
    public locationTrackerProvider: LocationTrackerProvider,
    public baiduProvider: BaiduProvider,
    public formBuilder: FormBuilder,
    public popoverCtrl: PopoverController,
    public loadingProvider: LoadingProvider,
    public storyService: StoryServiceProvider,
    public LoginProvider: LoginProvider,
  ) {

    this.user_id = this.LoginProvider.isLogin();
    // this.showStories = true;
    this.latitude = '39.919981';
    this.longitude = '116.414977';


    // this.latitude = this.locationTrackerProvider.getLatitude();
    // this.longitude = this.locationTrackerProvider.getLongitude();

    this.getLocation();
    this.bindMap();

    this.images = [
      { categoryFirst: 'assets/icon/Front-Icons/food.png', text: '8', categoryPerson: 'assets/icon/user.png' },
      { categoryFirst: 'assets/icon/Front-Icons/VectorSmartObject.png', text: '5', categoryPerson: 'assets/icon/user.png' },
      { categoryFirst: 'assets/icon/Front-Icons/world.png', text: '7', categoryPerson: 'assets/icon/user.png' },
      { categoryFirst: 'assets/icon/Front-Icons/VectorSmartObject.png', text: '2', categoryPerson: 'assets/icon/user.png' },
    ]
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

  ionViewDidLoad() {
    this.user_id = this.LoginProvider.isLogin();

    this.latitude = '39.919981';
    this.longitude = '116.414977';

    // this.latitude = this.locationTrackerProvider.getLatitude();
    // this.longitude = this.locationTrackerProvider.getLongitude();

    this.getLocation();
    this.bindMap();
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


    this.paramStryData = {
      'user_id': this.user_id,
      'searchCat': this.searchCat,
      'searchUse': this.searchUse,
      'latitude': this.serLatitude,
      'longitude': this.serLongitude
    };
    console.log('bind map this.user_id : ' + JSON.stringify(this.paramStryData));
    this.storyService.apiTopStoryMarker(this.paramStryData).subscribe(
      response => {
        this.responseData = response;

        if (this.responseData.data.length > 0) {
          this.responseData.data.forEach(element => {
            this.markers.push({
              options: {
                // enableDragging: true,
                icon: {
                  imageUrl: element.marker,
                  size: {
                    height: 50,
                    width: 100
                  },
                  imageSize: {
                    height: 50,
                    width: 100
                  }
                }
              },
              point: {
                lat: element.latitude,
                lng: element.longitude
              }
            });
            this.options = {
              centerAndZoom: {
                lat: element.latitude,
                lng: element.longitude,
                zoom: 15
              },
              enableKeyboard: true,
              mapType: MapTypeEnum.BMAP_NORMAL_MAP
            };
          });
        }
        else {
          this.alertProvider.title = 'Sorry...';
          this.alertProvider.message = 'No data found at this Location';
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

    this.paramData = {
      'user_id': this.user_id,
      'latitude': markerData.lat,
      'longitude': markerData.lng,
      'searchCat': this.searchCat,
      'searchUse': this.searchUse,
      'length': '3',
      'start': '0',
    };

    console.log(this.showStories);
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

    // if (this.popover) {
    //   this.popover.dismiss().catch();
    //   this.popover = null;
    // }
    // this.popover = this.popoverCtrl.create(StoryTopListPage, Param);
    // this.popover.onDidDismiss(data => {
    //   this.popover = null;
    // });
    // this.popover.present();
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

  openProfile() {
    this.navCtrl.setRoot(ProfilePage);
  }

  goToList() {
    this.showStories = false;
    this.navCtrl.push(StoryListPage, this.paramData);
  }

}
