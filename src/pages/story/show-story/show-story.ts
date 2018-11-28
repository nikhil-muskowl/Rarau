import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { FormServiceProvider } from '../../../providers/form-service/form-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { ReportPage } from '../../Popover/report/report';

@IonicPage()
@Component({
  selector: 'page-show-story',
  templateUrl: 'show-story.html',
})
export class ShowStoryPage {

  public story_id;
  public user_id;
  public paramData;
  public responseData;
  public data;
  public commResponseData;
  public commData;
  private id;
  private language_id;
  private user_name;
  private user_image_thumb;
  private description;
  private html;
  private image;
  private tags;
  private comments;
  private totalLikes;
  private totalDislikes;
  private totalFlames;
  private created_date;
  private comment_txt;
  private commentForm: FormGroup;
  public formErrors = {
    comment: '',
  };

  private status;
  private messageTitle;
  private message;

  private title;
  private warning;
  private success;
  private rarau;
  private report_comment;
  private apo_story;
  private say_something;
  private isComment: boolean = false;
  private forbidden;
  private login_to_continue;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    private formBuilder: FormBuilder,
    private formServiceProvider: FormServiceProvider,
    public LoginProvider: LoginProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

  }

  ngOnInit() {
    this.language_id = this.languageProvider.getLanguageId();
    this.user_id = this.LoginProvider.isLogin();
    this.setText();

    this.createForm();
    this.story_id = this.navParams.get('story_id');
    this.getStories();
    this.getComments();

    if (this.user_id != undefined) {
      this.isComment = true;
    }
    else {
      this.isComment = false;
    }

  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('story').subscribe((text: string) => {
      this.title = text;
    });
    this.translate.get('warning').subscribe((text: string) => {
      this.warning = text;
    });
    this.translate.get('success').subscribe((text: string) => {
      this.success = text;
    });
    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('apo_story').subscribe((text: string) => {
      this.apo_story = text;
    });
    this.translate.get('say_something').subscribe((text: string) => {
      this.say_something = text;
    });
    this.translate.get('comment').subscribe((text: string) => {
      this.comment_txt = text;
    });
    this.translate.get('report_comment').subscribe((text: string) => {
      this.report_comment = text;
    });
    this.translate.get('forbidden').subscribe((text: string) => {
      this.forbidden = text;
    });
    this.translate.get('login_to_continue').subscribe((text: string) => {
      this.login_to_continue = text;
    });
  }

  public createForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(25),
        Validators.required
      ])],
    });

    this.commentForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formServiceProvider.validateForm(this.commentForm, this.formErrors, true)
    });
  }

  goToStory(event: any): any {
    this.navCtrl.pop();
  }

  reportComment(id) {
    console.log("comment id : " + id);
    let params = {
      'story_comment_id': id,
      'story_id': this.story_id,
      'type': 3
    };

    this.navCtrl.push(ReportPage, params);
  }

  getStories() {
    this.loadingProvider.present();

    this.paramData = {
      'story_id': this.story_id,
      'language_id': this.language_id,
    };

    this.storyService.getStoryDetail(this.paramData).subscribe(
      response => {
        this.responseData = response;

        this.data = this.responseData.result;
        this.responseData.result[0].totalDislikes;
        console.log('story data : ' + JSON.stringify(this.data));
        this.title = this.responseData.result[0].title;
        this.description = this.responseData.result[0].description;
        this.user_name = this.responseData.result[0].user_name;
        this.user_image_thumb = this.responseData.result[0].user_image_thumb;
        this.html = this.responseData.result[0].html;
        this.image = this.responseData.result[0].image_thumb;
        this.tags = this.responseData.result[0].tags;
        this.totalLikes = this.responseData.result[0].totalLikes;
        this.totalDislikes = this.responseData.result[0].totalDislikes;
        this.totalFlames = this.responseData.result[0].totalFlames;
        this.created_date = this.responseData.result[0].created_date;
        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  getComments() {
    this.loadingProvider.present();
    this.commData = [];
    this.paramData = {
      'story_id': this.story_id,
      'language_id': this.language_id,
    };

    this.storyService.apiGetComments(this.paramData).subscribe(
      response => {
        this.commResponseData = response;
        this.commData = this.commResponseData.data;
        console.log('comment commResponseData : ' + JSON.stringify(this.commResponseData));
        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowStoryPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  public commentStory() {
    this.user_id = this.LoginProvider.isLogin();

    if (this.user_id) {
      this.loadingProvider.present();

      this.formServiceProvider.markFormGroupTouched(this.commentForm);

      if (this.commentForm.valid) {
        this.loadingProvider.present();

        console.log(this.commentForm.value.comment);

        var data = {
          'story_id': this.story_id,
          'user_id': this.user_id,
          'comment': this.commentForm.value.comment,
          'language_id': this.language_id,
        }

        this.storyService.setComment(data).subscribe(
          response => {
            this.responseData = response;
            console.log(this.responseData);

            this.status = this.responseData.status;
            this.message = this.responseData.message;

            if (!this.status) {
              this.messageTitle = this.warning;
              if (this.responseData.result) {
                this.responseData.result.forEach(element => {
                  if (element.id == 'comment') {
                    this.formErrors.comment = element.text
                  }
                });
              }
            } else {
              this.messageTitle = this.success;
              this.getStories();
              this.getComments();
            }

            this.loadingProvider.dismiss();
            this.commentForm.reset();
          },
          err => {
            console.error(err);
            this.loadingProvider.dismiss();
          }
        );
      } else {
        this.formErrors = this.formServiceProvider.validateForm(this.commentForm, this.formErrors, false);
      }
    }
    else {
      this.alertProvider.title = this.forbidden;
      this.alertProvider.message = this.login_to_continue;
      this.alertProvider.showAlert();
    }
    this.loadingProvider.dismiss();
  }

}
