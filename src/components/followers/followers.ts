import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { ToastProvider } from '../../providers/toast/toast';
import { FollowProvider } from '../../providers/follow/follow';
import { LoginProvider } from '../../providers/login/login';
import { OthersProfilePage } from '../../pages/AccountModule/others-profile/others-profile';
import { NetworkProvider } from '../../providers/network/network';

@Component({
  selector: 'followers',
  templateUrl: 'followers.html'
})
export class FollowersComponent {
  @Input('userid') user_id;

  public current_user_id;

  public pageStart = 0;
  public pageLength = 5;
  public recordsTotal;
  public filterData;
  public model: any[] = [];


  public records;
  public data;
  public name;
  public responseData;
  public params;
  public success;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public LoginProvider: LoginProvider,
    public ToastProvider: ToastProvider,
    public FollowProvider: FollowProvider,
    public loadingProvider: LoadingProvider,
    public network: NetworkProvider,
  ) {
  }

  ngOnChanges() {
    this.isLogin();
    console.log(this.user_id);
    if (this.network.checkStatus() == true) {
      this.getData();
    }
  }

  isLogin() {
    if (this.LoginProvider.isLogin()) {
      this.current_user_id = this.LoginProvider.isLogin();
    } else {
      this.current_user_id = 0;
    }
  }

  getData() {
    this.loadingProvider.present();
    this.filterData = {
      'start': this.pageStart,
      'length': this.pageLength,
      'user_id': this.user_id,
      'current_user_id': this.current_user_id
    };

    console.log('user_id: ' + this.user_id);
    console.log('current_user_id: ' + this.current_user_id);
    this.FollowProvider.getFollowersList(this.filterData).subscribe(
      response => {
        this.records = response;
        this.recordsTotal = this.records.recordsTotal;
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
        name: this.data[index].name,
        image: this.data[index].image,
        status: this.data[index].status,
      });
    }
  }

  goBack() {
    this.navCtrl.pop();
  }

  getFollowerProfile(data: any) {
    console.log('Follower Id : ' + data.user_id);
    this.navCtrl.push(OthersProfilePage, { id: data.user_id });
  }

  onScrollDown(infiniteScroll) {
    if (this.pageStart <= this.recordsTotal) {
      this.pageStart += this.pageLength;
      this.getData();
    }

    infiniteScroll.complete();
  }

}
