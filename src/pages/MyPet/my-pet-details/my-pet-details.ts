import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { MyPetProvider } from '../../../providers/my-pet/my-pet';
import { LoginProvider } from '../../../providers/login/login';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { Slides } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-my-pet-details',
  templateUrl: 'my-pet-details.html',
})

export class MyPetDetailsPage {
  @ViewChild(Slides) slides: Slides;

  public title;
  public pet_id;
  public user_id;
  public language_id;
  public petResponse;
  public petResult;
  public petTitle;
  public petImage;
  public petImageThumb;
  public petStatus;
  public level;
  public levels: any = [];
  public total_points;
  public points;
  public progress;
  public levelResponse;
  public levelResult;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider,
    public translate: TranslateService,
    public toastCtrl: ToastController,
    public mypetProvider: MyPetProvider,
    public languageProvider: LanguageProvider, ) {

    this.pet_id = this.navParams.get('id');
    console.log('this.pet_id : ' + this.pet_id);
  }

  ngOnInit() {
    this.user_id = this.LoginProvider.isLogin();
    this.language_id = this.languageProvider.getLanguageId();
    this.setText();
    this.getDetails();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('mypet_detail').subscribe((text: string) => {
      this.title = text;
    });
  }

  getDetails() {

    this.mypetProvider.apiPetDetails(this.pet_id).subscribe(response => {

      this.petResponse = response;
      this.petStatus = this.petResponse.status;
      console.log('petDetailsResponse  : ' + JSON.stringify(this.petResponse));

      if (this.petStatus) {

        this.petResult = this.petResponse.result;
        this.total_points = this.petResponse.total_points;
        this.points = this.petResponse.points;
        this.progress = this.petResponse.progress;
        this.petTitle = this.petResult.pet_name;
        this.petImage = this.petResult.pet_image;
        this.petImageThumb = this.petResult.pet_image_thumb;
        this.levels = this.petResult.levels;

        console.log('petTitle : ' + JSON.stringify(this.petTitle));
        console.log('levels : ' + JSON.stringify(this.levels));
      }
      this.loadingProvider.dismiss();
    },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  // slideChanged() {
  //   let currentIndex = this.slides.getActiveIndex();
  //   if (currentIndex == this.levels.length) {
  //     this.slides.stopAutoplay();
  //   }
  // }

  // onLevelClick(slideData) {

  //   let param = {
  //     user_id: this.user_id,
  //     pet_id: slideData.pet_id,
  //     level: slideData.level
  //   }

  //   this.mypetProvider.apiPetUpgrade(param).subscribe(response => {

  //     this.levelResponse = response;
  //     this.levelResult = this.levelResponse.result;
  //     var status = this.petResponse.status;
  //     console.log('levelResponse  : ' + JSON.stringify(this.levelResponse));

  //     if (!status) {
  //       this.levelResult.forEach(element => {
  //         if (element.id == 'level') {

  //           let toast = this.toastCtrl.create({
  //             message: element.text,
  //             duration: 3000,
  //             position: 'bottom'
  //           });

  //           toast.present();
  //         }
  //       });
  //     }
  //     else {
  //       this.levelResult.forEach(element => {
  //         if (element.id == 'level') {

  //           let toast = this.toastCtrl.create({
  //             message: element.text,
  //             duration: 3000,
  //             position: 'bottom'
  //           });

  //           toast.present();
  //         }
  //       });
  //     }
  //     this.loadingProvider.dismiss();
  //   },
  //     err => console.error(err),
  //     () => {
  //       this.loadingProvider.dismiss();
  //     }
  //   );
  // }
}
