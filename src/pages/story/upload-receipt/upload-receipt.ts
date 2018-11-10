import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from "@angular/platform-browser";
import { TabsService } from "../../util/tabservice";
import { CameraOpenPage } from '../../AccountModule/camera-open/camera-open';
import { StoryCategoryPage } from '../story-category/story-category';
import { AlertProvider } from '../../../providers/alert/alert';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

//provider
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';

@IonicPage()
@Component({
  selector: 'page-upload-receipt',
  templateUrl: 'upload-receipt.html',
})
export class UploadReceiptPage {

  public images;
  public srcPhoto;
  public imgSend;
  public responseData;
  public status;
  public result;
  public data;
  public image;
  public locName;
  public latitude;
  public longitude;
  private recipt_show;
  private receipt_private;
  public receiptImage;
  public sel_cat_id;
  public index_id;

  public flashMode = "off";

  public rarau;
  public error;
  public select_img_first;
  public show_rec_public;
  public upload;
  public submit;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public sanitizer: DomSanitizer,
    private tabService: TabsService,
    private imagePicker: ImagePicker,
    public alertProvider: AlertProvider,
    public camera: Camera,
    private loginProvider: LoginProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.setText();
    if (this.srcPhoto != undefined) {
      this.receiptImage = this.srcPhoto;
      this.imgSend = this.srcPhoto;
    }
    else {
      this.receiptImage = "assets/icon/user.png";
    }

    this.index_id = this.navParams.get('index_id');
    this.sel_cat_id = this.navParams.get('sel_cat_id');
    this.image = this.navParams.get('image');
    this.locName = this.navParams.get('locName');
    this.latitude = this.navParams.get('latitude');
    this.longitude = this.navParams.get('longitude');
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('error').subscribe((text: string) => {
      this.error = text;
    });
    this.translate.get('select_img_first').subscribe((text: string) => {
      this.select_img_first = text;
    });
    this.translate.get('show_rec_public').subscribe((text: string) => {
      this.show_rec_public = text;
    });
    this.translate.get('submit').subscribe((text: string) => {
      this.submit = text;
    });
    this.translate.get('upload').subscribe((text: string) => {
      this.upload = text;
    });
  }

  ionViewWillEnter() {
    this.tabService.hide();
  }

  updateReceipt() {
    if (this.receipt_private) {
      this.recipt_show = 1;
    }
    else {
      this.recipt_show = 0;
    }
    console.log('Receipt privacy is : ' + this.receipt_private);

  }

  goBack() {
    this.navCtrl.push(StoryCategoryPage, {
      receipt: this.result,
      sel_cat_id: this.sel_cat_id,
      index_id: this.index_id,
      isPrivate: this.recipt_show,
      image: this.image,
      locName: this.locName,
      latitude: this.latitude,
      longitude: this.longitude
    });
  }

  save() {
    //code to save
    console.log('select : ' + this.imgSend);
    if (this.imgSend == undefined) {
      this.alertProvider.title = this.error;
      this.alertProvider.message = this.select_img_first;
      this.alertProvider.showAlert();
    }
    else {

      this.navCtrl.push(StoryCategoryPage, {
        receiptImage: this.imgSend,
        sel_cat_id: this.sel_cat_id,
        index_id: this.index_id,
        receipt_private: this.recipt_show,
        image: this.image,
        locName: this.locName,
        latitude: this.latitude,
        longitude: this.longitude
      });
    }
  }

  openCamera() {
    this.navCtrl.push(CameraOpenPage, {
      receipt: this.result,
      image: this.image,
      locName: this.locName,
      latitude: this.latitude,
      longitude: this.longitude,
      sel_cat_id: this.sel_cat_id,
      index_id: this.index_id,
      isPrivate: this.recipt_show,
      sendClass: 'Receipt'
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
      this.receiptImage = 'data:image/jpeg;base64,' + imageData;
      this.imgSend = this.receiptImage;
    }, (err) => {
      // Handle error
    });
  }
}
