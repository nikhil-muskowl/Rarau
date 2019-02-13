import { Component, createPlatformFactory } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//provider
import { ProfileProvider } from '../../../providers/profile/profile';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ContactValidator } from '../../../validators/contact';
import { LoginProvider } from '../../../providers/login/login';
import { LoginPage } from '../../AccountModule/login/login';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  public user_id;
  public email;
  public contact;
  public name;

  submitAttempt;
  editProfileForm: FormGroup;
  private formData: any;
  private status;
  private message;
  private result;
  private responseData;

  // errors
  private error_name = 'field is required';
  private error_email = 'field is required';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loadingProvider: LoadingProvider,
    public alertProvider: AlertProvider,
    public profileUpdate: ProfileProvider,
    public LoginProvider: LoginProvider,
    public platform: Platform) {

    let backAction = platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    }, 2);

    this.name = this.navParams.data.name;
    this.email = this.navParams.get('email');
    this.user_id = this.navParams.get('id');

    this.createForm();
  }

  //save profile data
  save() {
    this.submitAttempt = true;
    if (this.editProfileForm.valid) {
      this.loadingProvider.present();

      this.formData = this.editProfileForm.valid;
      this.profileUpdate.apiUpdateProfile(this.editProfileForm.value, this.user_id).subscribe(
        response => {

          this.responseData = response;
          console.log("responseData" + JSON.stringify(this.responseData));
          this.submitAttempt = true;

          if (this.responseData.status) {
            this.result = this.responseData.result;
            console.log("Result" + this.result);
          }

          if (this.responseData.message != '') {
            // console.log("message" + JSON.stringify(this.message));
            // this.message = this.responseData.message;
            // this.alertProvider.title = 'Success';
            // this.alertProvider.message = this.message;
            // this.alertProvider.showAlert();

            this.submitAttempt = false;

            this.LoginProvider.unSetData();
            this.navCtrl.setRoot(LoginPage);

          }

          if (this.responseData.error_firstname != '') {
            this.editProfileForm.controls['name'].setErrors({ 'incorrect': true });
            this.error_name = this.responseData.error_firstname;
          }

          if (this.responseData.error_email != '') {
            this.editProfileForm.controls['email'].setErrors({ 'incorrect': true });
            this.error_email = this.responseData.error_email;
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

  //create and validate form
  createForm() {
    this.editProfileForm = this.formBuilder.group({
      name: [this.name, Validators.compose([Validators.maxLength(32), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: [this.email, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
    });
  }
}
