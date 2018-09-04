import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, PopoverController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchResultPage } from '../../SearchModule/search-result/search-result';
import { ProfilePage } from '../profile/profile';
import { StoryTopListPage } from '../../story/story-top-list/story-top-list';
import { LocationTrackerProvider } from '../../../providers/location-tracker/location-tracker';
import { BaiduProvider } from '../../../providers/baidu/baidu';
import { ControlAnchor, MapOptions, NavigationControlOptions, NavigationControlType, Point, MapTypeEnum, MarkerOptions } from 'angular2-baidu-map';
import { AlertProvider } from '../../../providers/alert/alert';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public title = 'Home';
  public images: Array<any>;

  public locations: any;
  public filterData: any;
  public responseData: any;
  public search = '';
  public latitude: number = 0;
  public longitude: number = 0;
  public data: any;

  options: MapOptions;
  point: Point;
  navOptions: NavigationControlOptions;
  public markers: Array<{ point: Point; options?: MarkerOptions }>;

  private error_srcLoc = 'field is required';
  private error_srcUser = 'field is required';

  searchForm: FormGroup;
  private formData: any;
  searchLocation;
  searchUser;

  @ViewChild('map') mapElement: ElementRef;
  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    public alertProvider: AlertProvider,
    public locationTrackerProvider: LocationTrackerProvider,
    public baiduProvider: BaiduProvider,
    public formBuilder: FormBuilder,
    public popoverCtrl: PopoverController,
  ) {
    this.bindMap();
    this.createForm();
    this.images = [
      { categoryFirst: 'assets/icon/Front-Icons/food.png', text: '8', categoryPerson: 'assets/icon/user.png' },
      { categoryFirst: 'assets/icon/Front-Icons/VectorSmartObject.png', text: '5', categoryPerson: 'assets/icon/user.png' },
      { categoryFirst: 'assets/icon/Front-Icons/world.png', text: '7', categoryPerson: 'assets/icon/user.png' },
      { categoryFirst: 'assets/icon/Front-Icons/VectorSmartObject.png', text: '2', categoryPerson: 'assets/icon/user.png' },
    ]
  }

  public bindMap() {
    this.options = {
      centerAndZoom: {
        lat: this.latitude,
        lng: this.longitude,
        zoom: 1
      },
      enableKeyboard: true,
      mapType: MapTypeEnum.BMAP_NORMAL_MAP
    };

    // this.markers = [
    //   {
    //     options: {
    //       // enableDragging: true,
    //       icon: {
    //         imageUrl: '/assets/imgs/marker.png',
    //         size: {
    //           height: 50,
    //           width: 50
    //         },
    //         imageSize: {
    //           height: 50,
    //           width: 50
    //         }
    //       }
    //     },
    //     point: {
    //       lat: this.latitude,
    //       lng: this.longitude
    //     }
    //   }
    // ];

    this.locationTrackerProvider.getPosition().then((data) => {
      if (data) {
        console.log(data.coords);
        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;

        this.options = {
          centerAndZoom: {
            lat: this.latitude,
            lng: this.longitude,
            zoom: 1
          },
          enableKeyboard: true,
          mapType: MapTypeEnum.BMAP_NORMAL_MAP
        };

        this.markers = [
          {
            options: {
              // enableDragging: true,
              icon: {
                imageUrl: '/assets/imgs/marker.png',
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
          }
        ];

      }
    }).catch(e => {
      console.log(e);
    });

    this.navOptions = {
      anchor: ControlAnchor.BMAP_ANCHOR_TOP_RIGHT,
      type: NavigationControlType.BMAP_NAVIGATION_CONTROL_LARGE
    };

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

    this.filterData = {
      query: this.search,
      location: `${this.latitude},${this.longitude}`
    };

    this.baiduProvider.location(this.filterData).subscribe(
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
    console.log(location.location);
    if (location) {
      this.latitude = location.location.lat;
      this.longitude = location.location.lng;
    }

    console.log(this.latitude);
    console.log(this.longitude);

    this.bindMap();

    this.locations = [];
  }

  public showWindow({ e, marker, map }: any): void {
    console.log(e);
    // map.openInfoWindow(
    //   new window.BMap.InfoWindow('Your Position', {
    //     offset: new window.BMap.Size(0, -30),
    //     title: 'Title'
    //   }),
    //   marker.getPosition()
    // )

    this.presentPopover();
  }

  loadMap(map: any) {
    console.log('map instance here', map);
  }

  clickMarker(marker: any) {
    console.log('The clicked marker is', marker);
    this.presentPopover();
  }

  presentPopover() {
    let popover = this.popoverCtrl.create(StoryTopListPage);
    popover.present({
      // ev: myEvent
    });
  }

  clickmap(e: any) {
    // this.latitude = e.point.lat;
    // this.longitude = e.point.lng;
    console.log(`Map clicked with coordinate: ${e.point.lng}, ${e.point.lat}`);
  }

  createForm() {
    this.searchForm = this.formBuilder.group({
      searchLocation: ['', Validators.required],
      searchUser: ['', Validators.required],
    });
  }

  searchLoc(event) {
    event.stopPropagation();
    this.searchLocation = this.searchForm.value.searchLocation;
    console.log('searchUser: ' + this.searchLocation);

    if (this.searchForm.value.searchLocation != '') {
      console.log('searchLocation: ' + this.searchForm.value.searchLocation);
      this.navCtrl.push(SearchResultPage, { search: this.searchForm.value.searchLocation });
      this.searchForm.reset();
    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

  searchUsercat(event) {
    event.stopPropagation();
    this.searchUser = this.searchForm.value.searchUser;
    console.log('searchUser: ' + this.searchUser);

    if (this.searchForm.value.searchUser != '') {
      this.navCtrl.push(SearchResultPage, { search: this.searchForm.value.searchUser });
      this.searchForm.reset();

    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

  openProfile() {
    this.navCtrl.setRoot(ProfilePage);
  }
}
