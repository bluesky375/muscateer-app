import { Geolocation } from "@ionic-native/geolocation";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Diagnostic } from "@ionic-native/diagnostic";
import { FCM } from "@ionic-native/fcm";
import { Storage } from "@ionic/storage";
import { AngularFireAuth } from "angularfire2/auth";
import {
  Content,
  NavController,
  Platform,
  ToastController,
  Tab,
  Events
} from "ionic-angular";
import { MenuController } from "ionic-angular/components/app/menu-controller";
import { CommonApiService } from "../../services/common-api.service";
import { ClassifiedsPage } from "../classifieds/classifieds";
import { EventsPage } from "../events/events";
import { ForumsPage } from "../forums/forums";
import { LoginPage } from "../login/login";
import { TabJobsPage } from "../tab-jobs/tab-jobs";
import { TabRecommendationPage } from "../tab-recommendation/tab-recommendation";
import { TabServicesPage } from "../tab-services/tab-services";
import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
import { DatabasesService } from "./../../services/databases.service";
import { Keyboard } from "ionic-angular";

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage implements OnInit {
  @ViewChild("contentRef") content: Content;
  // contentHandle: Content;
  toggle: boolean = true;
  tab1Root = ClassifiedsPage;
  tab2Root = ForumsPage;
  tab3Root = EventsPage;
  tab4Root = TabRecommendationPage;
  tab5Root = TabServicesPage;
  tab6Root = TabJobsPage;
  myInput: string = null;
  userId: any = {};
  shouldShowCancel = false;
  f_token: string;
  tabIndex = 0;
  toggleIcon() {
    this.toggle = !this.toggle;
    this.content.resize();
  }
  pushMessage: string = "push message will be displayed here";
  private topOrBottom: string;
  private contentBox;
  constructor(
    public events: Events,
    public keyboard: Keyboard,
    public geolocation: Geolocation,
    public service: DatabasesService,
    private fbAuth: AngularFireAuth,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    private storage: Storage,
    private platform: Platform,
    public toastCtrl: ToastController,
    public global_items: GlobalItemsProvider,
    public apiService: CommonApiService,
    public FCMPlugin: FCM,
    private diagnostic: Diagnostic
  ) {}
  ionViewDidEnter() {
    this.content.resize();
  }
  ngOnInit() {
    this.set_up_direction();
    this.getPermission();
    this.getVersionCode();
    this.fireToken();
    this.fetchUserId();
    this.menuCtrl.enable(true, "myMenu");
  }
  // scrolling(event) {
  //   // your content here for scrolling
  //   console.log("scrolling", event);
  // }
  set_up_direction() {
    this.storage
      .get("app_direction")
      .then(res => {
        console.log("tab-setup direction", res);
        this.global_items.App_direction = res;
        this.platform.setDir(res, true);
        this.storage.set("app_direction", res);
      })
      .catch(err => {
        console.log("setup direction -tabs", err);
      });
  }
  fireToken() {
    this.apiService.get("user/fire-auth-token").subscribe(res => {
      if (res) {
        this.f_token = res.data;
        console.log(this.f_token);
        this.authenticateUser();
      }
    });
  }

  authenticateUser() {
    this.fbAuth.auth
      .signInWithCustomToken(this.f_token)
      .then(res => console.log("Auth"))
      .catch(err => console.error("ERROR WHILE AUTHENTICATING USER"));
  }

  moveToFav() {
    // if (this.userId) {
    //   this.navCtrl.push(FavouritesPage);
    // } else {
    //   this.navCtrl.push(LoginPage);
    // }
    this.navCtrl.push("NotificationhistoryPage");
    // if (this.userId) {
    //   this.navCtrl.push("NotificationhistoryPage");
    // } else {
    //   this.navCtrl.push(LoginPage);
    // }
  }

  moveToProfile() {
    let token = this.service.accessToken();
    if (token.hasOwnProperty("access")) {
      this.navCtrl.push("AccountPage");
    } else {
      this.navCtrl.push(LoginPage);
    }

    // let token = this.service.accessToken();
    // console.log(token);
    // if (Object.keys(token).length > 0) {
    //   this.navCtrl.push(AccountPage);
    // } else {
    //   this.navCtrl.push(LoginPage);
    // }
    // if (this.userId) {
    //   this.navCtrl.push(AccountPage);
    // } else {
    //   this.navCtrl.push(LoginPage);
    // }
  }
  postAdd() {
    let token = this.service.accessToken();
    if (token.hasOwnProperty("access")) {
      this.navCtrl.push("ClassifiedsAddListPage");
    } else {
      this.navCtrl.push(LoginPage);
    }
    // let token = this.service.accessToken();
    // console.log(token);
    // if (Object.keys(token).length > 0) {
    //   this.navCtrl.push(ClassifiedsAddListPage);
    // } else {
    //   this.navCtrl.push(LoginPage);
    // }
    // this.navCtrl.push(ClassifiedsAddListPage);
  }

  fetchUserId() {
    this.storage.get("id").then(val => {
      this.userId = val;
    });
  }

  onInput(ev) {
    let val = ev.target.value;
    console.log(val);
    if (val) {
      this.search();
    }
  }
  onCancel() {
    this.myInput = "";
  }
  search() {
    console.log("1212");
    console.log(this.myInput);
    let val = this.myInput;
    if (val != null) {
      this.navCtrl.push("SearchresultPage", {
        val: val
      });
      this.myInput = null;
    }
  }
  getVersionCode() {
    let data = {
      version: this.global_items.App_version
    };
    this.apiService.postData(data, "version").subscribe(
      res => {
        console.log("appversion res");
        console.log(res);
        if (res.data == 0) {
          this.navCtrl.setRoot("ForceUpdatePage");
        } else {
        }
      },
      err => {
        console.log("app version error");
        console.log(err);
      }
    );
  }
  getPermission() {
    return new Promise(resolve => {
      let permission_list = [
        this.diagnostic.permission.WRITE_EXTERNAL_STORAGE,
        this.diagnostic.permission.READ_EXTERNAL_STORAGE,
        this.diagnostic.permission.ACCESS_COARSE_LOCATION,
        this.diagnostic.permission.ACCESS_FINE_LOCATION,
        this.diagnostic.permission.CALL_PHONE
      ];
      this.diagnostic.getPermissionsAuthorizationStatus(permission_list).then(
        status => {
          if (status != this.diagnostic.permissionStatus.GRANTED) {
            this.diagnostic
              .requestRuntimePermissions(permission_list)
              .then(data => {
                console.log("AuthorizationStatus");
                console.log(data);
                let p_status = 0;
                for (var key in data) {
                  if (data.hasOwnProperty(key)) {
                    console.log(key + " -> " + data[key]);
                    if (data[key] == "GRANTED") {
                      p_status++;
                    }
                  }
                }

                if (p_status == 5) {
                  console.log("Permission Done", p_status);
                  resolve(true);
                } else {
                  resolve(false);
                  this.global_items
                    .showAlert(
                      "Oops",
                      "Please Grant Permissions for better performance",
                      "error"
                    )
                    .then(() => {
                      this.getPermission();
                    });
                }
              });
          } else {
            console.log("We have the permission");
            resolve(true);
          }
        },
        statusError => {
          console.log(`statusError`);
          console.log(statusError);
          resolve(false);
          this.global_items.showToast(
            "Please Grant Permissions for better performance"
          );
        }
      );
    });
  }
  update_location() {
    this.navCtrl.push("UpdateLocationPage");
  }
  do_search(input_value) {
    // this.global_items.App_global_search_input = input_value;
    console.log(input_value);
    this.keyboard.close();
    switch (this.tabIndex) {
      case 0:
        {
          console.log("tab index", this.tabIndex);
          this.events.publish("user:search_in_classifieds");
        }
        break;
      case 1:
        {
          console.log("tab index", this.tabIndex);
          this.events.publish("user:search_in_forums");
        }
        break;
      case 2:
        {
          console.log("tab index", this.tabIndex);
          if (this.global_items.tab_events_head == "todays") {
            this.events.publish("user:search_in_events_todays");
          } else {
            this.events.publish("user:search_in_events_upcoming");
          }
        }
        break;
      case 3:
        {
          console.log("tab index", this.tabIndex);
          this.events.publish("user:search_in_recommendations");
        }
        break;
      case 4:
        {
          console.log("tab index", this.tabIndex);
          this.events.publish("user:search_in_services");
        }
        break;
      case 5:
        {
          console.log("tab index", this.tabIndex);
          if (this.global_items.tab_job_head == "jobs available") {
            this.events.publish("user:search_in_jobs_available");
          } else {
            this.events.publish("user:search_in_jobs_wanted");
          }
        }
        break;
      default:
        break;
    }
  }
  tabSelected(tab: Tab) {
    this.tabIndex = tab.index;
    this.global_items.App_global_search_input = "";
  }
}
