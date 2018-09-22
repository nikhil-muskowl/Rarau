import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { LoginProvider } from '../../../providers/login/login';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  private error_srcLoc = 'field is required';
  private error_srcUser = 'field is required';
  searchForm: FormGroup;
  private formData: any;
  searchLocation;
  searchUser;
  public paramData;
  public user_id;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public storyService: StoryServiceProvider,
    public LoginProvider: LoginProvider,
    private view: ViewController,
    public formBuilder: FormBuilder, ) {

    this.createForm();
  }

  createForm() {
    this.searchForm = this.formBuilder.group({
      searchLocation: ['', Validators.required],
      searchUser: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  searchLoc(event) {
    event.stopPropagation();
    this.searchLocation = this.searchForm.value.searchLocation;
    console.log('searchLocation: ' + this.searchLocation);

    if (this.searchForm.value.searchLocation != '') {

      this.searchForm.reset();

      const data = {
        search: this.searchLocation
      };
      this.view.dismiss(data);
    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

  closeModal() {
    const data = {
      search: this.searchUser
    };
    this.view.dismiss(data);
  }

  searchUsercat(event) {
    event.stopPropagation();
    this.searchUser = this.searchForm.value.searchUser;
    console.log('searchUser: ' + this.searchUser);

    if (this.searchForm.value.searchUser != '') {

      this.searchForm.reset();

      const data = {
        search: this.searchUser
      };
      this.view.dismiss(data);

    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

}
