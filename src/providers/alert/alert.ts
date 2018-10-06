import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
// import { Toast } from '@ionic-native/toast';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../language/language';

@Injectable()
export class AlertProvider {

  public title;
  public subTitle;
  public message;

  public confirm;
  public want_to_continue;
  public cancel;
  public ok;

  constructor(public http: HttpClient,
    // private toast: Toast,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {
    this.setText()

  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    console.log("getLanguage() : " + this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('confirm').subscribe((text: string) => {
      this.confirm = text;
    });
    this.translate.get('want_to_continue').subscribe((text: string) => {
      this.want_to_continue = text;
    });
    this.translate.get('cancel').subscribe((text: string) => {
      this.cancel = text;
    });
    this.translate.get('ok').subscribe((text: string) => {
      this.ok = text;
    });
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: this.title,
      subTitle: this.subTitle,
      message: this.message,
      buttons: ['OK']
    });
    alert.present();
  }

  public Alert = {
    confirm: (msg?, title?) => {
      return new Promise((resolve, reject) => {
        let alert = this.alertCtrl.create({
          title: title || this.confirm,
          message: msg || this.want_to_continue,
          buttons: [
            {
              text: this.cancel,
              role: 'cancel',
              handler: () => {
                reject(false);
              }
            },
            {
              text: this.ok,
              handler: () => {
                resolve(true);
              }
            }
          ]
        });
        alert.present();
      });

    },
    alert: (msg, title?) => {
      let alert = this.alertCtrl.create({
        title: title || 'Alert',
        subTitle: msg,
        buttons: ['Dismiss']
      });

      alert.present();
    }
  }

  // showToast(msg){
  //   this.toast.show(msg,'5000','bottom').subscribe(
  //     toast => {
  //       console.log(toast);
  //     }
  //   );
  // }

}
