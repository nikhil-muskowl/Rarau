import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ToastProvider } from '../../../providers/toast/toast';
import { PeopleProvider } from '../../../providers/people/people';
import { LoginProvider } from '../../../providers/login/login';
// import { NetworkProvider } from '../../../providers/network/network';

@IonicPage()
@Component({
  selector: 'page-people',
  templateUrl: 'people.html',
})
export class PeoplePage {
  submitAttempt;
  public records;
  public data;
  public btn_text;
  public model: any[] = [];
  public name;
  public user_id;
  public responseData;
  public params;
  public success;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loader: LoadingProvider,
    public LoginProvider: LoginProvider,
    public ToastProvider: ToastProvider,
    // public NetworkProvider: NetworkProvider,
    public people: PeopleProvider) {
    // if (this.NetworkProvider.checkStatus() == true) {
    this.getData();
    // }

    this.isLogin();
  }

  ionViewDidLoad() {
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  follow(data: any, element) {

    console.log('data :' + JSON.stringify(data));
    console.log('userId :' + this.user_id);
    console.log('follower_id :' + data.id);

    if (element) {
      element.textContent = 'Requested';
      element.disabled = true;
    }

    this.ToastProvider.presentToast('Follow Request Sent');
    this.submitAttempt = true;

    this.loader.present();
    this.people.sendFollow(this.user_id, data.id).subscribe(
      response => {
        this.responseData = response;
        console.log(response);
        this.submitAttempt = true;

        if (this.responseData.status == true) {
          this.success = this.responseData.message;
          this.submitAttempt = false;
        }
      },
      err => console.error(err),
      () => {
        this.loader.dismiss();
      }
    );


  }

  getData() {
    this.loader.present();

    this.people.getList().subscribe(
      response => {
        this.records = response;
        this.data = this.records.data;
        this.binddata();
      },
      err => console.error(err),
      () => {
        this.loader.dismiss();
      }
    );
    return event;
  }

  binddata() {
    for (let index = 0; index < this.data.length; index++) {
      this.model.push({
        id: this.data[index].id,
        name: this.data[index].name,
        email: this.data[index].email,
        contact: this.data[index].contact,
        status: this.data[index].status,
        requested: this.data[index].requested,
      });

      if (this.data[index].requested == true) {
        this.btn_text = 'Requested';
      }
      else {
        this.btn_text = 'Follow';
      }
    }
  }

  onScrollDown(infiniteScroll) {
    if (this.data.length > 0) {
      // this.pageStart += this.pageLength;

      this.getData();
    }
    infiniteScroll.complete();
  }
}
