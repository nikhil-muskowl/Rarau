import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { FormServiceProvider } from '../../../providers/form-service/form-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-show-story',
  templateUrl: 'show-story.html',
})
export class ShowStoryPage {
  title = 'Story';

  public story_id;
  public user_id;
  public paramData;
  public responseData;
  public data;
  private id;
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
  private comment;
  private commentForm: FormGroup;
  public formErrors = {
    comment: '',
  };

  private status;
  private messageTitle;
  private message;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    private formBuilder: FormBuilder,
    private formServiceProvider: FormServiceProvider,
    public LoginProvider: LoginProvider, ) {

    this.createForm();
    this.isLogin();
    this.story_id = this.navParams.get('story_id');
    this.getStories();

  }

  public createForm() {
    this.commentForm = this.formBuilder.group({
      comment: [this.comment, Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(25),
        Validators.required
      ])],
    });

    this.commentForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formServiceProvider.validateForm(this.commentForm, this.formErrors, true)
    });
  }

  getStories() {
    this.loadingProvider.present();

    this.paramData = {
      'story_id': this.story_id,
      'language_id': 1,
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
        this.comments = this.responseData.result[0].comments;
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

  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  goBack() {
    this.navCtrl.pop();
  }

  public commentStory() {
    this.loadingProvider.present();

    this.formServiceProvider.markFormGroupTouched(this.commentForm);
    if (this.commentForm.valid) {
      this.loadingProvider.present();

      console.log(this.commentForm.value.comment);

      var data = {
        'story_id': this.story_id,
        'user_id': this.user_id,
        'comment': this.commentForm.value.comment
      }

      this.storyService.setComment(data).subscribe(
        response => {
          this.responseData = response;
          console.log(this.responseData);

          this.status = this.responseData.status;
          this.message = this.responseData.message;

          if (!this.status) {
            this.messageTitle = 'Warning!';
            if (this.responseData.result) {
              this.responseData.result.forEach(element => {
                if (element.id == 'comment') {
                  this.formErrors.comment = element.text
                }
              });
            }
          } else {
            this.messageTitle = 'Sucess!';
            this.getStories();
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

    this.loadingProvider.dismiss();
  }

}
