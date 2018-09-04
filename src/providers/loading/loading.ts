import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class LoadingProvider {
  public content = 'Loading please wait...';
  private loading: Loading;
  private spinner = {
    spinner: 'circles'
  };

  constructor(public http: HttpClient, public loadingCtrl: LoadingController) {
  }

  present() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: this.content
      });
      this.loading.present();
    }
  }

  dismiss() {
    if (this.loading) {
      this.loading.dismiss().catch();
      this.loading = null;
    }
  }

  //Show loading
  show() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create(this.spinner);
      this.loading.present();
    }
  }

  //Hide loading
  hide() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
}
