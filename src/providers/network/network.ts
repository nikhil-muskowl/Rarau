import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { ToastProvider } from '../toast/toast';
import { AlertProvider } from '../alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../language/language';
import { AlertController, Alert } from 'ionic-angular';
import { App } from "ionic-angular";

declare var navigator: any;
declare var Connection: any;

@Injectable()
export class NetworkProvider {

  @ViewChild(Nav) nav: Nav;

  public connectionState;
  public networkType;
  public networkStatus = true;
  public disconnectSubscription;
  public connectSubscription;

  public network_error;
  public check_network;
  public cancel_txt;
  public reload;
  public alert: Alert;

  constructor(
    public http: HttpClient,
    public platform: Platform,
    public app: App,
    private network: Network,
    private alertProvider: AlertProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {
    this.setText();

    if (this.platform.is('cordova')) {
      this.checkNetwork();
      this.networkType = this.network.type;
    } else {
      this.networkStatus = true;
    }
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('network_error').subscribe((text: string) => {
      this.network_error = text;
    });
    this.translate.get('check_network').subscribe((text: string) => {
      this.check_network = text;
    });
    this.translate.get('cancel').subscribe((text: string) => {
      this.cancel_txt = text;
    });
    this.translate.get('reload').subscribe((text: string) => {
      this.reload = text;
    });
  }

  checkNetwork() {
    this.disconnectSubscription = this.network.onDisconnect().subscribe(data => {
      this.connectionState = data.type;
      this.networkStatus = false;
      this.displayNetworkUpdate();
      // this.reLoad();
    }, error => console.error(error));

    this.connectSubscription = this.network.onConnect().subscribe(data => {
      this.connectionState = data.type;
      this.networkStatus = true;
      // this.displayNetworkUpdate();
      // this.reLoad();
    }, error => console.error(error));
  }

  displayNetworkUpdate() {
    // this.toastCtrl.presentToast(`You are now ${this.connectionState} via ${this.networkType}`);

    // this.alertProvider.title = this.network_error;
    // this.alertProvider.message = this.check_network;
    // this.alertProvider.showAlert();

    this.alert = this.alertCtrl.create({
      title: this.network_error,
      message: this.check_network,
      buttons: [
        {
          text: this.cancel_txt,
          handler: () => {
          }
        },
      ]
    });
    this.alert.present();
  }

  checkStatus() {
    // this.disconnectSubscription.unsubscribe();
    // this.connectSubscription.unsubscribe();
    return this.networkStatus;
  }

  reLoad() {
    // this.nav.setRoot(this.nav.getActive().component);

    console.log("Page is : " + this.app.getActiveNavs());
    console.log("Root is : " + this.app.getRootNav());
    let navi = this.app.getRootNav();
    navi.setRoot(navi);
    console.log("#Page is : " + JSON.stringify(this.app.getActiveNavs()));
  }
}
