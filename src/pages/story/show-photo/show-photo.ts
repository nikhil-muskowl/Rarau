import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Platform } from 'ionic-angular';
import { filter } from "rxjs/operator/filter";
import { StoryCategoryPage } from '../../story/story-category/story-category'
import { LocationPage } from '../../story/location/location'
import { FilterService } from "../../util/filterservice";
import { LoadingProvider } from '../../../providers/loading/loading';
import { TabsService } from "../../util/tabservice";
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-show-photo',
  templateUrl: 'show-photo.html',
})
export class ShowPhotoPage {

  filter;
  filters = [
    { name: "normal", class: "normal", filter: "" },
    { name: "clarendon", class: "clarendon", filter: "contrast(1.2) saturate(1.35)" },
    { name: "moon", class: "moon", filter: "grayscale(1) contrast(1.1) brightness(1.1)" },
    { name: "reyes", class: "reyes", filter: "sepia(.22) brightness(1.1) contrast(.85) saturate(.75)" },
    { name: "aden", class: "aden", filter: "hue-rotate(-20deg) contrast(.9) saturate(.85) brightness(1.2)" },
    { name: "xpro2", class: "xpro2", filter: "sepia(.3)" },
    { name: "lofi", class: "lofi", filter: "saturate(1.1) contrast(1.5)" },
    { name: "inkwell", class: "inkwell", filter: "sepia(.3) contrast(1.1) brightness(1.1) grayscale(1)" },
    { name: "1997", class: "_1977", filter: " contrast(1.1) brightness(1.1) saturate(1.3)" },
  ];

  customFilters = [
    { name: "brightness", filter: "brightness", icon: "ios-sunny-outline" },
    { name: "contrast", filter: "contrast", icon: "ios-contrast-outline" },
    { name: "saturation", filter: "saturate", icon: "ios-water-outline" },
    { name: "fade", filter: "opacity", icon: "ios-cloud-outline" },
    // {name: "shadows", icon: "ios-star-half-outline"},
  ]

  private story_type_id;
  src;
  user: any;
  story: boolean = false;
  mode = "filter"
  tempFlter = ""
  imageStyleFilter = "";
  brightness = 0;
  contrast = 0;
  saturation = 0;
  fade = 0;
  actualView = "default";
  title;

  filter_txt;
  next_txt;
  cancel_txt;
  done_txt;

  @ViewChild(Content)
  content: Content;

  @ViewChild("imageFilter")
  image: HTMLImageElement;
  private hasEvent;

  private backupFilter = "";
  private backupVariable;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private filterService: FilterService,
    public platform: Platform,
    // public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider,
    private tabService: TabsService,
    // public storyService: StoryService,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
  ) {

    this.platform.registerBackButtonAction(() => {
      this.back();
    });


    this.setText();
    this.tabService.hide();

    this.story_type_id = this.navParams.get('story_type_id');
    this.src = this.navParams.get('photo');
    let story = this.navParams.get('story');

    if (story)
      this.story = story;
    this.filterService.init()
    this.filter = this.filters[0]
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('filter').subscribe((text: string) => {
      this.filter_txt = text;
    });
    this.translate.get('next').subscribe((text: string) => {
      this.next_txt = text;
    });
    this.translate.get('cancel').subscribe((text: string) => {
      this.cancel_txt = text;
    });
    this.translate.get('done').subscribe((text: string) => {
      this.done_txt = text;
    });
  }

  //when view will be enter in page
  ionViewWillEnter() {

    // this.dataProvider.getCurrentUser().subscribe((user) => {
    //   this.user = <any>user;
    //   console.log(this.user)
    // });
  }

  //change view when filter apply
  changeView(newView, title) {

    this.backupFilter = this.getCurrentFilter();
    this.backupVariable = this[newView];

    setTimeout(() => {
      this.actualView = newView;
      this.title = title;
      this.content.resize();
      ///your code here
    }, 1);

  }

  // Our tracking function
  public trackByFunction(index, item) {
    // here we will provide the item id
    if (!item) return null;

    return item.name;
  }

  //goto previous page
  back() {

    if (this.isCustomFilter()) {
      this.changeView("edit", "");
    } else {
      this.navCtrl.pop();
    }
  }

  //on pressing filter
  press($event) {

    let image = (<HTMLImageElement>document.getElementById("imageFilter"))
    this.imageStyleFilter = image.style.filter;
    image.style.filter = ""
    this.tempFlter = this.filter;

    this.filter = "";
    console.log("press", $event)
    this.hasEvent = true;
  }

  //go to 
  end() {
    if (this.hasEvent) {
      this.filter = this.tempFlter;
      let image = (<HTMLImageElement>document.getElementById("imageFilter"))
      image.style.filter = this.imageStyleFilter;

      console.log("end")
      this.hasEvent = false;
    }
  }

  //getting image and take to next page
  next() {

    var c = (<HTMLDivElement>document.getElementById("imageFilter3"));
    var c2 = (<HTMLCanvasElement>document.getElementById("imageFilter2"));

    let img = this.findImage();

    c2.width = img.naturalWidth;
    c2.height = img.naturalHeight;

    console.log("next");
    console.error();

    var self = this;
    (<any>window).rasterizeHTML.drawHTML(c.innerHTML, c2).then(function success(renderResult) {
      var image = c2.toDataURL("image/*");
      console.log(self.story);
      if (self.story) {
        self.loadingProvider.show();
        // self.storyService.addStory({
        //   image: image,
        //   userName: self.user.name,
        //   userPhoto: self.user.img
        // });
        self.navCtrl.popToRoot();

      } else {
        self.navCtrl.push(LocationPage, { image: image, story_type_id: this.story_type_id });
      }

    }, function error(e) {
      console.log(e);
    });

    // var ctx = c.getContext("2d");
  }

  //checking for custom filter or not
  isCustomFilter() {
    return this.customFilters.findIndex(item => this.actualView == item.name) > -1;
  }

  //checking for custom filters is used or not
  isFilterUsed(filter) {
    return this.filterService.getCustomFilters().findIndex(item => item == filter) > -1
  }

  //change from custom and fixed filter
  changeSegment(value) {
    this.actualView = value;
  }

  //changing filter
  changeFilter(newFilter) {
    this.filter = newFilter;
    let currentFilter = this.getCurrentFilter();
    let filter = this.filterService.getStyleFilter(currentFilter, newFilter.filter, false);
    this.applyFilter(filter);
  }

  //apply filter on image
  applyFilter(filter: string) {
    let image = this.findImage();
    image.style.filter = filter;
  }

  //find image
  findImage(): HTMLImageElement {
    return (<HTMLImageElement>document.getElementById("imageFilter"));
  };

  //getting currently used filter
  getCurrentFilter() {
    let currentFilter = "";
    let image = this.findImage();
    if (image.style) {
      currentFilter = image.style.filter;
    }

    return currentFilter;
  }

  //cancel all editing
  cancel() {

    let editView = 'edit';

    this.applyFilter(this.backupFilter);

    if (!this.filterService.areadyExistsChange(this.actualView, this.backupFilter)) {
      this[this.actualView] = null;
      this.filterService.removeCustomFilter(this.actualView, this.backupFilter);
    } else {
      this[this.actualView] = this.backupVariable;
    }

    this.backupFilter = "";

    setTimeout(() => {
      this.actualView = editView;
      this.content.resize();
    }, 1);

  }

  //on complete editing
  done() {
    let editView = 'edit';
    setTimeout(() => {
      this.actualView = editView;
      this.content.resize();
    }, 1);
  }
}
