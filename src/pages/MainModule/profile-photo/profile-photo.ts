import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ProfileProvider } from '../../../providers/profile/profile';
import { TabsService } from "../../util/tabservice";
import { ProfilePage } from "../profile/profile";
import { CameraOpenPage } from '../../AccountModule/camera-open/camera-open';
import { AlertProvider } from '../../../providers/alert/alert';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoginProvider } from '../../../providers/login/login';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { CameraUtilsProvider } from '../../../providers/camera-utils/camera-utils';
import { NetworkProvider } from '../../../providers/network/network';

@IonicPage()
@Component({
  selector: 'page-profile-photo',
  templateUrl: 'profile-photo.html',
})
export class ProfilePhotoPage {

  public user_id;
  public image;
  public displayImage;
  public imgSend;
  public responseData;
  public status;
  public result;

  public upload_profile_pic;
  public rarau;
  public upload;
  public profile_picture;
  public error;
  public select_img_first;
  public success;
  public image_uploaded;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public zone: NgZone,
    public platform: Platform,
    public network: NetworkProvider,
    private tabService: TabsService,
    public alertProvider: AlertProvider,
    public camera: Camera,
    public LoginProvider: LoginProvider,
    public profileProvider: ProfileProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public cameraUtils: CameraUtilsProvider,
    public languageProvider: LanguageProvider, ) {

    this.setText();
    this.isLogin();

    platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.image = this.navParams.get('image');
    console.log('image : ' + this.image);
    this.displayImage = this.image;
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('upload_profile_pic').subscribe((text: string) => {
      this.upload_profile_pic = text;
    });
    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('upload').subscribe((text: string) => {
      this.upload = text;
    });
    this.translate.get('profile_picture').subscribe((text: string) => {
      this.profile_picture = text;
    });
    this.translate.get('error').subscribe((text: string) => {
      this.error = text;
    });
    this.translate.get('select_img_first').subscribe((text: string) => {
      this.select_img_first = text;
    });
    this.translate.get('success').subscribe((text: string) => {
      this.success = text;
    });
    this.translate.get('image_uploaded').subscribe((text: string) => {
      this.image_uploaded = text;
    });
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
    console.log('ionViewDidLoad ProfilePhotoPage' + this.user_id);
  }

  ionViewWillEnter() {
    this.tabService.hide();
  }

  goBack() {
    this.navCtrl.setRoot(ProfilePage);
    this.tabService.show();
  }

  save() {
    //code to save
    this.imgSend = this.displayImage;
    console.log('select : ' + this.imgSend);
    if (this.imgSend == undefined) {
      this.alertProvider.title = this.error;
      this.alertProvider.message = this.select_img_first;
      this.alertProvider.showAlert();
    }
    else {
      if (this.network.checkStatus() == true) {
        this.loadingProvider.present();

        this.profileProvider.apiuploadProfilePic(this.user_id, this.imgSend).subscribe(
          response => {
            this.responseData = response;
            this.status = this.responseData.status;
            if (this.status) {
              //for synchronize saving
              this.zone.run(() => {
                //to save image into gallery
                this.cameraUtils.saveToGallery(this.imgSend);

                console.log("inside upload");
                this.result = this.responseData.result;
                this.alertProvider.title = this.success;
                this.alertProvider.message = this.image_uploaded;
                this.alertProvider.showAlert();
                this.tabService.show();
                this.navCtrl.setRoot(ProfilePage);
              });
            }
          },
          err => {
            console.error(err);
            this.loadingProvider.dismiss();
          },
          () => {
            this.loadingProvider.dismiss();
          }
        );
      }
      else {
        this.network.displayNetworkUpdate();
      }
    }
  }

  openCamera() {
    this.navCtrl.push(CameraOpenPage, { sendClass: 'profile' });
  }

  openGallery() {

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: 0,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.displayImage = 'data:image/jpeg;base64,' + imageData;
      this.imgSend = this.displayImage;
    }, (err) => {
      // Handle error
    });
  }
}
