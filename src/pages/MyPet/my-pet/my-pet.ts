import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { MyPetProvider } from '../../../providers/my-pet/my-pet';
import { LoginProvider } from '../../../providers/login/login';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { MyPetDetailsPage } from '../my-pet-details/my-pet-details';
import { LoginPage } from '../../AccountModule/login/login';

@IonicPage()
@Component({
  selector: 'page-my-pet',
  templateUrl: 'my-pet.html',
})

export class MyPetPage {

  public language_id;
  public user_id;
  public petResponse;
  public petData;
  public title;
  public level;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider,
    public translate: TranslateService,
    public mypetProvider: MyPetProvider,
    public languageProvider: LanguageProvider, ) {

  }

  ionViewWillEnter() {

    this.user_id = this.LoginProvider.isLogin();
    if (this.user_id == undefined || this.user_id == '') {
      this.navCtrl.setRoot(LoginPage);
    }
    else {
      this.language_id = this.languageProvider.getLanguageId();
      this.setText();
      this.getPets();
    }
  }

  ngOnInit() {
    // Let's navigate from TabsPage to Page1
    this.user_id = this.LoginProvider.isLogin();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('mypet').subscribe((text: string) => {
      this.title = text;
    });

    this.translate.get('lvl').subscribe((text: string) => {
      this.level = text;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyPetPage');
  }

  getPets() {
    let param;
    param = {
      'language_id': this.language_id,
      'user_id': this.user_id
    };

    this.mypetProvider.apiMyPetList(param).subscribe(response => {

      this.petResponse = response;
      this.petData = this.petResponse.data;

      console.log('petResponse  : ' + JSON.stringify(this.petResponse));

      this.loadingProvider.dismiss();
    },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  getDetails(id) {

    this.navCtrl.push(MyPetDetailsPage, {
      id: id
    });
  }
}
