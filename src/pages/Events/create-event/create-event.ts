import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//provider
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { EventProvider } from '../../../providers/event/event';
import { BaiduProvider } from "../../../providers/baidu/baidu";
import { LocationTrackerProvider } from '../../../providers/location-tracker/location-tracker';

@IonicPage()
@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})
export class CreateEventPage {

  submitAttempt;
  eventForm: FormGroup;
  user_id;

  public cities;
  public city_id;
  public city;

  events;
  event_name;
  event_date;
  event_time;
  event_city;
  event_loc;
  event_desc;
  create_event;
  error_name;
  error_date;
  error_time;
  error_loc;
  error_city;
  error_desc;
  story_srch_loc;

  public locations: any;
  public searchData: any;
  public searchLoc;
  public latitude;
  public longitude;
  public searcLatitude;
  public searcLongitude;
  public fileterData;

  public todayDate;
  public todayTime;
  public todayTimeLocal;
  public today;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private loginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public platform: Platform,
    public locationTrackerProvider: LocationTrackerProvider,
    public baiduProvider: BaiduProvider,
    public languageProvider: LanguageProvider, ) {
  }

  ngOnInit() {
    this.createForm();

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.user_id = this.loginProvider.isLogin();
    this.city_id = this.baiduProvider.getCity();
    this.todayDate = new Date().toISOString();
    this.todayTime = new Date().toISOString();
    // this.todayTimeLocal = this.todayTime.getTimezoneOffset();
    this.today = new Date().toISOString().split('T')[0];

    console.log('todays : ' + this.today);
    console.log('todayTimeLocal : ' + this.todayTimeLocal);

    this.setText();
    this.loadCity();

    this.locationTrackerProvider.setLocation();
    //uncommnet below for HK testing 
    this.latitude = this.locationTrackerProvider.getLatitude();
    this.longitude = this.locationTrackerProvider.getLongitude();
  }

  createForm() {
    this.eventForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(32), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      date: ['', Validators.required],
      time: ['', Validators.required],
      desc: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      loc: ['', ''],
      fcity: ['', ''],
    });
  }

  onChangeCity(data: any) {
    console.log('selected city : ' + JSON.stringify(data));
    this.baiduProvider.setCity(data);
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('events').subscribe((text: string) => {
      this.events = text;
    });
    this.translate.get('event_name').subscribe((text: string) => {
      this.event_name = text;
    });
    this.translate.get('event_date').subscribe((text: string) => {
      this.event_date = text;
    });
    this.translate.get('event_time').subscribe((text: string) => {
      this.event_time = text;
    });
    this.translate.get('event_loc').subscribe((text: string) => {
      this.event_loc = text;
    });
    this.translate.get('event_desc').subscribe((text: string) => {
      this.event_desc = text;
    });
    this.translate.get('event_city').subscribe((text: string) => {
      this.event_city = text;
    });
    this.translate.get('create_event').subscribe((text: string) => {
      this.create_event = text;
    });
    this.translate.get('error_name').subscribe((text: string) => {
      this.error_name = text;
    });
    this.translate.get('error_date').subscribe((text: string) => {
      this.error_date = text;
    });
    this.translate.get('error_time').subscribe((text: string) => {
      this.error_time = text;
    });
    this.translate.get('error_loc').subscribe((text: string) => {
      this.error_loc = text;
    });
    this.translate.get('error_city').subscribe((text: string) => {
      this.error_city = text;
    });
    this.translate.get('error_description').subscribe((text: string) => {
      this.error_desc = text;
    });
    this.translate.get('story_srch_loc').subscribe((text: string) => {
      this.story_srch_loc = text;
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  loadCity() {
    this.cities = [];

    this.baiduProvider.getCities().subscribe(response => {
      this.cities = response;
      for (let i = 0; i < this.cities.length; i++) {
        if (this.cities[i].area_id == this.city_id) {
          this.city = this.cities[i].name;
        }
      }
    }, err => {
      console.error(err);
    });
  }

  save() {
    this.submitAttempt = true;
    if (this.eventForm.valid) {
      //name of location for event details
      this.searchLoc;
    }
  }

  public getLocation() {

    this.fileterData = {
      query: this.searchLoc,
      location: this.city_id
      // location: `${this.latitude},${this.longitude}`
    };

    this.baiduProvider.location(this.fileterData).subscribe(
      response => {
        console.log(response);
        this.searchData = response;
        this.locations = this.searchData.result;

        console.log('location : ' + JSON.stringify(this.locations));
      },
      err => { console.error(err); }
    );
    console.log(this.locations);
  }

  public locItemSelected(location: any) {
    console.log(location);
    if (location) {
      this.searchLoc = location.name;
      this.searcLatitude = location.location.lat;
      this.searcLongitude = location.location.lng;
    }

    console.log(this.searcLatitude);
    console.log(this.searcLongitude);
    this.locations = [];
  }

  public onLocInput(ev: any) {
    console.log('target value : ' + JSON.stringify(ev.target.value));
    if (!this.isEmpty(ev.target.value)) {
      // if (ev.target.value != "" || ev.target.value != undefined) {
      console.log("inside if target");
      this.searchLoc = ev.target.value;
      this.locations = [];
      this.getLocation();
    }
    else {
      this.locations = [];
    }
  }

  public onLocCancel(ev: any) {
    this.searchLoc = '';
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }
}
