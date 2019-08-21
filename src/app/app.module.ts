import { DatePipe } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { CallNumber } from "@ionic-native/call-number";
import { Device } from "@ionic-native/device";
import { Diagnostic } from "@ionic-native/diagnostic";
import { FCM } from "@ionic-native/fcm";
import { File } from "@ionic-native/file";
import { FileChooser } from "@ionic-native/file-chooser";
import { IOSFilePicker } from "@ionic-native/file-picker";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { Geolocation } from "@ionic-native/geolocation";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Network } from "@ionic-native/network";
import { PhonegapLocalNotification } from "@ionic-native/phonegap-local-notification";
import { SocialSharing } from "@ionic-native/social-sharing";
import { SplashScreen } from "@ionic-native/splash-screen";
import { SQLite } from "@ionic-native/sqlite";
import { StatusBar } from "@ionic-native/status-bar";
import { Toast } from "@ionic-native/toast";
import { IonicStorageModule } from "@ionic/storage";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import {
  AngularFireDatabase,
  AngularFireDatabaseModule
} from "angularfire2/database";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { IonicImageViewerModule } from "ionic-img-viewer";
import { SuperTabsModule } from "ionic2-super-tabs";
import { LottieAnimationViewModule } from "ng-lottie";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";
import { ComponentsModule } from "../components/components.module";
import { ClassifiedsPageModule } from "../pages/classifieds/classifieds.module";
import { EventsPageModule } from "../pages/events/events.module";
import { ForumsPageModule } from "../pages/forums/forums.module";
import { LoginPageModule } from "../pages/login/login.module";
import { NoItemFoundPage } from "../pages/no-item-found/no-item-found";
import { NoItemFoundPageModule } from "../pages/no-item-found/no-item-found.module";
import { TabJobsPageModule } from "../pages/tab-jobs/tab-jobs.module";
import { TabRecommendationPageModule } from "../pages/tab-recommendation/tab-recommendation.module";
import { TabServicesPageModule } from "../pages/tab-services/tab-services.module";
import { TabsPage } from "../pages/tabs/tabs";
import { FcmControllingProvider } from "../providers/fcm-controlling/fcm-controlling";
import { GlobalItemsProvider } from "../providers/global-items/global-items";
import { LanguageProvider } from "../providers/language/language";
import { NetworkManagerProvider } from "../providers/network-manager/network-manager";
import { ChatService } from "../services/chat.service";
import { ClassifiedsService } from "../services/classifieds.service";
import { CommonApiService } from "../services/common-api.service";
import { DatabasesService } from "../services/databases.service";
import { UploadService } from "../services/file-upload.service";
import { ItemService } from "../services/item.service";
import { WebService } from "../services/non-api.service";
import { StaticSettings } from "../services/settings.service";
import { UrlUtils } from "../services/url.service";
import { MyApp } from "./app.component";
import { Camera } from "@ionic-native/camera";
//old
// var firebaseConfig = {
//   apiKey: "AIzaSyDiykAWm0NTbdRwgfY75lKSSLc19_K-aYw",
//   authDomain: "omasouq-1505559135768.firebaseapp.com",
//   databaseURL: "https://omasouq-1505559135768.firebaseio.com",
//   projectId: "omasouq-1505559135768",
//   storageBucket: "omasouq-1505559135768.appspot.com",
//   messagingSenderId: "275262437137"
// };
// old
var firebaseConfig = {
  apiKey: "AIzaSyCDKL8QmPHRvFz6Sylx0E16IlTYrQW_sO4",
  authDomain: "omasuq-5cd62.firebaseapp.com",
  databaseURL: "https://omasuq-5cd62.firebaseio.com/",
  projectId: "omasuq-5cd62",
  storageBucket: "omasuq-5cd62.appspot.com",
  messagingSenderId: "649027961014"
};
@NgModule({
  declarations: [MyApp, TabsPage, NoItemFoundPage],
  imports: [
    // PostJobsPageModule,
    IonicImageViewerModule,
    Ng4GeoautocompleteModule,
    LottieAnimationViewModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, { tabsPlacement: "top" }),
    SuperTabsModule.forRoot(),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    // ClassifiedShowAllPrmotionsPageModule,
    // AccountPageModule,
    ClassifiedsPageModule,
    // AddEventsPageModule,
    // AdsPostedPageModule,
    // ClassifiedsAddListPageModule,
    EventsPageModule,
    // EventsInnerPageModule,
    TabJobsPageModule,
    TabRecommendationPageModule,
    // ForumInnerPageModule,
    ForumsPageModule,
    // InnerClassifiedsPageModule,
    LoginPageModule,
    // OtpPageModule,
    // PostClassifiedsPageModule,
    // PostForumsPageModule,
    // ProfileSettingsPageModule,
    // RegisterPageModule,
    // TouristViewALlPageModule,
    // UpdatePasswordPageModule,
    // ViewAllClassifiedsPageModule,
    ComponentsModule,
    // ChatLogPageModule,
    // FavouritesPageModule,
    // ChatInnerPageModule,
    // PromotionsPageModule,
    // SavedEventsPageModule,
    // EditDeletePageModule,
    // EditClassifiedsPageModule,
    // EditForumsPageModule,
    // EditEventsPageModule,
    // ContactUsPageModule,
    // AboutUsPageModule,
    // SuggestPopupPageModule,
    // SearchresultPageModule,
    // SuggestPageHotelPageModule,
    // SuggestPageThingsToDoPageModule,
    // SuggestPageAttractionPageModule,
    NoItemFoundPageModule,
    TabServicesPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, TabsPage],
  providers: [
    FCM,
    StatusBar,
    SplashScreen,
    ClassifiedsService,
    WebService,
    ItemService,
    StaticSettings,
    ChatService,
    CommonApiService,
    UrlUtils,
    DatabasesService,
    AngularFireDatabase,
    UploadService,
    SQLite,
    SocialSharing,
    Geolocation,
    Toast,
    Diagnostic,
    DatePipe,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FcmControllingProvider,
    FcmControllingProvider,
    PhonegapLocalNotification,
    Network,
    GlobalItemsProvider,
    NetworkManagerProvider,
    InAppBrowser,
    File,
    Device,
    FileChooser,
    IOSFilePicker,
    FileTransfer,
    CallNumber,
    LanguageProvider,
    FileTransfer,
    FileTransferObject,
    Camera
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}

