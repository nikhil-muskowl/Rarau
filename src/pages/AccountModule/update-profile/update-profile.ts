import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from "@angular/platform-browser";
import { TabsService } from "../../util/tabservice";
import { CameraOpenPage } from '../camera-open/camera-open';
import { RegistrationPage } from '../registration/registration';
import { AlertProvider } from '../../../providers/alert/alert';
import { Camera, CameraOptions } from '@ionic-native/camera';

//provider
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';

@IonicPage()
@Component({
  selector: 'page-update-profile',
  templateUrl: 'update-profile.html',
})
export class UpdateProfilePage {

  public images;
  public displayImage;
  public srcPhoto;
  public imgSend;
  public responseData;
  public status;
  public result;
  public data;
  public date;
  public gender;
  public flashMode = "off";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public sanitizer: DomSanitizer,
    private tabService: TabsService,
    private imagePicker: ImagePicker,
    public alertProvider: AlertProvider,
    public camera: Camera,
    private loginProvider: LoginProvider,
    public loadingProvider: LoadingProvider, ) {

    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.push(RegistrationPage, {
        imagePath: this.result, image: this.srcPhoto, data: this.data,
        date: this.date, gender: this.gender
      });
    }, 2);

    this.srcPhoto = this.navParams.get('image');
    this.result = this.navParams.get('imagePath');
    this.data = this.navParams.get('data');
    this.date = this.navParams.get('date');
    this.gender = this.navParams.get('gender');
    console.log('this.gender' + this.gender);

    if (this.srcPhoto != undefined) {
      this.displayImage = this.srcPhoto;
      this.imgSend = this.srcPhoto;
    }
    else {
      this.displayImage = "assets/icon/user.png";
    }
  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    this.tabService.hide();
  }

  goBack() {
    this.navCtrl.push(RegistrationPage, {
      imagePath: this.result, image: this.srcPhoto, data: this.data,
      date: this.date, gender: this.gender
    });
  }

  ionViewDidLeave() {
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

      this.loginProvider.apiProfileUpload(this.imgSend).subscribe(
        response => {
          this.responseData = response;
          this.status = this.responseData.status;
          if (this.status) {

            this.result = this.responseData.result;
            this.alertProvider.title = 'Success';
            this.alertProvider.message = 'Image Uploaded.';
            this.alertProvider.showAlert();

            this.navCtrl.push(RegistrationPage, {
              imagePath: this.result, image: this.imgSend, data: this.data,
              date: this.date, gender: this.gender
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
  }

  openCamera() {
    this.navCtrl.push(CameraOpenPage, {
      image: this.imgSend, imagePath: this.result, data: this.data,
      date: this.date, gender: this.gender, sendClass: 'update_profile'
    });
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
