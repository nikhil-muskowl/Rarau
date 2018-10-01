import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { LoadingProvider } from '../../../providers/loading/loading';
import { HomePage } from '../../MainModule/home/home';
import { DomSanitizer } from "@angular/platform-browser";
import { AlertProvider } from '../../../providers/alert/alert';
import { ConfigProvider } from '../../../providers/config/config';
import { LoginProvider } from '../../../providers/login/login';
import { TabsService } from "../../util/tabservice";
import { UploadReceiptPage } from "../upload-receipt/upload-receipt";

@IonicPage()
@Component({
  selector: 'page-story-category',
  templateUrl: 'story-category.html',
})

export class StoryCategoryPage {

  private status;
  private message;
  private responseData;
  private categories;
  public image;
  public images = [];
  public model = [];
  public catModal = [];
  public sel_cat_id = [];
  public name;
  public email;
  public contact;
  public user_id;
  private formData: any;
  private tags = [];
  private error_tags = 'field is required';
  private latitude;
  private longitude;
  private locName;
  private receipt_private;
  private receiptImage;
  public paramData;

  public btnGo = 1;
  public btnname = 'Publish';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sanitizer: DomSanitizer,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    public cofigPro: ConfigProvider,
    private tabService: TabsService,
    public LoginProvider: LoginProvider, ) {



    this.isLogin();
    this.sel_cat_id = this.navParams.get('sel_cat_id');
    this.image = this.navParams.get('image');
    this.locName = this.navParams.get('locName');
    this.latitude = this.navParams.get('latitude');
    this.longitude = this.navParams.get('longitude');
    this.receipt_private = this.navParams.get('receipt_private');
    this.receiptImage = this.navParams.get('receiptImage');
    console.log('receipt_private : ' + this.receipt_private);
    if (this.sel_cat_id != undefined) {
      this.catModal = this.sel_cat_id;
      console.log('catModal : ' + this.catModal);
    }
    console.log('sel_cat_id : ' + this.sel_cat_id);
    console.log('receiptImage : ' + this.receiptImage);
    console.log('image : ' + this.image);
    this.setCategory();
    this.bindtags();
  }

  ionViewDidLoad() {
  }

  setCategory() {

    this.loadingProvider.present();

    this.storyService.getCategory().subscribe(
      response => {
        this.responseData = response;
        console.log('Category : ' + JSON.stringify(response));

        this.categories = this.responseData.data;
        this.bindList();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  selectCat(category, index) {

    if (this.model[index].isImage) {
      this.model[index].isImage = false;
      if (category.is_upload == 1) {
        this.receipt_private = 0;
        this.receiptImage = '';
      }
    } else {
      this.model[index].isImage = true;

    }

    this.bindArray();

    console.log(category);
    if (category.is_upload == 1) {

      this.navCtrl.push(UploadReceiptPage, {
        sel_cat_id: this.sel_cat_id,
        image: this.image,
        locName: this.locName,
        latitude: this.latitude,
        longitude: this.longitude
      });

    }
  }

  bindArray() {
    this.catModal = [];
    for (let index = 0; index < this.model.length; index++) {
      if (this.model[index].isImage) {
        this.catModal.push(this.model[index].id);
      }
    }
    this.sel_cat_id = this.catModal;
    console.log('selected items : ' + JSON.stringify(this.catModal));
    console.log('selected sel_cat_id items : ' + JSON.stringify(this.sel_cat_id));
  }

  bindList() {
    for (let index = 0; index < this.categories.length; index++) {

      if (this.sel_cat_id != undefined && this.sel_cat_id.indexOf(this.categories[index].id) >= 0) {
        this.model.push({
          id: this.categories[index].id,
          title: this.categories[index].title,
          is_upload: this.categories[index].is_upload,
          isImage: 1,
        });
      } else {
        this.model.push({
          id: this.categories[index].id,
          title: this.categories[index].title,
          is_upload: this.categories[index].is_upload,
          isImage: 0,
        });
      }


    }


  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  ionViewDidLeave() {

    // this.tabService.show();
  }

  saveStory() {
    if (this.btnGo == 1) {
      if (this.catModal.length > 0) {
        if (this.tags.length > 0) {
          this.loadingProvider.present();
          this.images.push({ image: this.image });

          if (this.receipt_private == undefined) {
            this.receipt_private = 0;
          }
          this.paramData = {
            'tags': this.tags,
            'images': this.images,
            'user_id': this.user_id,
            'catId': this.catModal,
            'locName': this.locName,
            'latitude': this.latitude,
            'longitude': this.longitude,
            'receipt_private': this.receipt_private,
            'receipt': this.receiptImage
          };

          this.storyService.postStory(this.paramData).subscribe(
            response => {
              this.responseData = response;
              this.status = this.responseData.status;
              this.message = this.responseData.message;

              if (this.responseData.status) {
                this.alertProvider.title = 'Success';
                this.alertProvider.message = this.message;
                this.alertProvider.showAlert();

                this.tabService.show();
                this.navCtrl.setRoot(HomePage);
              }
            },
            err => console.error(err),
            () => {
              this.loadingProvider.dismiss();
            }
          );
        }
        else {
          this.alertProvider.title = 'Error!';
          this.alertProvider.message = 'Write someting field can\'t be blank';
          this.alertProvider.showAlert();
        }
      }
      else {
        this.alertProvider.title = 'Error!';
        this.alertProvider.message = 'Please Choose Category';
        this.alertProvider.showAlert();
      }
    }
    else {
      console.log('Click on Next');
    }
  }

  back() {
    this.navCtrl.pop();
  }

  bindtags() {
    for (let index = 0; index < this.tags.length; index++) {
      var tag = this.tags[index];
      if (tag.charAt(0) != '#') {
        tag = '#' + tag;
      }
      this.tags.splice(index, 1, tag);
    }
  }

  onChange() {
    this.bindtags();
    console.log(this.tags);
  }

  verifyTag(str: string): boolean {
    return str !== 'ABC' && str.trim() !== '';
  }
}
