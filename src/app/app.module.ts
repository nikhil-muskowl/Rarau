import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { Device } from '@ionic-native/device';
import { DatePipe } from '@angular/common';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera } from '@ionic-native/camera';
import { CameraPreview } from '@ionic-native/camera-preview';
import { PhotoLibrary } from '@ionic-native/photo-library';
//Main module
import { MyApp } from './app.component';
import { MainTabsPage } from '../pages/MainModule/main-tabs/main-tabs';
import { HomePage } from '../pages/MainModule/home/home';
import { RankingPage } from '../pages/MainModule/ranking/ranking';
import { ProfilePage } from '../pages/MainModule/profile/profile';
import { OthersProfilePage } from '../pages/AccountModule/others-profile/others-profile';
import { EditProfilePage } from '../pages/MainModule/edit-profile/edit-profile';
import { ProfilePhotoPage } from '../pages/MainModule/profile-photo/profile-photo';
import { SettingsPage } from '../pages/MainModule/settings/settings';
import { TutorialPage } from '../pages/MainModule/tutorial/tutorial';
import { ActivityLogsPage } from '../pages/MainModule/activity-logs/activity-logs';
import { SplashPage } from '../pages/MainModule/splash/splash';

//Account module
import { LoginPage } from '../pages/AccountModule/login/login';
import { RegistrationPage } from '../pages/AccountModule/registration/registration';
import { ForgotPasswordPage } from '../pages/AccountModule/forgot-password/forgot-password';
import { UpdatePasswordPage } from '../pages/AccountModule/update-password/update-password';
import { LoginWechatPage } from '../pages/AccountModule/login-wechat/login-wechat';
import { UpdateProfilePage } from '../pages/AccountModule/update-profile/update-profile';
import { CameraOpenPage } from '../pages/AccountModule/camera-open/camera-open';
import { AlertModalPage } from '../pages/AccountModule/alert-modal/alert-modal';

//Story module
import { ShowPhotoPage } from '../pages/story/show-photo/show-photo';
import { LocationPage } from '../pages/story/location/location';
import { StoryCategoryPage } from '../pages/story/story-category/story-category';
import { GalleryPage } from '../pages/story/gallery/gallery';
import { ShowStoryPage } from '../pages/story/show-story/show-story';
import { StoryListPage } from '../pages/story/story-list/story-list';
import { StoryScreenPage } from '../pages/story/story-screen/story-screen';
import { StoryTopListPage } from '../pages/story/story-top-list/story-top-list';
import { SavedStoriesPage } from '../pages/story/saved-stories/saved-stories';
import { SingleStoryPage } from '../pages/story/single-story/single-story';
import { UploadReceiptPage } from '../pages/story/upload-receipt/upload-receipt';
import { ReceiptShowPage } from '../pages/story/receipt-show/receipt-show';
//Services
import { ImageService } from '../pages/util/imageservice';
import { UnsplashItUtil } from '../pages/util/unsplashItutil';
import { FilterService } from '../pages/util/filterservice';
import { TabsService } from '../pages/util/tabservice';

//Search Module
import { SearchResultPage } from '../pages/SearchModule/search-result/search-result';
import { SearchPage } from '../pages/SearchModule/search/search';

//MyPet
import { MyPetPage } from '../pages/MyPet/my-pet/my-pet';
import { MyPetDetailsPage } from '../pages/MyPet/my-pet-details/my-pet-details';
//providers
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpModule } from '@angular/http';
import { NetworkProvider } from '../providers/network/network';
import { ToastProvider } from '../providers/toast/toast';
import { LoginProvider } from '../providers/login/login';
import { ImagePicker } from '@ionic-native/image-picker';
import { AlertProvider } from '../providers/alert/alert';
import { ConfigProvider } from '../providers/config/config';
import { LoadingProvider } from '../providers/loading/loading';
import { PeopleProvider } from '../providers/people/people';
import { FollowProvider } from '../providers/follow/follow';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { IonTagsInputModule } from "ionic-tags-input";
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { BaiduProvider } from '../providers/baidu/baidu';
import { BaiduMapModule } from 'angular2-baidu-map'
import { IonicSwipeAllModule } from 'ionic-swipe-all';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormServiceProvider } from '../providers/form-service/form-service';
import { LanguageProvider } from '../providers/language/language';
import { MyPetProvider } from '../providers/my-pet/my-pet';

//Events
import { CreateEventPage } from '../pages/Events/create-event/create-event';
import { EventDetailsPage } from '../pages/Events/event-details/event-details';
import { EventListPage } from '../pages/Events/event-list/event-list';
import { EventModalPage } from '../pages/Events/event-modal/event-modal';

//PopOvers
import { BirthdayPage } from '../pages/Popover/birthday/birthday';
import { TermsPage } from '../pages/Popover/terms/terms';
import { WhyProfilePage } from '../pages/Popover/why-profile/why-profile';
import { ReportPage } from '../pages/Popover/report/report';

//Pipes 
import { StoryServiceProvider } from '../providers/story-service/story-service';
import { ProfileProvider } from '../providers/profile/profile';
import { SearchResProvider } from '../providers/search-res/search-res';

//components
import { StoryComponent } from '../components/story/story';
import { FollowingComponent } from '../components/following/following';
import { RankingComponent } from '../components/ranking/ranking';
import { FollowersComponent } from '../components/followers/followers';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { EventProvider } from '../providers/event/event';
import { CameraUtilsProvider } from '../providers/camera-utils/camera-utils';
import { NotiProvider } from '../providers/noti/noti';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/language/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    MainTabsPage,
    HomePage,
    LoginPage,
    RegistrationPage,
    ForgotPasswordPage,
    UpdatePasswordPage,
    RankingPage,
    ProfilePage,
    OthersProfilePage,
    ShowPhotoPage,
    EditProfilePage,
    LocationPage,
    StoryCategoryPage,
    LoginWechatPage,
    GalleryPage,
    UpdateProfilePage,
    CameraOpenPage,
    AlertModalPage,
    BirthdayPage,
    TermsPage,
    WhyProfilePage,
    SearchResultPage,
    MyPetPage,
    ShowStoryPage,
    StoryListPage,
    StoryTopListPage,
    StoryScreenPage,
    ProfilePhotoPage,
    StoryComponent,
    FollowingComponent,
    RankingComponent,
    FollowersComponent,
    ProgressBarComponent,
    SavedStoriesPage,
    SearchPage,
    SingleStoryPage,
    UploadReceiptPage,
    ReceiptShowPage,
    SettingsPage,
    TutorialPage,
    ReportPage,
    MyPetDetailsPage,
    ActivityLogsPage,
    SplashPage,
    CreateEventPage,
    EventDetailsPage,
    EventListPage,
    EventModalPage,
  ],
  imports: [
    HttpClientModule,
    IonicSwipeAllModule,
    BaiduMapModule.forRoot({ ak: 'j7eig5KpXzk4YsWNwpagmybjL2WRGCZC' }),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    HttpModule,
    IonTagsInputModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: HomePage, name: 'Home', segment: 'home' },
        { component: RankingPage, name: 'Ranking', segment: 'ranking' },
        { component: ProfilePage, name: 'Profile', segment: 'profile' },
        { component: UpdatePasswordPage, name: 'UpdatePasswordPage', segment: 'UpdatePasswordPage' },
        { component: ForgotPasswordPage, name: 'ForgotPasswordPage', segment: 'ForgotPasswordPage' },
        { component: LoginPage, name: 'LoginPage', segment: 'LoginPage' },
        { component: RegistrationPage, name: 'RegistrationPage', segment: 'RegistrationPage' },
        { component: OthersProfilePage, name: 'OthersProfilePage', segment: 'OthersProfilePage' },
        { component: ShowPhotoPage, name: 'ShowPhotoPage', segment: 'ShowPhotoPage' },
      ]
    })
  ],
  exports: [
    TranslateModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MainTabsPage,
    HomePage,
    LoginPage,
    RegistrationPage,
    ForgotPasswordPage,
    UpdatePasswordPage,
    RankingPage,
    ProfilePage,
    OthersProfilePage,
    ShowPhotoPage,
    EditProfilePage,
    LocationPage,
    StoryCategoryPage,
    LoginWechatPage,
    GalleryPage,
    UpdateProfilePage,
    CameraOpenPage,
    AlertModalPage,
    BirthdayPage,
    TermsPage,
    WhyProfilePage,
    SearchResultPage,
    MyPetPage,
    ShowStoryPage,
    StoryListPage,
    StoryTopListPage,
    StoryScreenPage,
    ProfilePhotoPage,
    StoryComponent,
    FollowingComponent,
    RankingComponent,
    FollowersComponent,
    ProgressBarComponent,
    SavedStoriesPage,
    SearchPage,
    SingleStoryPage,
    UploadReceiptPage,
    ReceiptShowPage,
    SettingsPage,
    TutorialPage,
    ReportPage,
    MyPetDetailsPage,
    ActivityLogsPage,
    SplashPage,
    CreateEventPage,
    EventDetailsPage,
    EventListPage,
    EventModalPage
  ],
  providers: [
    StatusBar,
    BackgroundGeolocation,
    Geolocation,
    SplashScreen,
    Network,
    NetworkProvider,
    ToastProvider,
    InAppBrowser,
    AppAvailability,
    Device,
    DatePipe,
    Camera,
    CameraPreview,
    PhotoLibrary,
    NativeStorage,
    Toast,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    ConfigProvider,
    AlertProvider,
    LoadingProvider,
    PeopleProvider,
    NativeGeocoder,
    LocationTrackerProvider,
    BaiduProvider,
    FollowProvider,
    ImageService,
    ImagePicker,
    UnsplashItUtil,
    FilterService,
    TabsService,
    StoryServiceProvider,
    FileTransfer,
    FileTransferObject,
    File,
    ProfileProvider,
    SearchResProvider,
    FormServiceProvider,
    LanguageProvider,
    MyPetProvider,
    ScreenOrientation,
    EventProvider,
    CameraUtilsProvider,
    NotiProvider,
  ]
})

export class AppModule { }