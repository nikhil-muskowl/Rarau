import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Component, ViewChild } from '@angular/core';
import { Platform, App, Nav, MenuController, Alert, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { MainTabsPage } from '../pages/MainModule/main-tabs/main-tabs';
import { HomePage } from '../pages/MainModule/home/home';
import { TutorialPage } from '../pages/MainModule/tutorial/tutorial';
import { SplashPage } from '../pages/MainModule/splash/splash';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { AlertController } from 'ionic-angular';
import { LanguageProvider } from '../providers/language/language';
import { ConfigProvider } from '../providers/config/config';
import { BaiduProvider } from "../providers/baidu/baidu";
import { File } from '@ionic-native/file';
import { NotiProvider } from '../providers/noti/noti';
declare var Pushy: any;

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  isApp;
  private alert: Alert;
  private language;
  private city_id;

  // pages: PageInterface[] = [
  //   { title: 'Home', name: 'TabsPage', component: MainTabsPage, tabComponent: HomePage, index: 0, icon: 'home' },
  //   { title: 'Upload', name: 'TabsPage', component: MainTabsPage, tabComponent: GalleryPage, index: 0, icon: 'home' },
  //   { title: 'Ranking', name: 'TabsPage', component: MainTabsPage, tabComponent: RankingPage, index: 0, icon: 'home' },
  //   { title: 'Profile', name: 'TabsPage', component: MainTabsPage, tabComponent: ProfilePage, index: 0, icon: 'home' }
  // ];

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private app: App,
    public menu: MenuController,
    private alertCtrl: AlertController,
    public translate: TranslateService,
    public screenOrientation: ScreenOrientation,
    public languageProvider: LanguageProvider,
    public baiduProvider: BaiduProvider,
    public notiProvider: NotiProvider,
    public locationTracker: LocationTrackerProvider,
    public configProvider: ConfigProvider,
    public file: File,
    public modalCtrl: ModalController) {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isApp = false;
        console.log('this.isApp : ' + this.isApp);
      }
      else {
        this.isApp = true;
        console.log('this.isApp : ' + this.isApp);

        this.file.checkDir(this.file.externalRootDirectory, 'RaRaU Images').then(response => {
          console.log('Directory exists' + response);
        }).catch(err => {
          console.log('Directory doesn\'t exist' + JSON.stringify(err));
          this.file.createDir(this.file.externalRootDirectory, 'RaRaU Images', false).then(response => {
            console.log('Directory create' + JSON.stringify(response));
          }).catch(err => {
            console.log('Directory no create' + JSON.stringify(err));
          });
        });

        //Push notification setup
        this.pushSetup();

        //custom splash Commented on 26-02-2019 on PNG splash
        // let splash = modalCtrl.create(SplashPage);
        // splash.present();

        // Commented these lines for desktop, uncomment for real device(Mobile)
        // console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'

        // set to landscape
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }

      this.locationTracker.setLocation();
      this.backEvent();

      this.language = this.languageProvider.getLanguage();
      console.log(this.language);
      this.translate.setDefaultLang(this.language);


      //check city
      this.city_id = this.baiduProvider.getCity();
      if (this.city_id == undefined || this.city_id == '' || this.city_id == null) {
        this.baiduProvider.setCity('131');
      }

      // console.log('tutorial value : ' + this.configProvider.isSeen());
      // let chk = this.configProvider.isSeen();
      // if (chk == '1') {
      //   this.rootPage = MainTabsPage;
      // }
      // else {
      //   this.rootPage = TutorialPage;
      // }
      this.rootPage = MainTabsPage;

      this.initializeApp();

      console.log('this.locationTracker.getLatitude : ' + this.locationTracker.getLatitude());
      console.log('this.locationTracker.getLongitude : ' + this.locationTracker.getLongitude());
      this.translate.use(this.language);
    });

  }

  pushSetup() {
    document.addEventListener('deviceready', function () {
      // Start the Pushy service
      Pushy.listen();
      Pushy.requestStoragePermission();

      Pushy.register(function (err, deviceToken) {
        // Handle registration errors
        if (err) {
          return console.log(err);
        }

        // Display an console with device token
        console.log('Pushy device token: ' + deviceToken);
        let data = { code: deviceToken };
        this.notiProvider.setToken(data);
        // Send the token to your backend server via an HTTP GET request
        //await fetch('https://your.api.hostname/register/device?token=' + deviceToken);

        // Succeeded, optionally do something to alert the user
      });
    });

    Pushy.setNotificationListener(function (data) {
      // Print notification payload data
      console.log('Received notification: ' + JSON.stringify(data));

      // Display an alert with the "message" payload value
      console.log(data.message);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  //for menus
  openPage(page: PageInterface) {
    let params = {};

    // The index is equal to the order of our tabs inside tabs.ts
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If tabs page is already active just change the tab index
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    } else {
      // Tabs are not active, so reset the root page 
      // In this case: moving to or from SpecialPage
      this.nav.setRoot(page.component, params);
    }
  }

  isActive(page: PageInterface) {
    // Again the Tabs Navigation
    let childNav = this.nav.getActiveChildNavs()[0];

    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    // Fallback needed when there is no active childnav (tabs not active)
    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }

  backEvent() {
    this.platform.registerBackButtonAction(() => {
      const overlayView = this.app._appRoot._overlayPortal._views[0];
      if (overlayView && overlayView.dismiss) {
        overlayView.dismiss();
        return;
      }
      if (this.nav.canGoBack()) {
        this.nav.pop();
      }
      else {
        let view = this.nav.getActive();
        if (view.component == HomePage) {
          if (this.alert) {
            this.alert.dismiss();
            this.alert = null;
          } else {
            this.showAlert();
          }
        }
      }
    });
  }

  showAlert() {
    this.alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alert = null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }

}

