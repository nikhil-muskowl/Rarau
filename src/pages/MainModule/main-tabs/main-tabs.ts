import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RankingPage } from '../ranking/ranking';
import { ProfilePage } from '../profile/profile';
import { MyPetPage } from '../../MyPet/my-pet/my-pet';
import { GalleryPage } from '../../story/gallery/gallery';
import { LoginProvider } from '../../../providers/login/login';
import { LoginPage } from '../../AccountModule/login/login';

@IonicPage()
@Component({
  selector: 'page-main-tabs',
  templateUrl: 'main-tabs.html',
})
export class MainTabsPage {

  tab1Root: any = HomePage;
  tab2Root: any = MyPetPage;
  tab3Root: any = GalleryPage;
  tab4Root: any = RankingPage;
  tab5Root: any = ProfilePage;

  // tab2Root: any;
  // tab3Root: any;
  // tab4Root: any;
  // tab5Root: any;
  mySelectedIndex: number;
  public user_id;

  constructor(public params: NavParams,
    public navCtrl: NavController,
    public LoginProvider: LoginProvider,
  ) {
    if (params.data.tabIndex) {
      this.mySelectedIndex = params.data.tabIndex || 0;

    } else {
      this.mySelectedIndex = 0;
    }
  }

  home() {
    this.tab1Root = HomePage;
  }

  pet() {
    console.log("this.tab2Root MyPetPage");
    this.user_id = this.LoginProvider.isLogin();
    if (!this.user_id) {
      this.tab2Root = LoginPage;
    } else {
      this.tab2Root = MyPetPage;
    }
  }

  gallery() {
    console.log("this.mySelectedIndex GalleryPage");
    this.user_id = this.LoginProvider.isLogin();
    if (!this.user_id) {
      this.tab5Root = LoginPage;
    } else {
      this.tab3Root = GalleryPage;
    }
  }

  rank() {
    console.log("this.tab4Root RankingPage");
    this.tab4Root = RankingPage;
  }

  profile() {
    console.log("this.tab5Root ProfilePage");
    this.user_id = this.LoginProvider.isLogin();
    if (!this.user_id) {
      this.tab5Root = LoginPage;
    } else {
      this.tab5Root = ProfilePage;
    }
  }
}