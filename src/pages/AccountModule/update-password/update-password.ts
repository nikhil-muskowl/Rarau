import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfilePage } from '../../MainModule/profile/profile';
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-update-password',
  templateUrl: 'update-password.html',
})
export class UpdatePasswordPage {
  private error_password = 'field is required';
  public error_conf_password = 'field is required';
  submitAttempt;
  upPassForm: FormGroup;
  private formData: any;
  private responseData;
  private message;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public formBuilder: FormBuilder,
    public loadingProvider: LoadingProvider, ) {

      this.upPassForm = formBuilder.group({
        password: ['', Validators.required],
        passconf: ['', Validators.required]
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePasswordPage');
  }

  updatePass() {
    this.submitAttempt = true;
    this.formData = this.upPassForm.valid;

    if (this.upPassForm.valid) {
      this.loadingProvider.present();
      this.loginProvider.apiUpdatePassword(this.upPassForm.value).subscribe(
        response => {
          this.responseData = response;
          console.log(response);
          this.submitAttempt = true;

          if (this.responseData.status == true) {
            this.message = this.responseData.message;
            this.alertProvider.title = 'Success';
            this.alertProvider.message = this.message;
            this.alertProvider.showAlert();
            this.upPassForm.reset();
            this.submitAttempt = false;
            this.navCtrl.setRoot(ProfilePage);
          }


        },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        }
      );
    }
  }
}
