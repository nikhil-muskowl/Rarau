import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraPreview } from "@ionic-native/camera-preview";
import { ImagePicker } from '@ionic-native/image-picker';
import { DomSanitizer } from "@angular/platform-browser";
import { TabsService } from "../../util/tabservice";
import { UpdateProfilePage } from "../update-profile/update-profile";
import { ProfilePhotoPage } from "../../MainModule/profile-photo/profile-photo";
import { StoryCategoryPage } from "../../story/story-category/story-category";

@IonicPage()
@Component({
  selector: 'page-camera-open',
  templateUrl: 'camera-open.html',
})
export class CameraOpenPage {

  public srcPhoto: any;
  public flashMode = "off";
  public sendClass;
  public result;
  public data;
  public date;
  public gender;
  public image;
  public locName;
  public latitude;
  public longitude;
  public sel_cat_id;
  public isPrivate;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public cameraPreview: CameraPreview,
    public camera: Camera,
    public platform: Platform,
    public sanitizer: DomSanitizer,
    private tabService: TabsService,
  ) {
    this.tabService.hide();
    this.sendClass = this.navParams.get('sendClass');

    if (this.sendClass == 'Receipt') {
      this.image = this.navParams.get('image');
      this.locName = this.navParams.get('locName');
      this.latitude = this.navParams.get('latitude');
      this.longitude = this.navParams.get('longitude');
      this.sel_cat_id = this.navParams.get('sel_cat_id');
      this.isPrivate = this.navParams.get('isPrivate');
    }
    this.srcPhoto = this.navParams.get('image');
    this.result = this.navParams.get('imagePath');
    this.data = this.navParams.get('data');
    this.date = this.navParams.get('date');
    this.gender = this.navParams.get('gender');
  }

  ionViewDidLeave() {
    this.stopCamera();
    this.cameraPreview.hide();
  }

  ionViewWillEnter() {
    this.tabService.hide();
    this.startCamera();
  }

  takePicture() {

    const pictureOpts = {
      quality: 60,
      width: 640,
      height: 640,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
    };

    this.cameraPreview.takePicture(pictureOpts).then(imageData => {
      this.srcPhoto = "data:image/jpeg;base64," + imageData;

      this.cameraPreview.stopCamera().then(() => {

        if (this.sendClass == 'update_profile') {
          this.navCtrl.push(UpdateProfilePage, {
            image: this.srcPhoto, imagePath: this.result, data: this.data,
            date: this.date, gender: this.gender
          });
        }
        if (this.sendClass == 'profile') {
          this.navCtrl.push(ProfilePhotoPage, { image: this.srcPhoto });
        }
        if (this.sendClass == 'Receipt') {
          this.navCtrl.push(StoryCategoryPage, {
            receiptImage: this.srcPhoto, sel_cat_id: this.sel_cat_id, image: this.image, locName: this.locName,
            latitude: this.latitude, longitude: this.longitude, receipt_private: this.isPrivate
          });
        }
      });

      this.cameraPreview.hide().then(() => {

      });
    });
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
