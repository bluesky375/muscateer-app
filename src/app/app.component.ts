import { Component, ViewChild } from "@angular/core";
import { Diagnostic } from "@ionic-native/diagnostic";
import { FCM } from "@ionic-native/fcm";
import { Network } from "@ionic-native/network";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Storage } from "@ionic/storage";
import {
  AlertController,
  App,
  Events,
  IonicApp,
  ModalController,
  Nav,
  Platform,
  ToastController
} from "ionic-angular";
import { MenuController } from "ionic-angular/components/app/menu-controller";
import { LoginPage } from "../pages/login/login";
import { TabsPage } from "../pages/tabs/tabs";
import { FcmControllingProvider } from "../providers/fcm-controlling/fcm-controlling";
import { GlobalItemsProvider } from "../providers/global-items/global-items";
import { NetworkManagerProvider } from "../providers/network-manager/network-manager";
import { CommonApiService } from "../services/common-api.service";
import { DatabasesService } from "../services/databases.service";
declare const FCMPlugin: any;
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;
  rootPage: any;
  alert_isshown = false;
  alert;
  pages: Array<{
    title: string;
    component: any;
  }>;
  islogout = false;
  private baseUrl = "http://www.test.com";
  private isOnline = false;
  nav_show_auth_item;
  constructor(
    public ionic_app: IonicApp,
    public network_manager: NetworkManagerProvider,
    private diagnostic: Diagnostic,
    public alertCtrl: AlertController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public service: DatabasesService,
    public menuCtrl: MenuController,
    public apiService: CommonApiService,
    private fcm: FCM,
    private storage: Storage,
    public fcm_controlling: FcmControllingProvider,
    public toastCtrl: ToastController,
    public events: Events,
    public network: Network,
    private platform: Platform,
    public global_item: GlobalItemsProvider,
    public app: App,
    public modalctrl: ModalController
  ) {
    console.log("BEGINING OF APP");
    this.initializeApp();
    // console.log("on notification--");
    this.platform.registerBackButtonAction(() => {
      let activePortal =
        this.ionic_app._loadingPortal.getActive() ||
        this.ionic_app._modalPortal.getActive() ||
        this.ionic_app._toastPortal.getActive() ||
        this.ionic_app._overlayPortal.getActive();

      if (this.menuCtrl.isOpen()) {
        this.menuCtrl.close();
      } else if (activePortal) {
        activePortal.dismiss();
      } else {
        //dismiss all popups

        //--------------------
        this.nav
          .pop()
          .then(res => {
            console.log("pop");
          })
          .catch(err => {
            console.log("err is", err);
            //ask for exit
            // this.alert_isshown=true;
            if (this.alert_isshown == false) {
              this.presentConfirm();
            } else {
              this.alert_isshown = false;
              this.alert.dismiss();
            }
            //---------------
          });
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#1c935e");
      console.log("PLATFROM IS READY");
      console.log("getting_version_code");
      this.onlineCheck();
      this.getToken();
    });
  }
  getToken() {
    this.service.getToken().subscribe(
      res => {
        if (res) {
          this.rootPage = TabsPage;
          this.apiService.get("user/details").subscribe(res => {
            if (
              res.data.user.location == "" ||
              res.data.user.location == null ||
              res.data.user.location == undefined
            ) {
              this.global_item.App_global_location = "Update Location";
            } else {
              this.global_item.App_global_location = res.data.user.location;
              this.global_item.App_global_location_lat = res.data.user.latitude;
              this.global_item.App_global_location_long =
                res.data.user.longitude;
            }
            let id = res.data.user.pk_i_id;
            let s_name = res.data.user.s_name;
            let email = res.data.user.pk_i_id;
            let s_phone_mobile = res.data.user.s_phone_mobile;
            this.storage.set("id", id);
            this.storage.set("name", s_name);
            this.storage.set("email", email);
            this.storage.set("mobile", s_phone_mobile);
            this.menuCtrl.enable(true, "myMenu");
          });
          this.fcm.getToken().then(token => {
            if (token) {
              let postParams = {
                fcm_token: token
              };
              this.apiService.postData(postParams, "fcm").subscribe(res => {
                console.log("api fcm res");
                console.log(res);
              });
            }
            console.log(token);
          });
        } else {
          this.global_item.save_temp_user_location();
          this.rootPage = LoginPage;
          this.service.createLogin();
          this.menuCtrl.enable(false, "myMenu");
        }
      },
      error => {
        this.global_item.save_temp_user_location();
        this.rootPage = LoginPage;
        this.service.createLogin();
        this.menuCtrl.enable(false, "myMenu");
      }
    );

    this.fcm.onNotification().subscribe(noti => {
      console.log("notification");
      console.log(noti);
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      if (token) {
        let postParams = {
          fcm_token: token
        };
        this.apiService.postData(postParams, "fcm").subscribe(res => {
          console.log("fcm api res");
          console.log(res);
        });
      }
    });
  }
  onlineCheck() {
    let temp_status = false;
    setInterval(i => {
      if (this.network_manager.is_internet_connection_enabled()) {
        temp_status = false;
      } else {
        if (temp_status == false) {
          temp_status = true;
          this.nav.push("NoInternetConnectionPage");
        }
      }
    }, 1000);
  }
  //------------------------------ checking internet connection end

  //checking permission start
  getPermission() {
    let permission_list = [
      this.diagnostic.permission.WRITE_EXTERNAL_STORAGE,
      this.diagnostic.permission.READ_EXTERNAL_STORAGE,
      // this.diagnostic.permission.ACCESS_COARSE_LOCATION,
      // this.diagnostic.permission.ACCESS_FINE_LOCATION,
      this.diagnostic.permission.CALL_PHONE
    ];
    this.diagnostic.getPermissionsAuthorizationStatus(permission_list).then(
      status => {
        console.log("AuthorizationStatus");
        console.log(status);
        if (status != this.diagnostic.permissionStatus.GRANTED) {
          this.diagnostic
            .requestRuntimePermissions(permission_list)
            .then(data => {
              console.log("getCameraAuthorizationStatus");
              console.log(data);
            });
        } else {
          console.log("We have the permission");
          // this.global_item.showToast(
          //   "please allow permissions and on location for better performance"
          // );
        }
      },
      statusError => {
        console.log(`statusError`);
        console.log(statusError);
        // this.global_item.showToast(
        //   "please allow permissions and on location for better performance"
        // );
      }
    );
  }
  //checking permission end
  check_notification() {
    console.log("fetch notifications... start");
    try {
      console.log("inside try notification");
      this.fcm_controlling.fetchUserId();
      // this.pushsetup();
    } catch (e) {
      console.log("fetch notification err is");

      console.log(e);
    }
    console.log("fetch notifications... end");
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  postClick() {
    let token = this.service.accessToken();
    if (token.hasOwnProperty("access")) {
      this.nav.push("ClassifiedsAddListPage");
    } else {
      this.nav.push(LoginPage);
    }
  }
  postHome() {
    this.nav.setRoot(TabsPage);
  }
  postChat() {
    let token = this.service.accessToken();
    console.log("token");
    console.log(this.service.accessToken());

    console.log("----------------------------");
    if (token.hasOwnProperty("access")) {
      this.nav.push("ChatLogPage");
    } else {
      this.nav.push(LoginPage);
    }
    // this.nav.push("ChatLogPage");
  }
  postAccount() {
    let token = this.service.accessToken();
    console.log("token");
    console.log(this.service.accessToken());

    console.log("----------------------------");
    if (token.hasOwnProperty("access")) {
      this.nav.push("AccountPage");
    } else {
      this.nav.push(LoginPage);
    }
  }
  contactUs() {
    this.nav.push("ContactUsPage");
  }
  aboutUs() {
    this.nav.push("AboutUsPage");
  }
  login() {
    this.rootPage = LoginPage;
    this.service.createLogin();
    this.nav.push(LoginPage);
    this.menuCtrl.enable(false, "myMenu");
  }
  privacy_and_policy() {
    this.nav.push("PrivacyAndPolicyPage");
  }
  verified_users() {
    this.nav.push("VerifiedUsersPage");
  }
  change_language(direction) {
    if (direction == this.storage.get("app_direction")) {
      this.menuCtrl.close();
    } else if (direction == "ltr") {
      console.log("already saved dir", this.storage.get("app_direction"));
      console.log("selected dir", direction);
      this.storage.set("app_direction", "rtl");
      this.global_item.App_direction = "rtl";
      this.nav.setRoot(TabsPage);
    } else if (direction == "rtl") {
      console.log("already saved dir", this.storage.get("app_direction"));
      console.log("selected dir", direction);
      this.storage.set("app_direction", "ltr");
      this.global_item.App_direction = "ltr";
      this.nav.setRoot(TabsPage);
    } else {
      this.global_item.showToast("Something went wrong");
    }
  }

  logout_or_login(item) {
    console.log("value", item);
    this.menuCtrl.close();
    switch (item) {
      case "LOGOUT":
        {
          this.logout();
        }
        break;
      case "LOGIN":
        {
          this.rootPage = LoginPage;
          this.service.createLogin();
          this.nav.setRoot(LoginPage);
          this.menuCtrl.enable(false, "myMenu");
        }
        break;
      default: {
        this.global_item.showToast("Bug reported");
      }
    }
  }
  logout() {
    this.global_item.showLoading("Please wait");
    this.apiService.postData([], "logout").subscribe(
      res => {
        if (res) {
          this.service.deleteToken();
          let del = this.service.deletedTokens();
          if (del) {
            console.log("deleted in");
            localStorage.clear();
            this.storage.clear();
            this.storage.set("isShowPager", false);
            this.service.createLogin();
            this.menuCtrl.enable(false, "myMenu");
            this.splashScreen.show();
            location.reload();
            window.location.reload();
            // this.nav.setRoot(LoginPage);
            this.global_item.nav_auth = "LOGIN";
            this.global_item.dismissLoading();
            // this.platform.exitApp();
          } else {
            // this.logout();
            this.service.deleteToken();
            localStorage.clear();
            this.storage.clear();
            this.storage.set("isShowPager", false);
            this.service.createLogin();
            this.menuCtrl.enable(false, "myMenu");
            this.splashScreen.show();
            location.reload();
            window.location.reload();
            // this.nav.setRoot(LoginPage);
            this.global_item.nav_auth = "LOGIN";
            this.global_item.dismissLoading();
          }
        } else {
          this.service.deleteToken();
          localStorage.clear();
          this.storage.clear();
          this.storage.set("isShowPager", false);
          this.service.createLogin();
          this.menuCtrl.enable(false, "myMenu");
          this.splashScreen.show();
          location.reload();
          window.location.reload();
          // this.nav.setRoot(LoginPage);
          this.global_item.nav_auth = "LOGIN";
          this.global_item.dismissLoading();
        }
      },
      err => {
        // this.global_item.dismissLoading();
        // this.storage.clear();
        // this.global_item.nav_auth = "";
        // this.logout();
        this.service.deleteToken();
        localStorage.clear();
        this.storage.clear();
        this.storage.set("isShowPager", false);
        this.service.createLogin();
        this.menuCtrl.enable(false, "myMenu");
        this.splashScreen.show();
        location.reload();
        window.location.reload();
        // this.nav.setRoot(LoginPage);
        this.global_item.nav_auth = "LOGIN";
        this.global_item.dismissLoading();
      }
    );
  }
  //on push notification start

  //start-ask for exit
  presentConfirm() {
    this.alert_isshown = true;
    this.alert = this.alertCtrl.create({
      title: this.global_item.do_translation("Confirm Exit"),
      message: this.global_item.do_translation("Do you want to exit?"),
      buttons: [
        {
          text: this.global_item.do_translation("Cancel"),
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
            this.alert.dismiss();
            this.alert_isshown = false;
          }
        },
        {
          text: this.global_item.do_translation("Yes"),
          handler: () => {
            console.log("exit");
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }
  //.....................
  //on push notification end
}
