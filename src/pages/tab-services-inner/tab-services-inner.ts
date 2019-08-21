import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SocialSharing } from "@ionic-native/social-sharing";
import {
  AlertController,
  Keyboard,
  NavController,
  NavParams,
  Platform
} from "ionic-angular";
import { BadRequestError } from "../../Errors/bad-request-error";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";
import { StaticSettings } from "../../services/settings.service";
import { IonicPage } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { DatabasesService } from "../../services/databases.service";
import { CallNumber } from "@ionic-native/call-number";
@IonicPage({ name: "TabServicesInnerPage" })
@Component({
  selector: "page-tab-services-inner",
  templateUrl: "tab-services-inner.html"
})
export class TabServicesInnerPage implements OnInit {
  user_rate = 0;
  e_id = null;
  commentValue = "";
  progress: string;
  items: any = {};
  id: any = {};
  comment: any = {};
  users: any[] = [];
  data: any = {};
  update: any = {};
  toggle: boolean;
  isSaved: boolean = false;
  userId: any = {};
  public url: any = {};
  reportOption: any = {};
  showRating: boolean = false;
  type_id: any = "9";
  show_rating_status = "";
  show_call = false;
  slide_image_list = [];
  constructor(
    private callNumber: CallNumber,
    public global_items: GlobalItemsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public iab: InAppBrowser,
    public platform: Platform,
    public alertctrl: AlertController,
    public apiService: CommonApiService,
    public sanitizer: DomSanitizer,
    public settings: StaticSettings,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private keyboard: Keyboard,
    public db_service: DatabasesService
  ) {
    this.id = navParams.get("id");
    this.users["next"] = 1;
    this.users["loadMore"] = false;
    this.users["comments"] = [];
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TabServicesInnerPage");
  }
  ngOnInit() {
    this.getForumItem();
    this.getItem();
    this.fetchUserId();
    this.homesetup();
  }
  hasRating() {
    try {
      let exist = this.items.rating.total_points ? true : false;
      if (exist) {
        return this.items.rating.total_points;
      } else {
        return -1;
      }
    } catch (e) {
      console.log("catch rating error ", e);

      return -1;
    }
  }

  hasTotal() {
    let exist = this.items.rating ? true : false;
    if (exist) {
      return this.items.rating.number_votes;
    } else {
      return 0;
    }
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
  fetchUserId() {
    this.storage.get("id").then(val => {
      this.userId = val;
      console.log(this.userId);
    });
  }

  // toggleIcon() {
  //   this.toggle = !this.toggle;
  //   if (this.toggle == true) {
  //     console.log("hide keyboard");
  //     this.keyboard.close();
  //   }
  // }
  hide_keyboard() {
    this.keyboard.close();
  }

  getForumItem() {
    console.log("in");
    this.apiService.get("services/" + this.id).subscribe(
      res => {
        // this.apiService.postData({}, "events/show/").subscribe(res => {
        if (res.status) {
          console.log("services item");
          this.e_id = res.data.eid;
          console.log(res);
          //15-05-2019
          this.user_rate = res.data.rating_value;
          this.slide_image_list = res.data.images;
          this.items["contact_info"] = res.data.contact_info;
          this.items["email"] = res.data.email;
          this.items["phone"] = res.data.phone;
          this.items["website"] = res.data.website;
          //---------

          this.items["data"] = res.data;
          this.items["title"] = res.data.title;
          this.items["related"] = res.data.related;
          this.items["description"] = res.data.description;
          this.items["user_name"] = res.data.user.s_name;
          this.items["is_verified_user"] = res.data.user.is_verified_user;
          this.items["date"] = res.data.new_date;
          this.items["location"] = res.data.location_url;
          this.items["venue"] = res.data.venue;
          // this.items["event_date"] = res.data.event_date;
          this.items["switch"] = "show";
          // this.items["isFav"] = res.data.isFavourite;
          if (res.data.rating == null) {
            this.items["rating"] = 0;
          } else {
            this.items["rating"] = res.data.rating;
          }

          this.isSaved = this.items["isFav"];
          if (
            res.data.latitude == null ||
            res.data.latitude == undefined ||
            res.data.latitude == "" ||
            res.data.longitude == null ||
            res.data.longitude == undefined ||
            res.data.longitude == ""
          ) {
            console.log("dont show location");

            this.items["isShowlocation"] = false;
          } else {
            console.log("show location");

            this.items["isShowlocation"] = true;
            this.items["latitude"] = res.data.latitude;
            this.items["longitude"] = res.data.longitude;
          }
          console.log("items list");
          console.log(this.items);
          console.log("has rating", this.items.rating.total_points);
          // this.hasRating();
          this.showRating = true;
        } else {
          this.items["switch"] = "empty";
        }
      },
      err => {
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
  }

  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.items["location"]
    );
  }
  user_is_rated(value: string) {
    this.show_rating_status = value;
    setTimeout(() => {
      this.show_rating_status = "";
    }, 2000);
  }
  getImagesPath(res) {
    let path: boolean;
    if (!res) return;
    path = res.image ? true : false;
    if (path) {
      return this.settings.IMAGE_URL + res.image;
    } else {
      // return this.settings.ITEM_DUMMY_IMAGE;
    }
  }

  updateImageUrl(event) {
    event.target.src = this.settings.ITEM_DUMMY_IMAGE;
  }

  getItem(event?) {
    console.log("get comments");
    console.log(this.users["next"], "\n" + this.id + "\n");

    this.apiService
      .get("forum/comments/all", {
        page: this.users["next"],
        parent_id: this.id,
        // type: 1
        type: 11 //services
      })
      .subscribe(res => {
        if (res.status) {
          if (res.data.total > 0) {
            let data: any[];
            data = res.data.data;
            this.users["comments"] = this.users["comments"].concat(data);
          } else {
            this.users["comments"] = res.data.data;
          }
          this.users["next"] = res.data.current_page + 1;
          this.users["isPaginate"] = res.data.current_page < res.data.last_page;
        } else {
          this.users["comments"] = [];
          this.users["next"] = 1;
        }
        this.users["isNext"] = res.data.last_page > res.data.current_page;
        this.users["loadMore"] = false;

        if (event) {
          event.complete();
        }
      });
  }

  loadMore(infiniteScroll) {
    if (this.users["isPaginate"]) {
      this.getItem(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }

  onPost(commentValue) {
    this.comment = commentValue;
    this.commentValue = "";
    this.update["comment"] = this.comment;
    this.update["parent_id"] = this.id;
    // this.update["type"] = 1;
    this.update["type"] = 11; //service
    if (this.comment) {
      this.postComment();
      this.comment = null;
    }
  }
  postComment() {
    if (this.commentValue != "" || this.commentValue != undefined) {
      this.apiService
        .postData(this.update, "forum/comments/store")
        .subscribe(res => {
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
  getOtherPath(res) {
    let path: boolean;
    path = res.profile_picture ? true : false;
    if (path) {
      return this.settings.IMAGE_URL + res.profile_picture;
    }
    return false;
  }

  deleteComment(id, index) {
    this.apiService.deleteData("forum/comments/delete/" + id).subscribe(res => {
      if (res.status) {
        this.users["comments"].splice(index, 1);
      }
    });
  }
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
  getDate(date) {
    let event = new Date(date);
    let Data = event.toLocaleDateString();
    return Data;
  }

  goback() {
    this.navCtrl.pop();
  }
  report(type, id?) {
    console.log("type:-" + type);
    let alert = this.alertctrl.create();
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
          // type: this.url,
          // type: "events",
          type: type,
          fk_id: this.id,
          reason: data,
          listing: 0
        };
        console.log("report-payload");
        console.log(payload);

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
  suggest() {
    let token = this.db_service.accessToken();
    if (token.hasOwnProperty("access")) {
      this.navCtrl.push("SuggestServicesPage");
    } else {
      this.global_items.showAlert("Oops", "Please login first", "error");
    }
  }
  contact_to_person() {
    console.log("contact:" + this.items["phone"]);
    if (
      this.items["phone"] == null ||
      this.items["phone"] == "" ||
      this.items["phone"] == undefined
    ) {
      this.global_items.showToast("Sorry no contact details found");
    } else {
      this.show_call = true;
      this.callNumber
        .callNumber(this.items["phone"], true)
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
}
