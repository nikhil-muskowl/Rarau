import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { ToastProvider } from '../../../providers/toast/toast';
import { FollowProvider } from '../../../providers/follow/follow';
import { LoginProvider } from '../../../providers/login/login';
import { OthersProfilePage } from '../../AccountModule/others-profile/others-profile';

@IonicPage()
@Component({
  selector: 'page-followers',
  templateUrl: 'followers.html',
})
export class FollowersPage {

  public pageStart = 0;
  public pageLength = 5;
  public recordsTotal;
  public filterData;

  title = 'Followers';
  submitAttempt;
  public records;
  public data;
  public model: any[] = [];
  public name;
  public user_id;
  public responseData;
  public params;
  public success;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public LoginProvider: LoginProvider,
    public ToastProvider: ToastProvider,
    public FollowProvider: FollowProvider,
    public loadingProvider: LoadingProvider, ) {

    this.isLogin();
    this.getData();
  }

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowersPage');
  }

  getData() {

    this.loadingProvider.present();
    this.filterData = { 'start': this.pageStart, 'length': this.pageLength, 'user_id': this.user_id };

    console.log('id: ' + this.user_id);
    this.FollowProvider.getFollowersList(this.filterData).subscribe(
      response => {

        this.records = response;
        this.recordsTotal = this.records.recordsTotal;
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
    this.navCtrl.push(OthersProfilePage, { id: data.id });
  }

  onScrollDown(infiniteScroll) {
    if (this.pageStart <= this.recordsTotal) {
      this.pageStart += this.pageLength;
      this.getData();
    }

    infiniteScroll.complete();
  }

}
