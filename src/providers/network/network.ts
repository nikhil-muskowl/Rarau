import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { ToastProvider } from '../../providers/toast/toast';

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

  constructor(
    public http: HttpClient,
    public platform: Platform,
    private network: Network,
    public toastCtrl: ToastProvider,
  ) {
    if (this.platform.is('cordova')) {
      this.checkNetwork();
      this.networkType = this.network.type;
    } else {
      this.networkStatus = true;
    }
  }

  checkNetwork() {
    this.disconnectSubscription = this.network.onDisconnect().subscribe(data => {
      this.connectionState = data.type;
      this.networkStatus = false;
      this.displayNetworkUpdate();
      this.reLoad();
    }, error => console.error(error));

    this.connectSubscription = this.network.onConnect().subscribe(data => {
      this.connectionState = data.type;
      this.networkStatus = true;
      this.displayNetworkUpdate();
      this.reLoad();
    }, error => console.error(error));
  }

  displayNetworkUpdate() {
    this.toastCtrl.presentToast(`You are now ${this.connectionState} via ${this.networkType}`);
  }

  checkStatus() {
    // this.disconnectSubscription.unsubscribe();
    // this.connectSubscription.unsubscribe();
    return this.networkStatus;
  }

  reLoad() {
    this.nav.setRoot(this.nav.getActive().component);
  }
}
