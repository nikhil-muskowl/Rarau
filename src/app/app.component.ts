import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Component, ViewChild } from '@angular/core';
import { Platform, App, Nav, MenuController, Alert } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { MainTabsPage } from '../pages/MainModule/main-tabs/main-tabs';
import { HomePage } from '../pages/MainModule/home/home';
import { RankingPage } from '../pages/MainModule/ranking/ranking';
import { ProfilePage } from '../pages/MainModule/profile/profile';
import { GalleryPage } from '../pages/story/gallery/gallery';
import { TutorialPage } from '../pages/MainModule/tutorial/tutorial';

import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { AlertController } from 'ionic-angular';
import { LanguageProvider } from '../providers/language/language';
import { ConfigProvider } from '../providers/config/config';

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
  private alert: Alert;
  private language;

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
    public languageProvider: LanguageProvider,
    public locationTracker: LocationTrackerProvider,
    public configProvider: ConfigProvider) {

    this.platform.ready().then(() => {

      this.locationTracker.setLocation();
      this.backEvent();

      this.language = this.languageProvider.getLanguage();
      console.log(this.language);
      this.translate.setDefaultLang(this.language);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.splashScreen.hide();
      console.log('tutorial value : ' + this.configProvider.isSeen());
      let chk = this.configProvider.isSeen();
      if (chk == '1') {
        this.rootPage = MainTabsPage;
      }
      else {
        this.rootPage = TutorialPage;
      }
      this.initializeApp();


      console.log('this.locationTracker.getLatitude : ' + this.locationTracker.getLatitude());
      console.log('this.locationTracker.getLongitude : ' + this.locationTracker.getLongitude());
      this.translate.use(this.language);
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

