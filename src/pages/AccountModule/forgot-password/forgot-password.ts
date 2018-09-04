import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { ToastProvider } from '../../../providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  submitAttempt;
  forgotForm: FormGroup;
  private formData: any;
  private responseData;
  private success;
  private error_email = 'field is required';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public formBuilder: FormBuilder,
    public loadingProvider: LoadingProvider,
    public toastProvider: ToastProvider) {

    this.forgotForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
    });
  }

  ionViewDidLoad() {

  }

  goback() {
    console.log("clicked");
    this.navCtrl.pop();
  }

  send() {
    this.submitAttempt = true;
    this.formData = this.forgotForm.valid;
    if (this.forgotForm.valid) {
      this.loadingProvider.present();

      this.loginProvider.apiForgot(this.forgotForm.value).subscribe(
        response => {
          this.responseData = response;
          console.log(response);
          this.submitAttempt = true;

          if (this.responseData.status == true) {

            this.forgotForm.reset();
            this.submitAttempt = false;
            this.toastProvider.presentToast('Email Sent, Please check your email');

            
          }
          else {
            this.toastProvider.presentToast('Email Not Found');
          }
        },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        }
      );
    }
  }

  backLogin() {
    console.log('Click performed');
    this.navCtrl.setRoot(LoginPage);
  }
  
  goBack() {
    this.navCtrl.pop();
  }
}
