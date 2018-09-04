import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { UpdateProfilePage } from '../update-profile/update-profile';
import { LoginWechatPage } from '../login-wechat/login-wechat';
import { TabsService } from "../../util/tabservice";
import { TermsPage } from "../../Popover/terms/terms";
import { BirthdayPage } from "../../Popover/birthday/birthday";
import { WhyProfilePage } from "../../Popover/why-profile/why-profile";

//provider
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ContactValidator } from '../../../validators/contact';

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {
  submitAttempt;
  registerForm: FormGroup;
  private formData: any;
  private status;
  private result;
  private responseData;
  public gender_id = 0;
  public uploadIcon;
  public uploadText;
  public data;
  //form fields
  public fname;
  public femail;
  public fpassword;
  public fconfpass;
  // variables 
  private id;
  private imagePath;
  private image;
  private text_message;
  public date: String;
  // errors
  private error_name = 'field is required';
  private error_email = 'field is required';
  private error_password = 'field is required';
  private error_confirm = 'field is required';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private loginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    private tabService: TabsService,
    public platform: Platform, ) {

    let backAction = platform.registerBackButtonAction(() => {
      this.tabService.show();
      this.navCtrl.setRoot(LoginPage);
    }, 2);

    this.date = new Date().toISOString().split('T')[0];
    this.createForm();

    this.image = this.navParams.get('image');
    this.imagePath = this.navParams.get('imagePath');
    this.data = this.navParams.get('data');
    this.gender_id = this.navParams.get('gender');
    console.log('reg gender_id : ' + this.gender_id);

    if (this.gender_id == 1) {
      //Male
      this.maleimage = 'assets/icon/male_black.png';
      this.male_color = '#000';
      this.femaleimage = 'assets/icon/female_white.png'
      this.female_color = '#fff';
    }
    else if (this.gender_id == 2) {
      //Female
      this.maleimage = 'assets/icon/male_white.png';
      this.male_color = '#fff';
      this.femaleimage = 'assets/icon/female_black.png';
      this.female_color = '#000';
    }
    else {
      //Default
      this.maleimage = 'assets/icon/male_white.png';
      this.male_color = '#fff';
      this.femaleimage = 'assets/icon/female_white.png';
      this.female_color = '#fff';
    }
    if (this.data != undefined) {
      this.fname = this.data.name;
      this.femail = this.data.email;
      this.fpassword = this.data.password;
      this.fconfpass = this.data.passconf;
      this.date = this.navParams.get('date');
    }

    if (this.imagePath != undefined) {
      this.uploadIcon = 'assets/imgs/login/right-arrow.png';
      this.uploadText = 'View & Edit';
    }
    else {
      this.uploadIcon = 'assets/imgs/login/upload-icon.png';
      this.uploadText = 'Upload here';
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
  }

  save() {
    this.submitAttempt = true;
    console.log(this.registerForm.valid);

    console.log(this.imagePath);
    if (this.registerForm.valid) {

      if (this.imagePath != undefined) {
        this.loadingProvider.present();

        this.formData = this.registerForm.valid;

        this.loginProvider.apiRegister(this.registerForm.value, this.gender_id, this.date,
          this.imagePath).subscribe(
            response => {

              this.responseData = response;

              this.submitAttempt = true;

              if (this.responseData.status) {
                this.result = this.responseData.result;
                this.id = this.result.id;
                this.registerForm.reset();
                this.submitAttempt = false;
                this.navCtrl.setRoot(LoginPage);
              }

              if (this.responseData.text_message != '') {
                this.text_message = this.responseData.text_message;
                this.alertProvider.title = 'Success';
                this.alertProvider.message = this.text_message;
                this.alertProvider.showAlert();
              }

              if (this.responseData.error_firstname != '') {
                this.registerForm.controls['name'].setErrors({ 'incorrect': true });
                this.error_name = this.responseData.error_firstname;
              }

              if (this.responseData.error_email != '') {
                this.registerForm.controls['email'].setErrors({ 'incorrect': true });
                this.error_email = this.responseData.error_email;
              }


              if (this.responseData.error_password != '') {
                this.registerForm.controls['password'].setErrors({ 'incorrect': true });
                this.error_password = this.responseData.error_password;
              }

              if (this.responseData.error_confirm != '') {
                this.registerForm.controls['passconf'].setErrors({ 'incorrect': true });
                this.error_confirm = this.responseData.error_confirm;
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
        this.alertProvider.title = 'Error';
        this.alertProvider.message = 'Please Upload Image.';
        this.alertProvider.showAlert();
      }
    }
  }

  ionViewWillEnter() {
    this.tabService.hide();
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(32), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      password: ['', Validators.required],
      passconf: ['', Validators.required],
      date: ['', ''],
      upload: ['', ''],
    });
  }

  public maleimage = 'assets/icon/male_white.png';
  public male_color;
  manClick() {
    if (this.gender_id != 1) {
      this.maleimage = 'assets/icon/male_black.png';
      this.male_color = '#000';
      this.femaleimage = 'assets/icon/female_white.png'
      this.female_color = '#fff';
      this.gender_id = 1;
    }
    else {
      this.maleimage = 'assets/icon/male_white.png';
      this.male_color = '#fff';
      this.gender_id = 0;
    }

    console.log('Gender Id : ' + this.gender_id);

  }

  public femaleimage = 'assets/icon/female_white.png';
  public female_color;
  womanClick() {

    if (this.gender_id != 2) {
      this.maleimage = 'assets/icon/male_white.png';
      this.male_color = '#fff';
      this.femaleimage = 'assets/icon/female_black.png';
      this.female_color = '#000';
      this.gender_id = 2;
    } else {
      this.femaleimage = 'assets/icon/female_white.png';
      this.female_color = '#fff';
      this.gender_id = 0;
    }


    console.log('Gender Id : ' + this.gender_id);
  }

  ondateChange() {
    console.info("Selected Date:", this.date);
  }

  goToWechat() {
    this.navCtrl.push(LoginWechatPage);
  }

  updateProfile() {
    this.navCtrl.push(UpdateProfilePage, {
      image: this.image, imagePath: this.imagePath, data: this.registerForm.value,
      date: this.date, gender: this.gender_id
    });
  }

  goBack() {
    this.tabService.show();
    this.navCtrl.setRoot(LoginPage);
  }

  gototerms() {
    this.navCtrl.push(TermsPage);
  }

  gotobirthday() {
    this.navCtrl.push(BirthdayPage);
  }

  gotoprofile() {
    this.navCtrl.push(WhyProfilePage);
  }
}
