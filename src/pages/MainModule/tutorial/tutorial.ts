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
  public done;
  public skip;
  public next;
  public next_txt;
  public tutImages = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public configProvider: ConfigProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.setText();

    this.tutImages = [
      { image: 'assets/imgs/Profile/img1.png' },
      { image: 'assets/imgs/Profile/img2.png' },
      { image: 'assets/imgs/Profile/img1.png' },
      { image: 'assets/imgs/Profile/img2.png' }];
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');
  }

  tuteSeen() {
    this.configProvider.setisSeen(true);
    this.navCtrl.setRoot(MainTabsPage);
  }

  tuteSkip() {
    this.configProvider.setisSeen(true);
    this.navCtrl.setRoot(MainTabsPage);
  }

  slideChanged() {

    let currentIndex = this.slides.getActiveIndex();
    console.log('currentIndex : ' + currentIndex);
    if (currentIndex == this.tutImages.length - 1 || currentIndex == this.tutImages.length) {
      this.next = this.done;
    }
    else {
      this.next = this.next_txt;
    }
  }
}
