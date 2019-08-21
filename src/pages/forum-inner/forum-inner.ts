import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Toast } from "@ionic-native/toast";
import { Storage } from "@ionic/storage";
import {
  AlertController,
  IonicPage,
  Keyboard,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { BadRequestError } from "../../Errors/bad-request-error";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";
import { DatabasesService } from "../../services/databases.service";
import { StaticSettings } from "../../services/settings.service";
import { WebService } from "./../../services/non-api.service";
import { DatePipe } from "@angular/common";

/**
 * Generated class for the ForumInnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "ForumInnerPage" })
@Component({
  selector: "page-forum-inner",
  templateUrl: "forum-inner.html"
})
export class ForumInnerPage implements OnInit {
  user_rate = 0;
  commentValue = "";
  public id: any = {};
  public type: any = {};
  public category: any = {};
  public url: any = {};
  public items: any = {};
  comment: any = {};
  users: any[] = [];
  update: any = {};
  toggle: boolean;
  type_id: any = {};
  sendUrl: any = {};
  reportOption: any = {};
  userId: any = {};
  showRating: boolean = false;

  //more details variables
  venue: any;
  average_prices: any;
  cuisine: any;
  restaurants_features: any;
  meals: any;
  good_for: any;
  //------------------------------------

  //--------comment start
  c_parent_id: any;
  c_type_id: any;
  //-----------comment end
  show_rating_status = "";
  e_id = null;
  slide_image_list = [];
  constructor(
    public global_items: GlobalItemsProvider,
    private datePipe: DatePipe,
    // private launchNavigator: LaunchNavigatorOriginal,
    private iab: InAppBrowser,
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: CommonApiService,
    public settings: StaticSettings,
    private socialSharing: SocialSharing,
    public non_api_service: WebService,
    public dbservice: DatabasesService,
    private sanitizer: DomSanitizer,
    public atrCtrl: AlertController,
    private toast: Toast,
    private storage: Storage,
    public toastCtrl: ToastController,
    private keyboard: Keyboard
  ) {
    this.id = navParams.get("id");
    this.type = navParams.get("type");
    this.category = navParams.get("category");
    console.log("id:-" + this.id);
    console.log("type:-" + this.type);
    console.log("category:-" + this.category);

    this.c_type_id = navParams.get("c_type");
    this.c_parent_id = navParams.get("c_parent_id");
    console.log("c_id:-" + this.c_type_id);
    console.log("c_parent_id:-" + this.c_parent_id);

    this.users["next"] = 1;
    this.users["loadMore"] = false;
    this.users["comments"] = [];

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

  ngOnInit() {
    this.settingPage();
    this.getItem();
    this.hasRating();
    this.fetchUserId();
    // this.getcurrent_date();
    //this.load_comments();
  }
  getcurrent_date() {
    let current_date: any;
    current_date = new Date();
    current_date.setDate(current_date.getDate());
    current_date = this.datePipe.transform(current_date, "dd/MM/yyyy");
    return current_date;
  }
  fetchUserId() {
    this.storage.get("id").then(val => {
      this.userId = val;
      console.log("userid:-" + this.userId);
    });
  }

  // ngAfterContentInit(){
  //     this.isRated();
  // }

  toggleIcon() {
    this.toggle = !this.toggle;
  }
  //setting page start
  settingPage() {
    if (this.type == "feeds") {
      console.log("type:-" + this.type);
      this.url = "feeds";
      this.type_id = "9";
      this.getForumItem();
    }
    if (this.type == "events") {
      console.log("type:-" + this.type);
      this.url = "events/show";
      this.type_id = "9";
      this.getTourism_comments();
    }
    if (this.type == "relax") {
      console.log("type:-" + this.type);
      this.url = "relax";
      this.type_id = "10";
      this.getForumItem();
    }

    if (this.type == "news") {
      console.log("type:-" + this.type);
      this.url = "news";
      this.type_id = "2";
      this.getForumItem();
    }
    if (this.type == "advice") {
      console.log("type:-" + this.type);
      this.url = "advices-help";
      this.type_id = "3";
      this.getForumItem();
    }
    if (this.type == "muscat") {
      console.log("type:-" + this.type);
      this.url = "muscat-living";
      this.type_id = "4";
      this.getForumItem();
    }

    //------------------------- start
    if (this.type == "todo") {
      this.url = "tourism/" + this.type;
      this.type_id = "5";
      this.getTourism_comments();
    }
    if (this.type == "hotels") {
      this.url = "tourism/" + this.type;
      this.type_id = "7";
      this.getTourism_comments();
    }
    if (this.type == "restaurants") {
      this.url = "tourism/" + this.type;
      this.type_id = "6";
      this.getTourism_comments();
    }
    if (this.type == "attractions") {
      this.url = "tourism/" + this.type;
      this.type_id = "8";
      this.getTourism_comments();
    }
    if (this.type == "feeds") {
      this.url = "tourism/" + this.type;
      this.type_id = "9";
      this.getTourism_comments();
    }

    if (this.type == "relax") {
      this.url = "tourism/" + this.type;
      this.type_id = "10";
      this.getTourism_comments();
    }

    //----------------------------- end
    if (this.type == "tourism") {
      this.type_id = "2";
      if (this.category == "todo") {
        this.url = "todo";
        this.type_id = "5";
        this.getTourism();
      }
      if (this.category == "hotels") {
        this.url = "hotels";
        this.type_id = "7";
        this.getTourism();
      }
      if (this.category == "restaurants") {
        this.url = "restaurants";
        this.type_id = "6";
        this.getTourism();
      }
      if (this.category == "attractions") {
        this.url = "attractions";
        this.type_id = "8";
        this.getTourism();
      }
    }
  }
  //setting page end
  suggest() {
    //this.showToast("selected_item\t:-" + this.category);
    let token = this.dbservice.accessToken();
    if (token.hasOwnProperty("access")) {
      if (this.type == "tourism") {
        this.type_id = "2";
        if (this.category == "todo") {
          console.log("pushing to suggest");
          this.navCtrl.push("SuggestPageThingsToDoPage");
        }
        if (this.category == "hotels") {
          console.log("pushing to suggest");

          this.navCtrl.push("SuggestPageHotelPage");
        }
        if (this.category == "restaurants") {
          console.log("pushing to suggest");
          this.navCtrl.push("SuggestPopupPage");
        }
        if (this.category == "attractions") {
          console.log("pushing to suggest");
          this.navCtrl.push("SuggestPageAttractionPage");
        }
      }
    } else {
      this.global_items.showAlert("Oops", "Please login first", "error");
    }
  }
  getForumItem() {
    this.items = {};
    console.log("inside get forum inner");
    console.log("forum/" + this.url + "/" + this.id);
    this.apiService.get("forum/" + this.url + "/" + this.id).subscribe(
      res => {
        console.log(this.settings.BASE_URL + this.url + "/" + this.id);
        console.log(res);

        if (res.status) {
          //geting e_id
          this.e_id = res.data.eid;
          this.slide_image_list = res.data.images;

          this.items["data"] = res.data;
          this.items["title"] = res.data.title;
          this.items["related"] = res.data.related;
          this.items["description"] = res.data.description;
          this.items["user_name"] = res.data.user.s_name;
          this.items["is_verified_user"] = res.data.user.is_verified_user;
          this.items["date"] = res.data.new_date;
          this.items["location"] = res.data.location_url;
          this.items["venue"] = res.data.venue;
          this.items["image"] = res.data.image;
          this.items["switch"] = "show";

          //start
          this.items["avg_price"] = res.data.avg_price;
          this.items["cuisine"] = res.data.cuisine;
          this.items["meals"] = res.data.meals;
          this.items["features"] = res.data.features;
          this.items["good_for"] = res.data.good_for;
          this.items["contact_info"] = res.data.contact_info;
          //end
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
        } else {
          this.items["switch"] = "empty";
        }
      },
      err => {
        this.global_items.showToast("No results found");
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
    console.log("inside get");
    console.log("final values", this.items);
  }
  getImagesPath_comments(res) {
    let path: boolean;
    if (!res) return;
    path = res.profile_picture ? true : false;
    if (path) {
      return this.settings.IMAGE_URL + res.profile_picture;
    } else {
      return this.settings.ITEM_DUMMY_IMAGE;
    }
  }
  getImagesPath(res) {
    let path: boolean;
    if (!res) return;
    path = res.image ? true : false;
    if (path) {
      return this.settings.IMAGE_URL + res.image;
    } else {
      return this.settings.ITEM_DUMMY_IMAGE;
    }
  }

  getItem(event?) {
    console.log("get_item_comments");
    this.apiService
      .get("forum/comments/all", {
        page: this.users["next"],
        parent_id: this.id,
        type: this.type_id
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
          console.log(this.users["comments"]);
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
    // this.update["parent_id"] = this.id;
    this.update["parent_id"] = this.e_id;
    // this.update["type"] = 1;
    this.update["type"] = this.type_id;
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
  hide_keyboard() {
    this.keyboard.close();
  }
  getTourism() {
    this.items = {};

    // if(this.type==undefined||this.type==null){this.type="tourism"};
    let token = this.dbservice.accessToken();
    console.log("inside getTourism");
    if (token.hasOwnProperty("access")) {
      this.sendUrl = this.type + "/" + this.url + "/i/" + this.id;
      console.log("accessed");
      console.log("if_url=:\t" + this.sendUrl);
    } else {
      this.sendUrl = this.type + "/" + this.url + "/" + this.id;
      console.log("else_url=:\t" + this.sendUrl);
    }
    this.apiService.get(this.sendUrl).subscribe(
      res => {
        console.log(
          "res tourism from api:-\t" + this.settings.BASE_URL + this.sendUrl
        );
        console.log(res);

        if (res.status) {
          this.e_id = res.data.eid;
          this.slide_image_list = res.data.images;
          this.user_rate = res.data.rating_value;
          this.items["data"] = res.data;
          this.items["title"] = res.data.title;
          this.items["description"] = res.data.description;
          this.items["date"] = res.data.new_date;
          this.items["location"] = res.data.location;
          this.items["venue"] = res.data.venue;
          this.items["switch"] = "show";
          this.items["rating"] = res.data.rating;

          //start
          this.items["avg_price"] = res.data.avg_price;
          this.items["cuisine"] = res.data.cuisine;
          this.items["meals"] = res.data.meals;
          this.items["features"] = res.data.features;
          this.items["good_for"] = res.data.good_for;
          this.items["user_name"] = res.data.user.s_name;
          this.items["is_verified_user"] = res.data.user.is_verified_user;
          //end
          //new fields start
          this.items["contact_info"] = res.data.contact_info;
          this.items["language"] = res.data.language;
          this.items["show_times"] = res.data.show_times;
          this.items["theatre"] = res.data.theatre;
          this.items["genre"] = res.data.genre;
          this.items["youtube_trailer"] = res.data.youtube_trailer;
          this.items["booking_url"] = res.data.booking_url;
          //new fields end
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
          if (this.items["switch"] == "show") {
            console.log("inside if");
            console.log(
              "http://muscateer.bravocodesolutions.com/api/v1/" + this.sendUrl
            );
            this.showRating = true;
          }
          // this.isRated();
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
    console.log("final values", this.items);
  }
  user_is_rated(value: string) {
    this.show_rating_status = value;
    setTimeout(() => {
      this.show_rating_status = "";
    }, 2000);
  }
  getTourism_comments() {
    this.items = {};

    console.log("inside getourism comments");
    let url = this.url + "/" + this.id;
    console.log("tourism_comments_url" + url);
    this.apiService.get(url).subscribe(res => {
      console.log("res values:-\t");
      console.log(res);

      if (res.status) {
        this.e_id = res.data.eid;
        this.slide_image_list = res.data.images;
        this.user_rate = res.data.rating_value;
        this.items["data"] = res.data;
        this.items["title"] = res.data.title;
        this.items["description"] = res.data.description;
        this.items["date"] = res.data.new_date;
        this.items["location"] = res.data.location;
        this.items["venue"] = res.data.venue;
        this.items["switch"] = "show";
        this.items["rating"] = res.data.rating;

        //start
        this.items["avg_price"] = res.data.avg_price;
        this.items["cuisine"] = res.data.cuisine;
        this.items["meals"] = res.data.meals;
        this.items["features"] = res.data.features;
        this.items["good_for"] = res.data.good_for;
        //end
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
        if (this.items["switch"] == "show") {
          console.log("inside if");
          console.log(
            "http://muscateer.bravocodesolutions.com/api/v1/" + this.sendUrl
          );
          this.showRating = true;
        }
        // this.isRated();
      } else {
        this.items["switch"] = "empty";
      }
    }),
      err => {
        console.log("Oops!");
        this.global_items.showToast("Something went wrong");
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      };
    console.log("final values", this.items);
  }

  getComment(id) {
    this.items = {};

    this.apiService.get(this.sendUrl).subscribe(
      res => {
        console.log("res comments:-\t");
        console.log(res);

        if (res.status) {
          this.items["data"] = res.data;
          this.items["title"] = res.data.title;
          this.items["description"] = res.data.description;
          this.items["date"] = res.data.new_date;
          this.items["location"] = res.data.location;
          this.items["venue"] = res.data.venue;
          this.items["switch"] = "show";
          this.items["rating"] = res.data.rating;

          //start
          this.items["avg_price"] = res.data.avg_price;
          this.items["cuisine"] = res.data.cuisine;
          this.items["meals"] = res.data.meals;
          this.items["features"] = res.data.features;
          this.items["good_for"] = res.data.good_for;
          //end
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
          if (this.items["switch"] == "show") {
            console.log("inside if");
            console.log(
              "http://muscateer.bravocodesolutions.com/api/v1/" + this.sendUrl
            );
            this.showRating = true;
          }
          // this.isRated();
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

  hasRating() {
    try {
      let exist = this.items.rating.total_points ? true : false;
      if (exist) {
        return this.items.rating.total_points;
      } else {
        return -1;
      }
    } catch (e) {
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

  isRated() {
    try {
      let exist = this.items.data.user_rating ? true : false;
      if (exist) {
        return this.items.data.user_rating.score;
      } else {
        return -1;
      }
    } catch (e) {
      return -1;
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ForumInnerPage");
  }

  report(type, id?) {
    console.log("type:-" + type);
    if (type == "comment") {
      this.url = "comment";
      this.id = id;
    }
    if (this.url.indexOf("tourism") >= 0) {
      let splited_item = this.url.split("/");
      this.url = splited_item[1];
    }
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
          type: this.url,
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
              // this.global_items.showToast("Something went wrong");
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

  goback() {
    this.navCtrl.pop();
  }
  getDate(date) {
    let event = new Date(date);
    let Data = event.toLocaleDateString();
    return Data;
  }
  Gotomap(latitude, longitude) {
    console.log(latitude, longitude);
    // this.launchNavigator.navigate([latitude, longitude])
    let url =
      "https://www.google.com/maps/search/?api=1&query=" +
      latitude +
      "," +
      longitude;
    const browser = this.iab.create(url, "_system");
    browser.on("loadstop").subscribe(event => {});
  }
  Openinbrowser(url) {
    console.log(url);
    if (url == undefined || url == null || url == "") {
      console.log("empty url");
      this.global_items.showToast("Invalid Url");
    } else {
      let link = `https://youtu.be/${url}`;
      const browser = this.iab.create(link, "_system");
      browser.on("loadstop").subscribe(event => {});
    }
  }
  Bookshow(url) {
    console.log(url);
    if (url == undefined || url == null || url == "") {
      console.log("empty url");
      this.global_items.showToast("Invalid Url");
    } else {
      const browser = this.iab.create(url, "_system");
      browser.on("loadstop").subscribe(event => {});
    }
  }
}
