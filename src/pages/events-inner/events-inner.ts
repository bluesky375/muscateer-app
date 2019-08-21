import { Platform } from "ionic-angular/platform/platform";
import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Calendar } from "@ionic-native/calendar";
import { File } from "@ionic-native/file";
import { FileTransfer } from "@ionic-native/file-transfer";
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
import { CommonApiService } from "../../services/common-api.service";
import { StaticSettings } from "../../services/settings.service";
import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
@IonicPage({ name: "EventsInnerPage" })
@Component({
  selector: "page-events-inner",
  templateUrl: "events-inner.html"
})
export class EventsInnerPage implements OnInit {
  starting_date = "";
  ending_date = "";
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
  slide_imageslist = [];
  eid = "";
  constructor(
    public platform: Platform,
    private calander: Calendar,
    // private launchNavigator: LaunchNavigatorOriginal,
    public alertctrl: AlertController,
    private toast: Toast,
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: CommonApiService,
    public sanitizer: DomSanitizer,
    public settings: StaticSettings,
    private storage: Storage,
    private socialSharing: SocialSharing,
    public global_items: GlobalItemsProvider,
    private file: File,
    private transfer: FileTransfer,
    private keyboard: Keyboard,
    private toastCtrl: ToastController,
    private iab: InAppBrowser
  ) {
    this.id = navParams.get("id");
    this.users["next"] = 1;
    this.users["loadMore"] = false;
    this.users["comments"] = [];
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EventsInnerPage");
  }

  ngOnInit() {
    this.getForumItem();
    this.getItem();
    this.fetchUserId();
    this.homesetup();
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
    this.apiService.get("events/show/" + this.id).subscribe(
      res => {
        // this.apiService.postData({}, "events/show/").subscribe(res => {
        if (res.status) {
          console.log("events/show item");

          console.log(res);
          this.slide_imageslist = res.data.images;
          this.starting_date = res.data.starting_date;
          this.ending_date = res.data.ending_date;
          this.eid = res.data.eid;
          this.items["data"] = res.data;
          this.items["title"] = res.data.title;
          this.items["related"] = res.data.related;
          this.items["description"] = res.data.description;
          this.items["user_name"] = res.data.user.s_name;
          this.items["is_verified_user"] = res.data.user.is_verified_user;
          this.items["date"] = res.data.new_date;
          this.items["location"] = res.data.location_url;
          this.items["venue"] = res.data.venue;
          this.items["event_date"] = res.data.event_date;
          this.items["new_date"] = res.data.new_date;
          this.items["switch"] = "show";
          this.items["isFav"] = res.data.isFavourite;
          this.isSaved = this.items["isFav"];
          // if (this.items["isFav"]) {
          //   this.isSaved = this.items["isFav"].fav ? true : false;
          // }
          if (res.data.brochure_images.length > 0) {
            this.items["pdf"] = res.data.brochure_images[0].path;
            res.data.brochure_images[0].path;
          } else {
            this.items["pdf"] = "0";
          }

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
          // console.log("pdf is:-", this.items["pdf"]);

          // if (this.items["isFav"]) {
          //   this.isSaved = this.items["isFav"].fav ? true : false;
          // }
          console.log("items list");
          console.log(this.items);
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

  onFav() {
    if (this.isSaved) {
      this.deleteSaved();
    } else {
      this.postSave();
    }
  }

  postSave() {
    let postParams = {
      event_id: this.id
    };
    this.apiService.postData(postParams, "events/save").subscribe(
      res => {
        console.log("events save");
        console.log(res);
        if (res.status) {
          this.isSaved = !this.isSaved;
          this.global_items.showToast("Saved");
        }
      },
      err => {
        this.global_items.showToast("Something went wrong");
        // console.log("Something went wrong");
      }
    );
  }

  deleteSaved() {
    this.apiService.deleteData("events/save/" + this.id).subscribe(res => {
      if (res.status) {
        this.isSaved = !this.isSaved;
        this.global_items.showToast("Unsaved");
      }
      console.log(res);
    });
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
    this.apiService
      .get("forum/comments/all", {
        page: this.users["next"],
        parent_id: this.id,
        type: 1
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
    // this.update["parent_id"] = this.id;
    this.update["parent_id"] = this.eid;
    this.update["type"] = 1;
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
  report(type) {
    console.log("type:-" + type);
    // if (type == 'comment') {
    //   this.url = 'comment';
    //   this.id = id;
    // }
    // if(this.url.indexOf("tourism") >= 0)
    // {
    //   let splited_item=this.url.split('/');
    //   this.url=splited_item[1];
    // }
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
          type: "events",
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
  View_pdf(pdf, title) {
    console.log("pdf", pdf);
    let pdf_url = this.settings.BASE_URL + "/uploads/" + pdf;
    const browser = this.iab.create(pdf_url, "_system");
    browser.on("");
  }
  Download_pdf(pdf, title) {
    console.log("code here download pdf...");
    console.log(pdf);
    pdf = this.settings.BASE_URL + "/uploads/" + pdf;
    let path = "";
    if (this.platform.is("ios")) {
      path = this.file.cacheDirectory + "Muscateer/" + title + ".pdf";
    } else if (this.platform.is("android")) {
      path = this.file.externalRootDirectory + "Muscateer/" + title + ".pdf";
    } else {
      path = "no path found";
    }
    this.downloadAndOpenPdf(pdf, title, path);
  }

  downloadAndOpenPdf(url, title, path) {
    console.log("path", path);

    const transfer = this.transfer.create();
    //progress
    transfer.onProgress(progressEvent => {
      console.log(progressEvent);
      if (progressEvent.lengthComputable) {
        var perc = Math.floor(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        // status.innerHTML = perc + "% loaded...";
        console.log(perc);
        let temp = perc;
        this.progress = temp.toString() + "%";
        if (this.progress == "100%") {
          // this.global_items.showToast(
          //   "saved in phone storage/muscateer/" + title + ".pdf"
          // );
          let alert = this.alertctrl.create({
            message:
              "Do you want to open now? \n" +
              " saved in phone storage/muscateer/" +
              title +
              ".pdf",
            title: "DONE",
            buttons: [
              {
                text: "Cancel",
                role: "cancel",
                cssClass: "secondary",
                handler: () => {
                  console.log("Confirm Cancel: alert");
                  alert.dismiss();
                }
              },
              {
                text: "Okay",
                handler: () => {
                  console.log("Confirm Okay");
                  alert.dismiss();
                  const browser = this.iab.create(url, "_system");
                  browser.on("");
                }
              }
            ]
          });
          alert.present();
        }
      } else {
        // if (status.innerHTML == "") {
        //   status.innerHTML = "Loading";
        // } else {
        //   status.innerHTML += ".";
        // }
        console.log("loading");
      }
    });
    //
    transfer
      .download(
        url,
        // this.file.externalRootDirectory + "muscateer/" + title + ".pdf",
        path,
        true
      )
      .then(
        entry => {
          let url = entry.toURL();
          console.log(url);
        },
        error => {
          console.log("download failed: ");
          console.log(error);
          // this.global_items.showToast("Download failed");
          let alert = this.alertctrl.create({
            message: "Download failed, \n" + " Do you want to open now?",
            title: "ERROR",
            buttons: [
              {
                text: "Cancel",
                role: "cancel",
                cssClass: "secondary",
                handler: () => {
                  console.log("Confirm Cancel: alert");
                  alert.dismiss();
                }
              },
              {
                text: "Okay",
                handler: () => {
                  console.log("Confirm Okay");
                  alert.dismiss();
                  const browser = this.iab.create(url, "_system");
                  browser.on("");
                }
              }
            ]
          });
          alert.present();
        }
      );
  }
  show_local_notification() {}
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
  add_to_calanedr(event_date, title) {
    console.log(event_date);
    console.log(title);
    // event_date = "2019-01-23";
    // event_date is like "year month date"
    if (event_date == null || event_date == undefined || event_date == "") {
      this.global_items.showToast("Something went wrong");
    } else {
      let startDate = new Date(event_date);
      let endDate = new Date(event_date);
      try {
        this.calander
          .createEvent(title, null, null, startDate, endDate)
          .then(res => {
            console.log("success");
            console.log(res);
            let toast = this.toastCtrl.create({
              message: this.global_items.do_translation("Event added"),
              duration: 3000,
              showCloseButton: true,
              closeButtonText: this.global_items.do_translation("Show")
            });

            // toast.onDidDismiss(() => {
            //   console.log("Toast buton clicked");
            //   this.calander.openCalendar(startDate);
            // });
            // toast.present();

            let closedByTimeout = false;
            let timeoutHandle = setTimeout(() => {
              closedByTimeout = true;
              toast.dismiss();
            }, 3000);
            toast.onDidDismiss(() => {
              if (closedByTimeout) return;
              clearTimeout(timeoutHandle);
              this.calander.openCalendar(startDate);
              console.log("dismiss manually");
            });
            toast.present();
          })
          .catch(err => {
            console.log(err);
            this.global_items.showToast("Something went wrong");
          });
      } catch (e) {
        console.log(e);
        this.global_items.showToast("Something went wrong");
      }
    }
  }
}
