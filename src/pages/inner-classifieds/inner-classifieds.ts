import { Component } from "@angular/core";
import { CallNumber } from "@ionic-native/call-number";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Toast } from "@ionic-native/toast";
import { Storage } from "@ionic/storage";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase";
import {
  AlertController,
  IonicPage,
  Keyboard,
  NavController,
  NavParams
} from "ionic-angular";
import { SuperTabsController } from "ionic2-super-tabs";
import { Observable } from "rxjs/Rx";
import { BadRequestError } from "../../Errors/bad-request-error";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";
import { DatabasesService } from "../../services/databases.service";
import { ItemService } from "../../services/item.service";
import { StaticSettings } from "../../services/settings.service";
import { UrlUtils } from "../../services/url.service";
import { ChatInnerPage } from "../chat-inner/chat-inner";
import { LoginPage } from "../login/login";
import { ViewAllClassifiedsPage } from "../view-all-classifieds/view-all-classifieds";
import { InAppBrowser } from "@ionic-native/in-app-browser";
@IonicPage({ name: "InnerClassifiedsPage" })
@Component({
  selector: "page-inner-classifieds",
  templateUrl: "inner-classifieds.html"
})
export class InnerClassifiedsPage {
  eid = "";
  show_call = false;
  public firstParam;
  commentValue = "";
  items: any = {};
  toggle: boolean;
  id: any;
  comment: any = {};
  update: any = {};
  users: any[] = [];
  data: any = {};
  url: any = {};
  favPost: any = {};
  loader: string;
  isFavourite: boolean;
  recipientId: any = {};
  userId: number;
  reportOption: any = {};
  related_json = [{}];
  fk_i_category_id: any; //for report option
  item_related_date: any;
  constructor(
    // private launchNavigator: LaunchNavigatorOriginal,
    public iab: InAppBrowser,
    public apiService: CommonApiService,
    public navCtrl: NavController,
    public atrCtrl: AlertController,
    private toast: Toast,
    public navParams: NavParams,
    private itemService: ItemService,
    public urlService: UrlUtils,
    public service: CommonApiService,
    public settings: StaticSettings,
    public superTabsCtrl: SuperTabsController,
    private socialSharing: SocialSharing,
    private storage: Storage,
    public dbservice: DatabasesService,
    private _fbAuth: AngularFireAuth,
    private _afDB: AngularFireDatabase,
    public global_items: GlobalItemsProvider,
    private callNumber: CallNumber,
    private keyboard: Keyboard
  ) {
    this.users["next"] = 1;
    this.url = "show-u";
    this.firstParam = navParams.get("id");
  }

  toggleIcon() {
    this.toggle = !this.toggle;
  }

  ngOnInit() {
    this.homesetup();
    this.loader = "loading";
    this.id = this.firstParam;
    this.users["comments"] = [];
    let token = this.dbservice.accessToken();
    if (token.hasOwnProperty("access")) {
      this.url = "show";
    }
    this.fetchUserId();
    this.getItem(this.id);
    this.getComment();
  }

  getItem(id) {
    this.itemService.get(this.url + "/" + id).subscribe(
      res => {
        if (res.status) {
          this.eid = res.data.item.eid;
          console.log("url", this.url + id);
          console.log(res.data);
          console.log("inner-classifieds-item_data");
          console.dir(res);

          if (
            res.data.item.location.lat == null ||
            res.data.item.location.lat == undefined ||
            res.data.item.location.lat == "" ||
            res.data.item.location.long == null ||
            res.data.item.location.long == undefined ||
            res.data.item.location.long == ""
          ) {
            console.log("dont show location");

            this.items["isShowlocation"] = false;
          } else {
            console.log("show location");

            this.items["isShowlocation"] = true;
            this.items["latitude"] = res.data.item.location.lat;
            this.items["longitude"] = res.data.item.location.long;
          }
          this.items["data"] = res.data;
          this.items["fk_i_user_id"] = res.data.item.fk_i_user_id;
          this.items["s_contact_name"] = res.data.item.s_contact_name;
          this.items["is_verified_user"] = res.data.item.is_verified_user;
          // this.items["s_contact_email"] = "Contact: \t"+res.data.item.s_contact_email;
          if (res.data.item.mob == null || res.data.item.mob == undefined) {
            this.items["s_contact_email"] = null;
          } else {
            this.items["s_contact_email"] = res.data.item.mob;
          }

          this.items["chat"] = res.data.item.b_show_chat;
          this.items["resource"] = res.data.item.resources;
          this.items["description"] = res.data.item.description.description;
          this.items["date"] = res.data.item.new_date;
          this.items["isFav"] = res.data.item.is_favourite;
          if (this.items["isFav"]) {
            this.isFavourite = this.items["isFav"].fav ? true : false;
          }
          this.items["title"] = res.data.item.description.title;
          this.items["additional"] = res.data.item.additional_fields;
          this.items["related_ads"] = res.data.item.related;
          this.items["region"] = res.data.item.location.s_region;
          this.items["city"] = res.data.item.location.s_city;
          this.items["area"] = res.data.item.location.s_city_area;
          this.items["country"] = res.data.item.location.country;
          this.items["lastupdate"] = res.data.item.dt_mod_date;
          this.items["category"] = res.data.item.category_name.s_name;
          // this.items["price"] = "Price:\t OMR \t" + res.data.item.i_price;
          this.items["price"] =
            this.global_items.do_translation("Price") +
            ":\t OMR \t" +
            res.data.item.i_price;
          this.items["view"] = "show";
          this.items["contact"] = res.data.item.mob;
          this.items["shareUrl"] = res.data.item.meta.share_url;
          this.items["fk_i_category_id"] =
            res.data.item.category_name.fk_i_category_id;
          this.items["pk_i_id"] = res.data.item.pk_i_id;
          this.loader = "loaded-ok";

          console.log("done");
          console.log("fk_i_category_id", this.items["fk_i_category_id"]);
          console.log("pk_i_id", this.items["pk_i_id"]);

          console.log("related");

          for (let i = 0; i < this.items.related_ads.length; i++) {
            console.dir(this.items.related_ads[i].dt_pub_date);
            let stringToSplit = this.items.related_ads[i].dt_pub_date;
            let x = stringToSplit.split(" ");
            this.related_json.push(x[0]);
          }
          console.log("json array");

          console.dir(this.related_json);
        } else {
          console.log("else");

          this.items["view"] = "empty";
        }
        console.log("final items");
        console.log(this.items);
      },
      err => {
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
  }
  report(type, id?) {
    console.log("type:-" + type);
    // if (type == 'comment') {   this.url = 'comment';   this.id = id; }
    // if(this.url.indexOf("tourism") >= 0) {   let
    // splited_item=this.url.split('/');   this.url=splited_item[1]; }
    let alert = this.atrCtrl.create();
    alert.setCssClass("main-alert");
    alert.setTitle(this.global_items.do_translation("Report or Spam This"));
    for (var options in this.reportOption) {
      var temp = this.reportOption[options];
      alert.addInput({
        type: "radio",
        label: temp["name"],
        value: temp["name"],
        checked: false
      });
    }
    alert.addButton(this.global_items.do_translation("Cancel"));
    alert.addButton({
      text: this.global_items.do_translation("OK"),
      handler: data => {
        const payload = {
          type: this.items["fk_i_category_id"], //category id
          fk_id: this.items["pk_i_id"],
          reason: data,
          listing: 1
        };
        console.log("inner-classified-report-payload");
        console.dir(payload);
        this.apiService.postData(payload, "report-spam").subscribe(
          res => {
            console.log(res);
            if (res.status) {
              // this.toast
              //   .show(` Your report has been submitted..`, "2000", "center")
              //   .subscribe(toast => {
              //     console.log(toast);
              //   });
              // setTimeout(() => {}, 2000);
              this.global_items.showToast("Your report has been submitted");
            }
          },
          error => {
            this.global_items.showToast("Something went wrong");
            if (error instanceof BadRequestError) {
              if (error.originalError.error.error_message) {
                let errors = error.originalError.error.error_message;
                for (let error in errors) {
                  // this.toast
                  //   .show(
                  //     ` There was an error in processing your request.`,
                  //     "2000",
                  //     "center"
                  //   )
                  //   .subscribe(toast => {
                  //     console.log(toast);
                  //   });
                  // setTimeout(() => {}, 2000);
                }
              }
            } else {
              // this.toast
              //   .show(
              //     ` There was an error in processing your request.`,
              //     "2000",
              //     "center"
              //   )
              //   .subscribe(toast => {
              //     console.log(toast);
              //   });
              // setTimeout(() => {}, 2000);
            }
          }
        );
        console.log("data:-" + data);
      }
    });
    alert.present();
  }
  onFav() {
    if (this.isFavourite) {
      this.deleteFav();
    } else {
      this.postFav();
    }
  }

  fetchUserId() {
    this.storage.get("id").then(val => {
      this.userId = val;
    });
  }
  contact_to_person() {
    console.log("contact:" + this.items["s_contact_email"]);
    if (
      this.items["s_contact_email"] == null ||
      this.items["s_contact_email"] == "" ||
      this.items["s_contact_email"] == undefined
    ) {
      this.global_items.showToast("Sorry no contact details found");
    } else {
      this.show_call = true;
      this.callNumber
        .callNumber(this.items["s_contact_email"], true)
        .then(res =>
          console.log("Launched dialer!", res => {
            this.show_call = false;
          })
        )
        .catch(err =>
          console.log("Error launching dialer", err => {
            this.show_call = false;
          })
        );
      this.show_call = false;
    }
  }

  createChat() {
    this.global_items.showLoading("Please wait...");
    this.recipientId = this.items["fk_i_user_id"];
    console.log("recipientId", this.recipientId);
    if (this.userId) {
      this._fbAuth.authState.subscribe(
        user => {
          console.log("fbAuth>>user");
          console.log(user);
          if (!user) {
            this.global_items.showToast("Unauthorized");
            this.global_items.showToast("Something went wrong");
            return console.log("Unauthorized");
          } else if (this.userId != this.recipientId) {
            console.log("create chat else case");
            this._afDB.database
              .ref("users/" + this.userId + "/chat_nodes/" + this.recipientId)
              .once(
                "value",
                snap => {
                  console.log("snap response: ", snap);
                  console.log("snap response test: ", snap.key);
                  console.log("snap.val(): ", snap.val());
                  let res = snap.val();
                  if (res && res.thread_key) {
                    //TODO Redirect to that chat head
                    this.redirectToChatList(res.thread_key);
                    console.log("chat exist ", res);
                  } else {
                    console.log("No chat found preparing to create...");
                    this.checkUserExist().subscribe(
                      res => {
                        console.log("chat user exist", res);

                        if (res) {
                          this.createChatNode().subscribe(
                            res => {
                              this.redirectToChatList(res);
                            },
                            err => {
                              this.global_items.dismissLoading();

                              console.log(
                                "Something went wrong ",
                                "Try again later",
                                "/message"
                              );
                            }
                          );
                        } else {
                          this.global_items.dismissLoading();

                          //TODO handle
                          console.log(
                            "User does not exist",
                            "Try again later",
                            "/message"
                          );
                        }
                      },
                      err => {
                        this.global_items.dismissLoading();

                        console.log("error", err);

                        console.log(
                          "User does not exist",
                          "Try again later",
                          "/message"
                        );
                      }
                    );
                  }
                },
                error => {
                  this.global_items.dismissLoading();
                  console.log("create chat node>>snpap:", error);
                }
              );
          } else {
            this.global_items.dismissLoading();
            this.global_items.showToast("This is your post");
          }
        },
        err => {
          this.global_items.dismissLoading();
          console.log("fb error", err);
        }
      );
    } else {
      this.global_items.dismissLoading();
      this.navCtrl.push(LoginPage);
    }
    this.global_items.dismissLoading();
  }
  redirectToChatList(threadskey) {
    this.navCtrl.push("ChatInnerPage", {
      user_id: this.userId,
      info: threadskey,
      name: this.items["s_contact_name"]
    });
  }
  private checkUserExist(): Observable<boolean> {
    console.log("this user checking");
    return Observable.create(obs => {
      console.log("checkuser exist>>", this.userId);
      this._afDB.database.ref(`users/${this.userId}/info`).once(
        "value",
        snap => {
          console.log("snap response", snap);
          console.log("snap val():", snap.val());
          if (snap.val()) {
            obs.next(true);
          } else {
            // obs.next(this.my_fun_create_chat_node_info(obs));
            // obs.complete();
            this.my_fun_create_chat_node_info();
          }
          obs.complete();
        },
        fails => {
          obs.error();
          console.log("check user exist err", fails);
        }
      );
    });
  }
  my_fun_create_chat_node_info() {
    this.global_items.showToast("Please wait...");
    this.apiService.get("user/details").subscribe(
      res => {
        if (res.status) {
          console.log(res.data.user.s_name);
          console.log(res.data.user.profile_picture);
          let info_params = {
            name: res.data.user.s_name,
            photoURL: res.data.user.profile_picture
          };
          let senderRef = this._afDB.database
            .ref(`users/${this.userId}/info`)
            .push(info_params)
            .then(
              res => {
                console.log("response create node info", res);
                this.createChat();
                return true;
              },
              err => {
                console.log("response error node info", err);
                return false;
              }
            );
        } else {
          this.global_items.showToast("Something went wrong");
          return false;
        }
      },
      err => {
        console.log("user/details error", err);

        this.global_items.showToast("Something went wrong");
        return false;
      }
    );
  }
  createChatNode() {
    console.log("this user inside chatNode");
    return Observable.create(
      observer => {
        let senderUpdate = {};
        let senderRef = this._afDB.database.ref(
          `users/${this.userId}/chat_nodes/${this.recipientId}`
        );
        let threadskey = this._afDB.database
          .ref(`users/${this.userId}/threads`)
          .push().key;
        let messageUpdate = {};
        let threadsRef = this._afDB.database.ref(
          `users/${this.userId}/threads/${threadskey}`
        );
        //Data to update under sender node
        senderUpdate["last_modified"] = firebase.database.ServerValue.TIMESTAMP;
        senderUpdate["unread_count"] = 0;
        senderUpdate["thread_key"] = threadskey;
        senderUpdate["user_id"] = this.recipientId;
        messageUpdate["meta"] = {
          total: 0
        };

        senderRef
          .update(senderUpdate)
          .then(res => {
            threadsRef
              .update(messageUpdate)
              .then(res => {
                observer.next(threadskey);
                observer.complete();
              })
              .catch(err => observer.error(err));
          })
          .catch(error => observer.error(error));
      },
      err => {
        console.log("create chat node err", err);
      }
    );
  }
  postFav() {
    let postParams = {
      item_id: this.id
    };
    this.service.postData(postParams, "favourites").subscribe(
      res => {
        if (res.status) {
          this.isFavourite = !this.isFavourite;
          this.global_items.showToast("Saved");
        }
      },
      err => {
        this.global_items.showToast("Something went wrong");
      }
    );
  }

  deleteFav() {
    this.service.deleteData("favourites/" + this.id).subscribe(res => {
      if (res.status) {
        this.isFavourite = !this.isFavourite;
        this.global_items.showToast("Unsaved");
      }
    });
  }

  getComment() {
    this.itemService
      .get("comments/" + this.id, { page: this.users["next"] })
      .subscribe(res => {
        if (res.status) {
          if (res.data.total > 0) {
            this.users["comments"] = res.data.data;
            console.log("comments");
            console.log(this.users["comments"]);
            this.users["next"] = res.data.current_page + 1;
          }
        } else {
          this.users["comments"] = [];
          this.users["next"] = 1;
        }
        if (res.data.last_page > res.data.current_page)
          this.users["isNext"] = true;
        else this.users["isNext"] = false;
      });
  }

  loadComments(infiniteScroll) {
    if (this.users["isNext"]) {
      this.itemService
        .get("comments/" + this.id, { page: this.users["next"] })
        .subscribe(res => {
          if (res.status) {
            if (res.data.total > 0) {
              let data: any[];
              data = res.data.data;
              this.users["comments"] = this.users["comments"].concat(data);
              infiniteScroll.complete();
              if (res.data.last_page > res.data.current_page) {
                this.users["isNext"] = true;
                this.users["next"] = res.data.current_page + 1;
              } else {
                this.users["isNext"] = false;
                infiniteScroll.enable(false);
              }
              this.users["loadMore"] = false;
            } else {
              this.users["comments"] = [];
              this.users["next"] = 1;
            }
          }
        });
    } else {
      infiniteScroll.enable(false);
    }
  }

  getItemId(id) {
    this.navCtrl.push("InnerClassifiedsPage", { id: id });
    console.log(id);
  }
  hide_keyboard() {
    this.keyboard.close();
  }
  onPost(commentValue) {
    console.log(commentValue);
    this.comment = commentValue;
    this.commentValue = "";
    this.update["comment"] = this.comment;
    // this.update["item_id"] = this.id;
    this.update["item_id"] = this.eid;
    if (this.comment) {
      this.postComment();
      this.comment = null;
    }
  }

  postComment() {
    if (this.commentValue != "" || this.commentValue != undefined) {
      this.service.postData(this.update, "item/comments").subscribe(res => {
        if (res.status && res.data) {
          if (this.users["comments"]) {
            this.users["comments"].unshift(res.data);
          } else {
            this.users["comments"].push(res.data);
          }
        }
      });
    }
  }

  deleteComment(id, index) {
    console.log(id);
    console.log(index);
    this.service.deleteData("item/comments/" + id).subscribe(res => {
      if (res.status) {
        this.users["comments"].splice(index, 1);
      }
    });
  }

  getOtherPath(res) {
    let path: boolean;
    path = res.profile_picture ? true : false;
    if (path) {
      return this.settings.IMAGE_URL + res.profile_picture;
    }
    return false;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad InnerClassifiedsPage");
  }

  viewAll() {
    this.navCtrl.setRoot(ViewAllClassifiedsPage);
  }

  /**
   * [share Function]
   * this function is used for sharing to the social media.
   * created by Jigar Lodaya
   * @param  {int} id [id of the post]
   * @return {[type]}    [description]
   */
  share(item) {
    console.log(item.shareUrl);
    let message = item.title;
    let subject = "";
    let file = null;
    let url = item.shareUrl;
    this.socialSharing
      .share(message, subject, file, url)
      .then(() => {
        // success
      })
      .catch(() => {
        // error
      });
  }

  goback() {
    this.navCtrl.pop();
  }

  homesetup() {
    this.reportOption = [
      {
        value: "0",
        name: this.global_items.do_translation("Sexually inappropriate")
      },
      {
        value: "1",
        name: this.global_items.do_translation("Violent or prohibited content")
      },
      {
        value: "2",
        name: this.global_items.do_translation("Offensive")
      },
      {
        value: "3",
        name: this.global_items.do_translation("Misleading or a scam")
      },
      {
        value: "4",
        name: this.global_items.do_translation("False news story")
      },
      {
        value: "4",
        name: this.global_items.do_translation("Spam")
      }
    ];
  }
  Gotomap(latitude, longitude) {
    console.log(latitude, longitude);
    // this.launchNavigator.navigate([latitude, longitude]);
    let url =
      "https://www.google.com/maps/search/?api=1&query=" +
      latitude +
      "," +
      longitude;
    const browser = this.iab.create(url, "_system");
    browser.on("loadstop").subscribe(event => {});
  }
}
