import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
// import { Toast } from '@ionic-native/toast';

@Injectable()
export class AlertProvider {

  public title;
  public subTitle;
  public message;

  constructor(public http: HttpClient,
    // private toast: Toast,
     public alertCtrl: AlertController,
     ) {
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
          title: title || 'Confirm',
          message: msg || 'Do you want continue?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                reject(false);
              }
            },
            {
              text: 'Ok',
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
