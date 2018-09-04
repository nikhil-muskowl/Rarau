import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationPage } from '../registration/registration';
import { ProfilePage } from '../../MainModule/profile/profile';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { LoginWechatPage } from '../login-wechat/login-wechat';

//provider
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  submitAttempt;
  loginForm: FormGroup;
  private formData: any;
  private status;
  private message;
  private responseData;
  private responseDbData;
  private error_email = 'field is required';
  private error_password = 'field is required';
  private success;
  private error_warning;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private loginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
  ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      password: ['', Validators.required]
    });

    if (this.loginProvider.user_id) {
      this.navCtrl.setRoot(ProfilePage);
    }
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToRegsiter() {
    this.navCtrl.push(RegistrationPage);
  }

  save() {

    this.submitAttempt = true;
    this.formData = this.loginForm.valid;

    if (this.loginForm.valid) {

      this.loadingProvider.present();
      this.loginProvider.apiLogin(this.loginForm.value).subscribe(
        response => {

          this.responseData = response;
          console.log(response);

          if (this.responseData.status == true && this.responseData.message != '') {
            this.success = this.responseData.message;
            this.alertProvider.title = 'Success';
            this.alertProvider.message = this.success;
            this.alertProvider.showAlert();
            this.loginForm.reset();
            this.submitAttempt = false;
            this.loginProvider.setData(this.responseData.result);
            this.navCtrl.setRoot(ProfilePage);
          }
          else if (this.responseData.status == false) {
            this.alertProvider.title = 'Failed';
            this.alertProvider.message = 'Email or password is incorrect!';
            this.alertProvider.showAlert();
          }

        },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        }
      );
    }
  }

  forgotPass() {
    this.navCtrl.push(ForgotPasswordPage);
  }

  goToWechat() {
    this.navCtrl.push(LoginWechatPage);
  }
}
