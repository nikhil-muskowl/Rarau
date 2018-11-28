import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})

export class ReportPage {
  public title;
  public status;
  reportForm: FormGroup;
  private formData: any;

  public responseData;

  public type_id;
  public story_id;
  public story_comment_id;
  public user_id;
  public complain_by;
  public submit;
  public language_id;
  public type;
  public error_description;
  public error_title;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    public languageProvider: LanguageProvider,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider, ) {

    platform.registerBackButtonAction(() => {
      this.dismiss();
    });
    this.setText();
    this.createForm();
    this.type_id = this.navParams.get('type');
    console.log("type_id" + this.type_id);
  }

  submitReport() {
    //user
    if (this.type_id == 1) {
      this.user_id = this.navParams.get('user_id');
      this.sendUserReport();
    }
    //story
    if (this.type_id == 2) {
      this.story_id = this.navParams.get('story_id');
      this.sendStoryReport();
    }
    //comment
    if (this.type_id == 3) {
      this.story_comment_id = this.navParams.get('story_comment_id');
      this.story_id = this.navParams.get('story_id');
      this.sendCommentReport();
    }
  }

  ngOnInit() {
    this.complain_by = this.LoginProvider.isLogin();
    this.language_id = this.languageProvider.getLanguageId();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('report').subscribe((text: string) => {
      this.title = text;
    });
    this.translate.get('error_title').subscribe((text: string) => {
      this.error_title = text;
    });
    this.translate.get('error_description').subscribe((text: string) => {
      this.error_description = text;
    });
    this.translate.get('submit').subscribe((text: string) => {
      this.submit = text;
    });
  }

  createForm() {
    this.reportForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(32), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      description: ['', Validators.required],
    });
  }

  dismiss() {
    this.navCtrl.pop();
  }

  sendCommentReport() {

    this.complain_by = this.LoginProvider.isLogin();

    if (this.reportForm.valid) {
      this.loadingProvider.present();

      let params = {
        'user_id': this.complain_by,
        'language_id': this.language_id,
        'story_id': this.story_id,
        'story_comment_id': this.story_comment_id,
        'title': this.reportForm.value.title,
        'description': this.reportForm.value.description,
      };
      console.log("params : " + JSON.stringify(params));

      this.storyService.apicommentComplain(params).subscribe(
        response => {
          this.responseData = response;
          this.status = this.responseData.status;
          this.loadingProvider.dismiss();

          if (this.status) {
            console.log("responseData : " + JSON.stringify(this.responseData));

            this.reportForm.reset();
          }
        },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        }
      );
    }
  }

  sendUserReport() {
    this.complain_by = this.LoginProvider.isLogin();

    if (this.reportForm.valid) {
      this.loadingProvider.present();

      let params = {
        'user_id': this.user_id,
        'language_id': this.language_id,
        'complain_by': this.complain_by,
        'title': this.reportForm.value.title,
        'description': this.reportForm.value.description,
      };
      console.log("params : " + JSON.stringify(params));

      this.storyService.apiUserComplain(params).subscribe(
        response => {
          this.responseData = response;
          this.status = this.responseData.status;
          this.loadingProvider.dismiss();

          if (this.status) {
            console.log("responseData : " + JSON.stringify(this.responseData));

            this.reportForm.reset();
          }
        },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        }
      );
    }
  }

  sendStoryReport() {
    this.complain_by = this.LoginProvider.isLogin();
    
    if (this.reportForm.valid) {
      this.loadingProvider.present();

      let params = {
        'user_id': this.complain_by,
        'language_id': this.language_id,
        'story_id': this.story_id,
        'title': this.reportForm.value.title,
        'description': this.reportForm.value.description,
      };

      console.log("params : " + JSON.stringify(params));
      this.storyService.apiStoryComplain(params).subscribe(
        response => {
          this.responseData = response;
          this.status = this.responseData.status;
          this.loadingProvider.dismiss();

          if (this.status) {
            console.log("responseData : " + JSON.stringify(this.responseData));

            this.reportForm.reset();
          }
        },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        }
      );
    }
  }
}
