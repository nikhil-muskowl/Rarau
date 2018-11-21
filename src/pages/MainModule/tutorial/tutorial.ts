import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../../providers/config/config';
import { MainTabsPage } from '../main-tabs/main-tabs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { Slides } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})

export class TutorialPage {
  @ViewChild(Slides) slides: Slides;
  public title;
  public tutCheck;
  public done;
  public skip;
  public next;
  public next_txt;
  public show_tutorial;
  public tutorial_will;
  public chk;
  public tutImages = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public configProvider: ConfigProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.tutorial_will = true;
    this.setText();
    this.chk = this.configProvider.isSeen();
    if (this.chk == '1') {
      this.tutorial_will = false;
    }
    else {
      this.tutorial_will = true;
    }
    this.tutImages = [
      { image: 'assets/rarau_tutorial/map_search/2.png' },
      { image: 'assets/rarau_tutorial/map_search/4.png' },
      { image: 'assets/rarau_tutorial/story_view/1.png' },
      { image: 'assets/rarau_tutorial/story_view/2.png' },
      { image: 'assets/rarau_tutorial/story_view/3.png' },
      { image: 'assets/rarau_tutorial/story_view/4.png' },
      { image: 'assets/rarau_tutorial/3.jpg' },
      { image: 'assets/rarau_tutorial/1.png' },
      { image: 'assets/rarau_tutorial/2.png' }];
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('tutorial').subscribe((text: string) => {
      this.title = text;
    });
    this.translate.get('done').subscribe((text: string) => {
      this.done = text;
    });
    this.translate.get('skip').subscribe((text: string) => {
      this.skip = text;
    });
    this.translate.get('next').subscribe((text: string) => {
      this.next = text;
      this.next_txt = text;
    });
    this.translate.get('show_tutorial').subscribe((text: string) => {
      this.show_tutorial = text;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');
  }

  tuteSeen() {
    console.log('click on next btn');
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == this.tutImages.length - 1 || currentIndex == this.tutImages.length) {
      this.navCtrl.setRoot(MainTabsPage);
    }
    else {
      this.slides.slideNext();
    }
  }

  tuteSkip() {
    console.log('click on skip btn');
    this.navCtrl.setRoot(MainTabsPage);
  }

  reloadTutorial() {
    console.log('Check value : ' + this.tutorial_will);
    if (this.tutorial_will) {
      //cheecked means user want to see tutorial on every startup
      this.configProvider.setisSeen(0);
      console.log('Tutorial will be showen : ' + this.tutorial_will);

    }
    else {
      //means user dont't want to see tutorial on every startup
      this.configProvider.setisSeen(1);
      console.log('Tutorial will not be showen : ' + this.tutorial_will);

    }
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('currentIndex : ' + currentIndex);
    if (currentIndex == this.tutImages.length - 1 || currentIndex == this.tutImages.length) {
      this.next = this.done;
      this.tutCheck = 1;
    }
    else {
      this.next = this.next_txt;
      this.tutCheck = 0;
    }
  }
}
