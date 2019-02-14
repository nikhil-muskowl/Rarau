import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-story-modal',
  templateUrl: 'story-modal.html',
})
export class StoryModalPage {

  public paramData;
  public user_id;
  public title_txt;
  public image;
  public msg_txt;

  public keep_going;
  public from;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.setText();
    this.getData();
  }

  //get previous page data
  getData() {
    let data = this.navParams.get('data');

    this.title_txt = data.title;
    this.image = data.image;
    this.msg_txt = data.msg;
    this.from = data.from;
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('keep_going').subscribe((text: string) => {
      this.keep_going = text;
    });
  }

  //open page
  openPage() {
    const data = {
      close: 1
    };
    this.view.dismiss();
  }

  //close modal and redirect to previous page
  closeModal() {
    const data = {
      close: 0
    };
    this.view.dismiss();
  }

}
