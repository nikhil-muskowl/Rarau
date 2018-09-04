import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ProfileProvider } from '../../../providers/profile/profile';
import { TabsService } from "../../util/tabservice";
import { ProfilePage } from "../profile/profile";
import { CameraOpenPage } from '../../AccountModule/camera-open/camera-open';
import { AlertProvider } from '../../../providers/alert/alert';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoginProvider } from '../../../providers/login/login';

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private tabService: TabsService,
    public alertProvider: AlertProvider,
    public camera: Camera,
    public LoginProvider: LoginProvider,
    public profileProvider: ProfileProvider,
    public loadingProvider: LoadingProvider, ) {

    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    }, 2);

    this.image = this.navParams.get('image');
    this.displayImage = this.image;
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
    console.log('ionViewDidLoad ProfilePhotoPage' + this.user_id);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePhotoPage');
  }
  ionViewDidLeave() {
    this.tabService.show();
  }

  ionViewWillEnter() {
    this.tabService.hide();
  }

  goBack() {
    this.navCtrl.setRoot(ProfilePage);
  }

  save() {
    //code to save
    console.log('select' + this.imgSend);
    if (this.imgSend == undefined) {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Select Image First.';
      this.alertProvider.showAlert();
    }
    else {

      this.loadingProvider.present();

      this.profileProvider.apiuploadProfilePic(this.user_id, this.imgSend).subscribe(
        response => {
          this.responseData = response;
          this.status = this.responseData.status;
          if (this.status) {

            this.result = this.responseData.result;
            this.alertProvider.title = 'Success';
            this.alertProvider.message = 'Image Uploaded.';
            this.alertProvider.showAlert();

            this.navCtrl.setRoot(ProfilePage);
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
