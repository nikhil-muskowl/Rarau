import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraPreview } from "@ionic-native/camera-preview";
import { ShowPhotoPage } from "../show-photo/show-photo";
import { HomePage } from "../../MainModule/home/home";
import { LoginPage } from "../../AccountModule/login/login";
import { TabsService } from "../../util/tabservice";
import { ImagePicker } from '@ionic-native/image-picker';
import { LoginProvider } from '../../../providers/login/login';

@IonicPage()
@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html',
})
export class GalleryPage {

  images;
  srcPhoto = '';
  flashMode = "off";
  galBas;
  public name;
  public email;
  public user_id;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public cameraPreview: CameraPreview,
    public camera: Camera,
    public platform: Platform,
    public LoginProvider: LoginProvider,
    private tabService: TabsService,
    private imagePicker: ImagePicker, ) {

    let backAction = platform.registerBackButtonAction(() => {
      console.log("second");
      this.stopCamera();
      this.tabService.show();
      this.navCtrl.setRoot(HomePage);
    }, 2);


    // this.startCamera();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GalleryPage');
  }

  ionViewWillEnter() {

    this.isLogin();
    if (this.user_id == undefined || this.user_id == '') {
      this.navCtrl.setRoot(LoginPage);
    }
    else {
      this.startCamera();
      this.tabService.hide();
    }
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
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
      if (imageData != '') {

        this.galBas = 'data:image/jpeg;base64,' + imageData;
        this.stopCamera();
        this.cameraPreview.hide();
        this.navCtrl.push(ShowPhotoPage, { photo: this.galBas });
      }
      else {
        this.startCamera();
      }

    }, (err) => {
      // Handle error
    });


    // this.imagePicker.getPictures(options).then((results) => {
    //   if (results != '') {

    //     this.galBas = "data:image/jpeg;base64," + results[0];
    //     this.navCtrl.push(ShowPhotoPage, { photo: this.galBas });


    //   }
    //   else {
    //     this.startCamera();
    //   }
    // }, (err) => { alert(err); });

  }

  takePicture() {

    const pictureOpts = {
      quality: 60,
      width: 640,
      height: 900,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      // correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,

    };

    this.cameraPreview.takePicture(pictureOpts).then(imageData => {
      this.srcPhoto = "data:image/jpeg;base64," + imageData;

      this.cameraPreview.stopCamera().then(() => {
        this.navCtrl.push(ShowPhotoPage, { photo: this.srcPhoto });
      });

      this.cameraPreview.hide().then(() => {

      });
    });
  }

  ionViewDidLeave() {

    // this.tabService.show();
  }

  startCamera() {

    this.stopCamera();

    this.setFlashMode();

    // start camera
    console.log(this.platform.width(), this.platform.height());

    this.cameraPreview.startCamera({
      x: 0,
      y: 44,
      width: this.platform.width(),
      height: this.platform.height(),
      toBack: true,
      previewDrag: false,
      tapPhoto: true
    }).then(() => {
      console.log("camera started")

    }).catch(() => {
      console.log("camera error")
    })
  }

  stopCamera() {
    try {
      this.cameraPreview.stopCamera().catch(e => {
        console.log("camera stop")
      });
    } catch (e) {
    }
  }

  flash() {

    if (this.flashMode == 'off') {
      this.flashMode = 'on'
    } else {
      this.flashMode = 'off'
    }

    this.setFlashMode();
  }

  setFlashMode() {
    this.cameraPreview.setFlashMode(this.flashMode).then(() => {

    }).catch(() => {

    });
  }

  switchCamera() {
    this.cameraPreview.switchCamera();
  }
}
