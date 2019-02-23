import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from "@ionic-native/camera-preview";
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

  story_type_id;
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

    this.story_type_id = this.navParams.get('story_type_id');

    this.platform.registerBackButtonAction(() => {
      this.back();
    });
  }

  //when view will be enter in page
  ionViewWillEnter() {

    this.isLogin();
    //change on 25/12 tab OnChange
    if (this.user_id == undefined || this.user_id == '') {
      this.navCtrl.setRoot(LoginPage);
    }
    else {
      this.startCamera();
      this.tabService.hide();
    }
  }

  //check if user is logged in or not
  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  //goto home page on back click
  back() {
    this.stopCamera();
    this.tabService.show();
    this.navCtrl.setRoot(HomePage);
  }

  //open gallery to select an image
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
        this.navCtrl.push(ShowPhotoPage, { photo: this.galBas, story_type_id: this.story_type_id });
      }
      else {
        this.startCamera();
      }

    }, (err) => {
      console.error(err);
    });
  }

  //open camera to take a picture
  takePicture() {

    const pictureOpts: CameraPreviewPictureOptions = {
      quality: 50,
      width: 360,
      height: 640,
      // destinationType: this.camera.DestinationType.DATA_URL,
      // encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      // correctOrientation: true,
      // sourceType: this.camera.PictureSourceType.CAMERA,
    };

    this.cameraPreview.takePicture(pictureOpts).then(imageData => {
      this.srcPhoto = "data:image/jpeg;base64," + imageData;

      this.cameraPreview.stopCamera().then(() => {
        this.navCtrl.push(ShowPhotoPage, { photo: this.srcPhoto, story_type_id: this.story_type_id });
      });

      this.cameraPreview.hide().then(() => {

      });
    });
  }

  //start rear camera
  startCamera() {

    this.stopCamera();

    this.setFlashMode();

    this.cameraPreview.startCamera({
      x: 0,
      y: 0,
      width: this.platform.width(),
      height: this.platform.height(),
      toBack: true,
      camera: 'rear',//for Rear camera
      previewDrag: false,
      tapPhoto: true
    }).then(() => {
      console.log("camera started")

    }).catch(() => {
      console.log("camera error")
    })
  }

  //stop camera
  stopCamera() {
    try {
      this.cameraPreview.stopCamera().catch(e => {

      });
    } catch (e) {
    }
  }

  //on-off flash
  flash() {

    if (this.flashMode == 'off') {
      this.flashMode = 'on'
    } else {
      this.flashMode = 'off'
    }

    this.setFlashMode();
  }

  //setting flash mode on camera
  setFlashMode() {
    this.cameraPreview.setFlashMode(this.flashMode);
  }

  //switch camera front-rear
  switchCamera() {
    this.cameraPreview.switchCamera();
  }
}
