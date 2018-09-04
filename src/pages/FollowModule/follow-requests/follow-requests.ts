import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ToastProvider } from '../../../providers/toast/toast';
import { FollowProvider } from '../../../providers/follow/follow';
import { LoginProvider } from '../../../providers/login/login';

@IonicPage()
@Component({
  selector: 'page-follow-requests',
  templateUrl: 'follow-requests.html',
})
export class FollowRequestsPage {

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
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider,
    public ToastProvider: ToastProvider,
    // public NetworkProvider: NetworkProvider,
    public FollowProvider: FollowProvider) {
    // if (this.NetworkProvider.checkStatus() == true) {

    this.getData();
    // }

  }

  ionViewDidLoad() {
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  Approve(data: any, element) {

    console.log('data :' + JSON.stringify(data));
    console.log('userId :' + this.user_id);
    console.log('follower_id :' + data.id);

    if (element) {
      element.textContent = 'following';
    }

    this.ToastProvider.presentToast('Follow Request Sent');
    this.submitAttempt = true;

    this.loadingProvider.present();
    this.FollowProvider.ActionFollow(this.user_id, data.id).subscribe(
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
        this.loadingProvider.dismiss();
      }
    );
  }

  Reject(data: any, element) {

    console.log('data :' + JSON.stringify(data));
    console.log('userId :' + data.id);
    console.log('follower_id :' + this.user_id);

    if (element) {
      element.textContent = 'Requested';
      element.disabled = true;
    }

    this.ToastProvider.presentToast('Follow Request Sent');
    this.submitAttempt = true;

    this.loadingProvider.present();
    this.FollowProvider.ActionFollow(data.id, this.user_id).subscribe(
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
        this.loadingProvider.dismiss();
      }
    );
  }

  getData() {
    this.isLogin();

    this.loadingProvider.present();
    console.log('id: ' + this.LoginProvider.user_id);
    this.FollowProvider.getList(this.LoginProvider.user_id).subscribe(
      response => {
        this.records = response;
        console.log(JSON.stringify(response));
        this.data = this.records.data;
        this.binddata();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
    return event;
  }

  binddata() {
    for (let index = 0; index < this.data.length; index++) {
      this.model.push({
        id: this.data[index].id,
        user_id: this.data[index].user_id,
        user: this.data[index].user,
        follow_id: this.data[index].follow_id,
        follower: this.data[index].follower,
        follower_image: this.data[index].follower_image,
        status: this.data[index].status,
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
