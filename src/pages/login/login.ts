import { Component, ViewChild } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Platform,
  Slides,
  ModalController
} from "ionic-angular";
import { MenuController } from "ionic-angular/components/app/menu-controller";
import { AppError } from "../../Errors/app-error";
import { AuthenticationError } from "../../Errors/authentication-error";
import { BadRequestError } from "../../Errors/bad-request-error";
import { CommonApiService } from "../../services/common-api.service";
import { DatabasesService } from "../../services/databases.service";
import { OtpPage } from "../otp/otp";
import { RegisterPage } from "../register/register";
import { TabsPage } from "../tabs/tabs";
import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
import { AngularFireDatabase } from "angularfire2/database";
import { FCM } from "@ionic-native/fcm";
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({ name: "LoginPage" })
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  @ViewChild("slides") slides: Slides;
  page_slider_index = false;
  alert;
  errors: any = [];
  val_error: any = [];
  isShow_pager = null;
  username = "";
  password = "";
  constructor(
    private fcm: FCM,
    private platform: Platform,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    private _afDB: AngularFireDatabase,
    // public global_provider: GlobalItemsProvider,
    public navParams: NavParams,
    public service: CommonApiService,
    public dbservice: DatabasesService,
    private storage: Storage,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public global_items: GlobalItemsProvider,
    public modalctrl: ModalController
  ) {
    // this.fun_language_chooser();
    this.remember();
    this.dbservice.createLogin();
  }
  fun_language_chooser() {
    let modal = this.modalctrl.create("LanguageTranslatePage");
    modal.onDidDismiss(res => {
      if (res == null || res == undefined) {
        res = {
          language_dir: "ltr"
        };
      }

      console.log("language modal dismiss resulat is:", res);
      // this.platform.setDir(res.language_dir, true);
      this.storage.set("app_direction", res.language_dir).then(res => {
        console.log("storage set", res);
      });
      this.global_items.App_direction = res.language_dir;
      this.isShow_pager = true;
    });
    modal.present();
  }
  remember() {
    this.storage
      .get("isShowPager")
      .then(res => {
        console.log("isShowPager:", res);

        if (res == null || res == undefined || res == true) {
          this.fun_language_chooser();
          // this.isShow_pager = true;
          this.storage.set("isShowPager", false);
          console.log("storage set: false");
        } else {
          this.storage.get("app_direction").then(res => {
            if (res == null || res == undefined || res == "ltr") {
              this.global_items.App_direction = "ltr";
              this.platform.setDir("ltr", true);
              this.storage.set("app_direction", "ltr");
            } else {
              this.global_items.App_direction = "rtl";
              this.platform.setDir("rtl", true);
              this.storage.set("app_direction", "rtl");
            }
          });
          this.isShow_pager = false;
        }
      })
      .catch(er => {
        console.log("isShowPager:", er);
        this.isShow_pager = true;
      });
  }
  login(username, password) {
    let loading = this.loadingCtrl.create({
      spinner: "crescent",
      content: "Loging in..."
    });
    loading.present();
    let postParams = {
      username: username,
      password: password
    };

    this.service.postData(postParams, "login").subscribe(
      res => {
        var token = res.access_token;
        var refresh_token = res.refresh_token;
        this.dbservice.saveToken(token, refresh_token);
        this.dbservice.getToken().subscribe(res => {
          if (res) {
            this.service.get("user/details").subscribe(res => {
              if (
                res.data.user.location == "" ||
                res.data.user.location == null ||
                res.data.user.location == undefined
              ) {
                this.global_items.App_global_location = "Update Location";
              } else {
                this.global_items.App_global_location = res.data.user.location;

                this.global_items.App_global_location_lat =
                  res.data.user.latitude;
                this.global_items.App_global_location_long =
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
              this.fcm.getToken().then(token => {
                if (token) {
                  let postParams = {
                    fcm_token: token
                  };
                  this.service.postData(postParams, "fcm").subscribe(res => {
                    console.log("api fcm res");
                    console.log(res);
                  });
                }
                console.log(token);
              });
            });
            // this.my_fun_create_chat_node_info(res.data.user.pk_i_id);
            loading.dismiss();
            this.menuCtrl.enable(true, "myMenu");
            this.navCtrl.setRoot(TabsPage);
          } else {
            this.global_items.save_temp_user_location();
          }
        });
      },
      (error: AppError) => {
        this.global_items.App_global_location = "Update Location";
        console.log("app error");
        this.errors = ["invalid user name and password"];
        if (error instanceof AuthenticationError) {
          if (error.originalError.error.error) {
            this.val_error = error.originalError.error.error;
            var user_info = error.originalError.error.user.id;
            var number = error.originalError.error.user.number;
            console.log(user_info);
            console.log(number);
            if (error.originalError.error.code === 1) {
              this.navCtrl.push("OtpPage", {
                user_info: user_info,
                number: number
              });
              loading.dismiss();
            }
          }
        }
        if (error instanceof BadRequestError) {
          console.log("bad request error");

          if (error.originalError.error.error_message) {
            let errors = error.originalError.error.error_message;
            for (let error in errors) {
              this.doValidationMessage(errors[error]);
              console.log(errors);
              loading.dismiss();
            }
          }
        } else throw error;
        this.menuCtrl.enable(false, "myMenu");
      }
    );

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }
  doValidationMessage(message) {
    let val = {
      message: message[0],
      error: true
    };
    this.errors.push(val);
  }

  goToRegister() {
    this.navCtrl.push("RegisterPage");
  }

  goTohome() {
    this.global_items.save_temp_user_location();
    this.navCtrl.setRoot(TabsPage);
  }
  forgotPass() {
    let alert = this.alertCtrl.create({
      title: this.global_items.do_translation("Forgot password?"),
      inputs: [
        {
          type: "number",
          name: "Email",
          placeholder: this.global_items.do_translation(
            "Registered Phone number"
          )
        }
      ],
      buttons: [
        {
          text: this.global_items.do_translation("Cancel"),
          role: "cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: this.global_items.do_translation("Submit"),
          handler: data => {
            console.log("forgot data is:", data);
            this.fun_forgot_password(data.Email);
            // this.resendOtp(data.Email);
            // this.service.postData(data, "forgot-password").subscribe(res => {
            //   if (res) {
            //     let alert = this.alertCtrl.create({
            //       title: "Password Reset",
            //       subTitle:
            //         "Password reset link has been forwarded to your registered email id",
            //       buttons: ["Dismiss"]
            //     });
            //     alert.present();
            //   }
            // });
            // console.log(data);
          }
        }
      ]
    });
    alert.present();
  }
  resendOtp(phnumber) {
    // setTimeout(() => {
    //   this.global_items.showToast("Resending OTP");
    //   this.fun_forgot_password(phnumber);
    // }, 60000);
    this.global_items.showToast("Resending OTP");
    this.fun_forgot_password(phnumber);
  }
  fun_forgot_password(ph_number) {
    this.global_items.showLoading("Please wait...");
    let data = {
      number: ph_number
    };
    this.service.postData(data, "user/forgot").subscribe(
      res => {
        this.global_items.dismissLoading();
        console.log("response_forgot");
        // this.global_items.showToast(res.data.message);
        console.log(res);
        let alert = this.alertCtrl.create({
          title: this.global_items.do_translation("Forgot password?"),
          inputs: [
            {
              name: "OTP",
              placeholder: this.global_items.do_translation("Enter OTP")
            }
          ],
          buttons: [
            {
              text: this.global_items.do_translation("Cancel"),
              role: "cancel",
              handler: data => {
                console.log("Cancel clicked");
              }
            },
            {
              text: this.global_items.do_translation("Submit"),
              handler: data => {
                console.log("forgot data is:", data);
                this.fun_forgot_password_verifiy(data.OTP, ph_number);
              }
            },
            {
              text: this.global_items.do_translation("Resend"),
              handler: data => {
                console.log("resending otp is:", data);
                this.resendOtp(ph_number);
              }
            }
          ]
        });
        alert.present();
      },
      err => {
        this.global_items.dismissLoading();
        console.log("error-forgot");
        this.global_items.showToast("Invalid Phone number");
        console.log(err);
      }
    );
  }
  fun_forgot_password_verifiy(OTP, ph_number) {
    console.log("otp:", OTP);
    this.global_items.showLoading("Please wait...");
    let data = {
      number: ph_number,
      otp: OTP
    };
    this.service.postData(data, "forgot/verify-otp").subscribe(
      res => {
        this.global_items.dismissLoading();
        console.log("response_verify-otp");
        // this.global_items.showToast(res.data.message);
        console.log(res);
        let alert = this.alertCtrl.create({
          title: this.global_items.do_translation("Forgot password?"),
          inputs: [
            {
              name: "New_password",
              placeholder: this.global_items.do_translation("New Password")
            },
            {
              name: "Confirm_password",
              placeholder: this.global_items.do_translation("Confirm Password")
            }
          ],
          buttons: [
            {
              text: this.global_items.do_translation("Cancel"),
              role: "cancel",
              handler: data => {
                console.log("Cancel clicked");
              }
            },
            {
              text: this.global_items.do_translation("Submit"),
              handler: data => {
                console.log("forgot data is:", data);
                this.fun_forgot_update_password(
                  data.New_password,
                  data.Confirm_password,
                  OTP,
                  ph_number
                );
              }
            }
          ]
        });
        alert.present();
      },
      err => {
        this.global_items.dismissLoading();
        console.log("error-verify otp");
        console.log(err);
        this.global_items.showToast("Invalid OTP, Please Try again");
      }
    );
  }
  fun_forgot_update_password(new_password, confirm_password, otp, ph_number) {
    if (
      new_password == "" ||
      new_password == null ||
      new_password == undefined
    ) {
      this.global_items.showToast("Please enter a password");
    } else {
      if (new_password === confirm_password) {
        let data = {
          number: ph_number,
          otp: otp,
          password: new_password,
          password_confirmation: confirm_password
        };
        this.global_items.showLoading("Please wait...");
        this.service.postData(data, "forgot/update-password").subscribe(
          res => {
            console.log("password updated-success");
            console.log(res);
            // this.global_items.showToast(res.data.message);
            this.global_items.showAlert("Done", res.data.message, "success");
            this.global_items.dismissLoading();
          },
          err => {
            // this.global_items.showToast("Something went wrong");
            this.global_items.showAlert(
              "Oops",
              "Something went wrong",
              "error"
            );
            this.global_items.dismissLoading();
            console.log("password updated-error");
            console.log(err);
          }
        );
      } else {
        console.log("error");
        this.global_items.showAlert("Oops", "Invalid Password", "error");
      }
    }
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }
  end_pager() {
    console.log("clicked");
    this.global_items.showLoading("Please wait...");
    this.storage.get("app_direction").then(res => {
      console.log("inlogin page direction", res);
      this.platform.setDir(res, true);
    });
    setTimeout(() => {
      this.isShow_pager = false;
      this.global_items.dismissLoading();
    }, 3000);
  }
  slideChanged(event?, index?, direction?) {
    if (index != null && direction != null) {
      console.log("clicked slide changed");

      this.fun_doAnimation(index, direction);
    } else {
      console.log("swiped slide changed");

      this.page_slider_index = event._isEnd;
      console.log(event);
      console.log("index:", event.realIndex);
      console.log("isend", event._isEnd);
      this.fun_doAnimation(event.realIndex, event.swipeDirection);
    }
  }
  fun_doAnimation(index, next_prev) {
    switch (index) {
      case 0:
        {
          console.log("0");
          // this.funAddClass("slide0_img", "slide0_title");
        }

        break;
      case 1:
        {
          console.log("1");
          this.funAddClass("slide1_img", "slide1_title", next_prev);
        }

        break;
      case 2:
        {
          console.log("2");
          this.funAddClass("slide2_img", "slide2_title", next_prev);
        }

        break;
      case 3:
        {
          console.log("3");
          this.funAddClass("slide3_img", "slide3_title", next_prev);
        }

        break;
      case 4:
        {
          console.log("4");
          this.funAddClass("slide4_img", "slide4_title", next_prev);
        }

        break;
      case 5:
        {
          console.log("5");
          this.funAddClass("slide5_img", "slide5_title", next_prev);
        }

        break;

      default:
        break;
    }
  }
  // funAddClass(img_id, title_id, direction?) {
  //   console.log("funadd", img_id, title_id, direction);

  //   const item_img = document.querySelector("#" + img_id);
  //   const item_title = document.querySelector("#" + title_id);

  //   item_img.classList.add("animated", "pulse");
  //   item_img.addEventListener("animationend", function() {
  //     item_img.classList.remove("pulse");
  //     item_img.classList.add("visible_show");
  //   });
  //   setTimeout(() => {
  //     item_title.classList.add("animated", "fadeIn");
  //     item_title.addEventListener("animationend", function() {
  //       item_title.classList.remove("fadeIn");
  //       item_title.classList.add("visible_show");
  //     });
  //   }, 100);
  // }

  funAddClass(img_id, title_id, direction?) {
    console.log("fun add", img_id, title_id, direction);
    const item_img = document.querySelector("#" + img_id);
    const item_title = document.querySelector("#" + title_id);
    switch (direction) {
      case "next":
        {
          setTimeout(() => {
            item_title.classList.add("animated", "slideInRight");
            item_title.addEventListener("animationend", function() {
              item_title.classList.remove("slideInRight");
              item_title.classList.add("visible_show");
            });
          }, 500);
          item_img.classList.add("animated", "pulse");
          item_img.addEventListener("animationend", function() {
            item_img.classList.remove("pulse");
            item_img.classList.add("visible_show");
          });
        }

        break;
      case "prev":
        {
          setTimeout(() => {
            item_title.classList.add("animated", "fadeIn");
            item_title.addEventListener("animationend", function() {
              item_title.classList.remove("fadeIn");
              item_title.classList.add("visible_show");
            });
          }, 500);
          item_img.classList.add("animated", "pulse");
          item_img.addEventListener("animationend", function() {
            item_img.classList.remove("pulse");
            item_img.classList.add("visible_show");
          });
        }
        break;

      default:
        break;
    }
  }

  funRemoveClass(id) {
    console.log("remove", id);
    const item_title = document.querySelector("#" + id);
    item_title.classList.remove();
    item_title.classList.add("visible_hidden");
  }
  next() {
    this.slides.slideNext();
    this.slideChanged("", this.slides.getActiveIndex(), "next");
  }
  prev() {
    this.slides.slidePrev();
  }
}
