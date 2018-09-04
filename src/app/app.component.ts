import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';

import { MainTabsPage } from '../pages/MainModule/main-tabs/main-tabs';
import { HomePage } from '../pages/MainModule/home/home';
import { PlacesPage } from '../pages/MainModule/places/places';
import { RankingPage } from '../pages/MainModule/ranking/ranking';
import { ProfilePage } from '../pages/MainModule/profile/profile';
import { GalleryPage } from '../pages/story/gallery/gallery';

import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';


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

  rootPage: any = MainTabsPage;

  pages: PageInterface[] = [
    { title: 'Home', name: 'TabsPage', component: MainTabsPage, tabComponent: HomePage, index: 0, icon: 'home' },
    { title: 'Place', name: 'TabsPage', component: MainTabsPage, tabComponent: PlacesPage, index: 0, icon: 'home' },
    { title: 'Upload', name: 'TabsPage', component: MainTabsPage, tabComponent: GalleryPage, index: 0, icon: 'home' },
    { title: 'Ranking', name: 'TabsPage', component: MainTabsPage, tabComponent: RankingPage, index: 0, icon: 'home' },
    { title: 'Profile', name: 'TabsPage', component: MainTabsPage, tabComponent: ProfilePage, index: 0, icon: 'home' }
  ];

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menu: MenuController,
    public locationTracker: LocationTrackerProvider, ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
    });
  }

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
}

