import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { ToastProvider } from '../../../providers/toast/toast';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

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
  private rarau;
  private forgot_password;
  private forgot_pass;
  private pro_reg_email;
  private we_send_mail;
  private prob_acc;
  private send;
  private contact_us;
  private email_not_found;
  private check_email;
  private error_email;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public formBuilder: FormBuilder,
    public platform: Platform,
    public loadingProvider: LoadingProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
    public toastProvider: ToastProvider) {

    platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.setText();

    this.forgotForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
    });


  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('forgot_password').subscribe((text: string) => {
      this.forgot_password = text;
    });
    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('forgot_pass').subscribe((text: string) => {
      this.forgot_pass = text;
    });
    this.translate.get('pro_reg_email').subscribe((text: string) => {
      this.pro_reg_email = text;
    });
    this.translate.get('we_send_mail').subscribe((text: string) => {
      this.we_send_mail = text;
    });
    this.translate.get('prob_acc').subscribe((text: string) => {
      this.prob_acc = text;
    });
    this.translate.get('send').subscribe((text: string) => {
      this.send = text;
    });
    this.translate.get('contact_us').subscribe((text: string) => {
      this.contact_us = text;
    });
    this.translate.get('email_not_found').subscribe((text: string) => {
      this.email_not_found = text;
    });
    this.translate.get('check_email').subscribe((text: string) => {
      this.check_email = text;
    });
    this.translate.get('error_email').subscribe((text: string) => {
      this.error_email = text;
    });

  }

  goback() {
    console.log("clicked");
    this.navCtrl.pop();
  }

  sendForm() {
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
            this.toastProvider.presentToast(this.check_email);


          }
          else {
            this.toastProvider.presentToast(this.email_not_found);
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
