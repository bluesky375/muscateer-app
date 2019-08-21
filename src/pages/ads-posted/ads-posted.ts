import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  PopoverController
} from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";
import { StaticSettings } from "../../services/settings.service";

/**
 * Generated class for the AdsPostedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "AdsPostedPage"
})
@Component({
  selector: "page-ads-posted",
  templateUrl: "ads-posted.html"
})
export class AdsPostedPage implements OnInit {
  selected_head = {
    classifieds: true,
    forums: false,
    jobs: false
  };
  categoryOption: any = [];
  type: any = {};
  url: any = {};
  items: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public apiservice: CommonApiService,
    public settings: StaticSettings,
    public global_items: GlobalItemsProvider,
    public alertController: AlertController
  ) {
    this.url = "items";
    this.items["next"] = 1;
    this.items["data"] = [];

    // this.categoryOption = [
    //   { value: "0", name: this.global_items.do_translation("classifieds") },
    //   { value: "1", name: this.global_items.do_translation("feeds") },
    //   { value: "2", name: this.global_items.do_translation("news") },
    //   { value: "3", name: this.global_items.do_translation("advices") },
    //   { value: "4", name: this.global_items.do_translation("muscat") }
    //   // { value: "5", name: this.global_items.do_translation("events") }
    // ];

    this.set_categories();
  }

  ngOnInit() {
    // this.getTimeline();
  }
  set_categories() {
    this.categoryOption = {};
    this.categoryOption = {
      forums: [
        {
          value: 1,
          name: "News & Feeds"
        },
        {
          value: 2,
          name: "Muscateer Pets"
        },
        {
          value: 3,
          name: "Advice & Help"
        },
        {
          value: 4,
          name: "Muscat Foodies"
        },
        {
          value: 5,
          name: "Relax Lounge"
        }
      ],
      jobs: [
        {
          value: 6,
          name: "Jobs Available"
        },
        {
          value: 7,
          name: "Jobs Wanted"
        }
      ]
    };
  }
  ionViewWillEnter() {
    // this.url = "items";
    // this.items["next"] = 1;
    // this.items["data"] = [];
    // this.ngOnInit();
    // this.getTimeline();
    this.selectCategory(0);
  }
  selectType(res) {
    console.log("selected", res);
    // this.selectCategory(res);
  }

  show_alert(value) {
    switch (value) {
      case 0:
        {
          this.selectCategory(0);
        }

        break;
      case 1:
        {
          let alert = this.alertController.create();
          this.categoryOption.forums.forEach(element => {
            alert.addInput({
              type: "radio",
              label: this.global_items.do_translation(element.name),
              value: element.value
            });
          });
          alert.addButton(this.global_items.do_translation("Cancel"));
          alert.addButton({
            text: this.global_items.do_translation("OK"),
            handler: data => {
              console.log("Site:", data);
              this.selectCategory(data);
            }
          });
          alert.present();
        }
        break;
      case 2:
        {
          let alert = this.alertController.create();
          this.categoryOption.jobs.forEach(element => {
            alert.addInput({
              type: "radio",
              label: this.global_items.do_translation(element.name),
              value: element.value
            });
          });
          alert.addButton(this.global_items.do_translation("Cancel"));
          alert.addButton({
            text: this.global_items.do_translation("OK"),
            handler: data => {
              console.log("Site:", data);
              this.selectCategory(data);
            }
          });
          alert.present();
        }

        break;

      default:
        break;
    }
  }
  selectCategory(res) {
    this.url = "items";
    this.items["next"] = 1;
    this.items["data"] = [];
    if (res <= 5 && res > 0) {
      this.selected_head.classifieds = false;
      this.selected_head.forums = true;
      this.selected_head.jobs = false;
    } else if (res > 5) {
      this.selected_head.classifieds = false;
      this.selected_head.forums = false;
      this.selected_head.jobs = true;
    } else {
      this.selected_head.classifieds = true;
      this.selected_head.forums = false;
      this.selected_head.jobs = false;
    }
    switch (res) {
      case 0:
        {
          this.url = "items";
          this.getTimeline();
        }
        break;
      case 1:
        {
          this.url = "news";
          this.getTimeline();
        }
        break;
      case 2:
        {
          this.url = "feeds";
          this.getTimeline();
        }
        break;
      case 3:
        {
          this.url = "advices";
          this.getTimeline();
        }
        break;
      case 4:
        {
          this.url = "muscat";
          this.getTimeline();
        }
        break;
      case 5:
        {
          this.url = "relax";
          this.getTimeline();
        }
        break;
      case 6:
        {
          this.url = "jobs-available";
          this.getTimeline();
        }
        break;
      case 7:
        {
          this.url = "jobs-wanted";
          this.getTimeline();
        }
        break;

      default:
        {
          this.selectCategory(0);
        }
        break;
    }
  }
  // selectCategory(res) {
  //   this.type = res.name;
  //   console.log(this.type);
  //   if (this.type == "classifieds") {
  //     this.url = "items";
  //     this.items["data"] = [];
  //     this.items["next"] = 1;
  //     this.getTimeline();
  //   }
  //   if (this.type == "feeds") {
  //     this.url = "feeds";
  //     this.items["data"] = [];
  //     this.items["next"] = 1;
  //     this.getTimeline();
  //   }
  //   if (this.type == "news") {
  //     this.url = "news";
  //     this.items["data"] = [];
  //     this.items["next"] = 1;
  //     this.getTimeline();
  //   }
  //   if (this.type == "events") {
  //     this.url = "events";
  //     this.items["data"] = [];
  //     this.items["next"] = 1;
  //     this.getTimeline();
  //   }
  //   if (this.type == "advices") {
  //     this.url = "advices";
  //     this.items["data"] = [];
  //     this.items["next"] = 1;
  //     this.getTimeline();
  //   }
  //   if (this.type == "muscat") {
  //     this.url = "muscat";
  //     this.items["data"] = [];
  //     this.items["next"] = 1;
  //     this.getTimeline();
  //   }
  // }

  getTimeline(event?) {
    console.log(this.url);
    this.apiservice
      .get("user/timeline/", {
        type: this.url,
        page: this.items["next"]
      })
      .do(res => this.filterData(res))
      .subscribe(res => {
        console.log("data is ");
        console.log(res);

        if (event) event.complete();
      });
  }

  filterData(res) {
    this.items["display"] = "loading";
    if (res.status) {
      if (res.data.total > 0) {
        if (this.items["data"].length > 0) {
          this.items["data"] = this.items["data"].concat(res.data.data);
        } else {
          this.items["data"] = res.data.data;
        }
        this.items["next"] = res.data.current_page + 1;
        this.items["isPaginate"] = res.data.current_page < res.data.last_page;
        this.items["display"] = "show";
      } else {
        this.items["display"] = "empty";
      }
    } else {
      this.items["display"] = "empty";
    }
  }

  loadMore(infiniteScroll) {
    if (this.items["isPaginate"]) {
      this.getTimeline(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }
  getImagesPath(res) {
    // console.log("get image path res:-->> \n ", res);
    // console.log(
    //   "get image path :-->> \n ",
    //   this.settings.IMAGE_URL + res.s_path
    // );
    // console.log(
    //   "get image path path2:-->> \n ",
    //   this.settings.IMAGE_URL + res.image
    // );
    let path: boolean;
    let path2: boolean;
    if (!res) return;
    path = res.s_path ? true : false;
    path2 = res.image ? true : false;
    if (path) {
      return this.settings.IMAGE_URL + res.s_path;
    } else if (path2) {
      return this.settings.IMAGE_URL + res.image;
    } else {
      return this.settings.ITEM_DUMMY_IMAGE;
    }
  }
  getItemId(id) {
    this.navCtrl.push("InnerClassifiedsPage", {
      id: id
    });
  }

  updateImageUrl(event) {
    event.target.src = this.settings.ITEM_DUMMY_IMAGE;
  }

  presentPopover(myEvent, id) {
    console.log(id);
    let data = {};
    data["id"] = id;
    data["type"] = this.url;

    let popover = this.popoverCtrl.create("EditDeletePage", data);
    popover.present({
      ev: myEvent
    });
  }

  goback() {
    this.navCtrl.pop();
  }
  edit_delete(item, edit_delete, id) {
    console.log("item id", id);

    switch (edit_delete) {
      case "edit":
        {
          this.edit(this.url, id, item);
        }

        break;
      case "delete":
        {
          // this.delete(this.url, id);
          this.presentAlertConfirm(id);
        }
        break;
      case "view":
        {
          if (this.selected_head.classifieds == true) {
            this.navCtrl.push("InnerClassifiedsPage", { id: id });
          }
          if (this.selected_head.forums == true) {
            let type = this.url;
            if (this.url == "advices") {
              type = "advice";
            }
            this.navCtrl.push("ForumInnerPage", { id: id, type: type });
          }
          if (this.selected_head.jobs == true) {
            let type = this.url;
            if (this.url == "jobs-wanted") {
              type = "jobs_wanted";
            } else if (this.url == "jobs-available") {
              type = "jobs_available";
            }
            let source = {
              id: id,
              title: type
            };
            this.navCtrl.push("TabJobJobinnerPage", { source: source });
          }
        }
        break;
      default:
        {
          this.global_items.showToast("Something went wrong");
        }
        break;
    }
  }
  presentAlertConfirm(id?) {
    const alert = this.alertController.create({
      message: this.global_items.do_translation("Do you want to delete?"),
      buttons: [
        {
          text: this.global_items.do_translation("Cancel"),
          role: "Cancel",
          handler: blah => {
            console.log("Confirm Cancel: blah");
            alert.dismiss();
          }
        },
        {
          text: this.global_items.do_translation("Ok"),
          handler: () => {
            console.log("Confirm Okay");
            this.delete(this.url, id);
          }
        }
      ]
    });

    alert.present();
  }
  edit(type, id, data) {
    if (type == "items") {
      this.navCtrl.push("EditClassifiedsPage", {
        id: id,
        type: type
      });
    }
    if (type == "feeds") {
      this.navCtrl.push("EditForumsPage", {
        id: id,
        type: type
      });
    }
    if (type == "news") {
      this.navCtrl.push("EditForumsPage", {
        id: id,
        type: type
      });
    }
    if (type == "events") {
      this.navCtrl.push("EditEventsPage", {
        id: id,
        type: type
      });
    }
    if (type == "advices") {
      this.navCtrl.push("EditForumsPage", {
        id: id,
        type: type
      });
    }
    if (type == "relax") {
      this.navCtrl.push("EditForumsPage", {
        id: id,
        type: type
      });
    }
    if (type == "muscat") {
      this.navCtrl.push("EditForumsPage", {
        id: id,
        type: type
      });
    }
    if (type == "jobs-available") {
      this.navCtrl.push("JobAvailableEditPage", { data: data, id: id });
    }
    if (type == "jobs-wanted") {
      this.navCtrl.push("JobWantedEditPage", { data: data, id: id });
    }
  }
  delete_jobs(url, id) {
    this.apiservice.postData({}, url + id).subscribe(
      res => {
        this.global_items.showToast("Success");
        this.selectCategory(0);
      },
      err => {
        this.global_items.showToast("Something went wrong");
      }
    );
  }
  delete(type, id) {
    console.log("type and id:", type + id);
    if (type == "jobs-available") {
      this.delete_jobs("delete/job-available/", id);
    }
    if (type == "jobs-wanted") {
      this.delete_jobs("delete/job-wanted/", id);
    }
    if (type == "items") {
      this.deleteItem(id);
    }
    if (type == "feeds") {
      this.url = "feeds";
      this.deleteForum(id);
    }
    if (type == "news") {
      this.url = "news";
      this.deleteForum(id);
    }
    if (type == "events") {
      this.deleteEvents(id);
    }
    if (type == "advices") {
      this.url = "advices-help";
      this.deleteForum(id);
    }
    if (type == "muscat") {
      this.url = "muscat-living";
      this.deleteForum(id);
    }
  }

  deleteItem(id) {
    this.apiservice.deleteData("delete/item/" + id).subscribe(res => {
      if (res.status) {
        this.global_items.showToast("Success");
        // this.navCtrl.pop();
        this.selectCategory(0);
      } else {
        this.global_items.showToast("Something went wrong");
      }
    });
  }

  deleteForum(id) {
    this.apiservice
      .deleteData("forum/" + this.url + "/d/" + id)
      .subscribe(res => {
        if (res.status) {
          // setTimeout(() => {
          //   this.navCtrl.push(AdsPostedPage);
          // }, 1500);
          this.global_items.showToast("Success");
          // this.navCtrl.pop();
          this.selectCategory(0);
        } else {
          this.global_items.showToast("Something went wrong");
        }
      });
  }
  deleteEvents(id) {
    this.apiservice.deleteData("forum/events/" + id).subscribe(res => {
      if (res.status) {
        // this.toast
        //   .show(`  deleted Succesfully.`, "2000", "bottom")
        //   .subscribe(toast => {
        //     console.log(toast);
        //   });
        setTimeout(() => {
          this.navCtrl.push("AdsPostedPage");
        }, 1500);
        this.global_items.showToast("Success");
        this.navCtrl.pop();
      } else {
        this.global_items.showToast("Something went wrong");
      }
    });
  }
}
