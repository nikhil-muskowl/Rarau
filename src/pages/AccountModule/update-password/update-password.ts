import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfilePage } from '../../MainModule/profile/profile';
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-update-password',
  templateUrl: 'update-password.html',
})
export class UpdatePasswordPage {
  private error_password;
  public error_confirm;
  submitAttempt;
  upPassForm: FormGroup;
  private formData: any;
  private responseData;
  private message;

  private confirm_password;
  private password;
  private sucess;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public formBuilder: FormBuilder,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.setText();
    this.upPassForm = formBuilder.group({
      password: ['', Validators.required],
      passconf: ['', Validators.required]
    });

  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('confirm_password').subscribe((text: string) => {
      this.confirm_password = text;
    });
    this.translate.get('password').subscribe((text: string) => {
      this.password = text;
    });
    this.translate.get('sucess').subscribe((text: string) => {
      this.sucess = text;
    });
    this.translate.get('error_password').subscribe((text: string) => {
      this.error_password = text;
    });
    this.translate.get('error_confirm').subscribe((text: string) => {
      this.error_confirm = text;
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
            this.alertProvider.title = this.sucess;
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
