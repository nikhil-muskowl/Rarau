import { Component, ViewChild } from "@angular/core";
import { NgClass } from '@angular/common';
import { App, Content, NavController, Platform, ViewController } from "ionic-angular";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraPreview } from "@ionic-native/camera-preview";
import { ShowPhotoPage } from "../show-photo/show-photo";
import { PhotoLibrary } from "@ionic-native/photo-library";
import { ImageService } from "../../util/imageservice";
import { ImageEntity } from "../../util/ImageEntity";
import { UnsplashItUtil } from "../../util/unsplashItutil";
import { TabsService } from "../../util/tabservice";
import { HomePage } from "../../MainModule/home/home"
import { LoadingProvider } from "../../../providers/loading/loading";
import { ImagePicker } from '@ionic-native/image-picker';

@Component({
  selector: 'page-manage-photo',
  templateUrl: 'manage-photo.html',
})
export class ManagePhotoPage {
  recording: boolean = false;
  srcPhoto;
  segment = "gallery";
  images = [];
  selectedPhoto;

  @ViewChild(Content)
  content: Content;

  constructor(public navCtrl: NavController,
    public cameraPreview: CameraPreview,
    public camera: Camera,
    public platform: Platform,
    private photoLibrary: PhotoLibrary,
    private imageService: ImageService,
    private viewController: ViewController,
    private unsplash: UnsplashItUtil,
    private app: App,
    private loadingProvider: LoadingProvider,
    private tabService: TabsService,
    private imagePicker: ImagePicker,
  ) {

    let backAction = platform.registerBackButtonAction(() => {
      console.log("second");
      this.stopCamera();
      this.navCtrl.setRoot(HomePage);
    }, 2);


    let self = this;

    // this.selectImage();
  }

  flashMode = "off";

  changeSegment(value) {
    this.segment = value;

    if (value == "photo" || value == 'video') {
      this.startCamera();
    } else {
      this.stopCamera();
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

  takePicture() {

    let self = this;
    // if (this.segment === 'video') {
    //   if (!this.recording) {
    //     this.recording = true;
    //     let options: CaptureVideoOptions = { limit: 1, duration: 60 };
    //     this.mediaCapture.captureVideo(options)
    //       .then(
    //         (data: MediaFile[]) => {
    //           console.log(data);
    //           this.recording = false;
    //         },
    //         (err: CaptureError) => {
    //           console.error(err)
    //           this.recording = false;
    //         }
    //       );
    //   }

    // }

    if (this.segment === 'photo') {

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

      this.cameraPreview.startCamera(pictureOpts).then(
        (res) => {
          console.log(res)
        },
        (err) => {
          console.log(err)
        });

      this.cameraPreview.takePicture(pictureOpts).then(base64PictureData => {
        self.srcPhoto = "data:image/jpeg;base64," + base64PictureData;
        self.cameraPreview.stopCamera().then(() => {
          this.navCtrl.push(ShowPhotoPage, { photo: self.srcPhoto });
        });

        self.cameraPreview.hide().then(() => {

        });
      });
    }
  }

  selectImage() {

    this.tabService.hide();

    // this.loadingProvider.show();
    this.images = [];
    let options = {
      maximumImagesCount: 1,
    }

    //for open gallery
    this.imagePicker.getPictures(options).then((results) => {
      // for (var i = 0; i < results.length; i++) {
      //   console.log('Image URI: ' + results[i]);

      // }
      this.selectedPhoto = results;
      this.navCtrl.push(ShowPhotoPage, { photo: this.selectedPhoto });
    }, (err) => { });

    if (this.segment == 'photo') {
      this.startCamera();
    }

  }

  ionViewWillEnter() {

    this.selectImage();

    //for open gallery
    // this.photoLibrary.requestAuthorization().then(() => {
    //   this.photoLibrary.getLibrary().subscribe({
    //     next: library => {
    //       library.forEach((libraryItem) => {

    //         this.images.push({ thumbnailUrl: libraryItem.thumbnailURL, mediumSizeUrl: libraryItem.thumbnailURL });

    //       });
    //     },
    //     error: err => {
    //       console.log('could not get photos');
    //       this.loadingProvider.hide();
    //     },
    //     complete: () => {
    //       this.loadingProvider.hide();
    //       console.log('done getting photos');
    //       this.selectedPhoto = this.images[0].mediumSizeUrl;
    //     }
    //   });
    // })
    //   .catch(err => {
    //     console.log('permissions weren\'t granted', err)
    //     this.loadingProvider.hide();


    //   });

  }

  ionViewDidLeave() {

    this.tabService.show();
  }

  ionViewWillLeave() {
    this.stopCamera();
  }

  goToPhoto() {
    this.navCtrl.push(ShowPhotoPage, { photo: this.selectedPhoto });
  }

  changePhoto(newImage) {

    this.selectedPhoto = newImage.mediumSizeUrl;
    this.content.scrollToTop(300);

  }


  back() {
    try {

      this.tabService.show();
      // this.startCamera();
      this.stopCamera();
      this.navCtrl.parent.select(0);
      // this.app.getRootNav().getActiveChildNav().select(0);
      // this.viewController.dismiss();
    } catch (e) {
    }
  }

  stopCamera() {
    try {
      this.cameraPreview.stopCamera().catch(e => {

      });
    } catch (e) {
    }
  }

  getPosition() {
    return (this.platform.height() / 1.9) - 20
  }

  getHeight() {
    return this.platform.height() - this.getPosition() - 64;
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
      height: this.platform.height() / 1.9,
      toBack: true,
      previewDrag: false,
      tapPhoto: true
    }).then(() => {
      console.log("camera started")

    }).catch(() => {
      console.log("camera error")
    })

  }

  refresh() {
    this.cameraPreview.switchCamera();
  }

}
