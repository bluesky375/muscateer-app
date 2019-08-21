import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { StaticSettings } from "../../services/settings.service";
import { BadRequestError } from "../../Errors/bad-request-error";
import { CommonApiService } from "../../services/common-api.service";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SocialSharing } from "@ionic-native/social-sharing";
import { DatabasesService } from "../../services/databases.service";
@IonicPage({
  name: "TabJobJobinnerPage"
})
@Component({
  selector: "page-tab-job-jobinner",
  templateUrl: "tab-job-jobinner.html"
})
export class TabJobJobinnerPage implements OnInit {
  items = {};
  head = {};
  reportOption: any = {};
  slide_image_list = [];
  constructor(
    private socialSharing: SocialSharing,
    private iab: InAppBrowser,
    public global_items: GlobalItemsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public settings: StaticSettings,
    public apiService: CommonApiService,
    public atrCtrl: AlertController,
    public db_service: DatabasesService
  ) {
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

  ionViewDidLoad() {
    console.log("ionViewDidLoad TabJobJobinnerPage");
  }
  ngOnInit() {
    console.log(this.navParams.get("source"));
    let source = this.navParams.get("source");
    // id: item_id,
    // title: job_title
    this.setup(source);
  }
  setup(source) {
    if (source.title == "jobs_available") {
      this.head["title"] = "Jobs Available";
      let value = 1;
      let api = "job-available/";
      let item_id = source.id;
      this.setData(value, api, item_id);
    } else if (source.title == "jobs_wanted") {
      this.head["title"] = "Jobs wanted";
      let value = 0;
      let api = "job-wanted/";
      let item_id = source.id;
      this.setData(value, api, item_id);
    } else {
      this.head["title"] = "";
    }
  }
  setData(value, api, id) {
    if (value == "1") {
      //job available api
      this.getData(api, id);
    } else if (value == "0") {
      //job wanted api
      this.getData(api, id);
    }
  }

  getData(api, id) {
    this.global_items.showLoading("Please wait...");
    this.apiService.get(api + id).subscribe(
      res => {
        this.global_items.dismissLoading();
        if (res.status) {
          this.items = res.data;
          this.slide_image_list = res.data.images;
          if (
            this.items["latitude"] == null ||
            this.items["latitude"] == undefined ||
            this.items["latitude"] == "" ||
            this.items["longitude"] == null ||
            this.items["longitude"] == undefined ||
            this.items["longitude"] == ""
          ) {
            Object.assign(this.items, { isShowlocation: false });
          } else {
            Object.assign(this.items, { isShowlocation: true });
          }
        } else {
          this.global_items.showToast("Something went wrong");
          this.goback();
        }
      },
      err => {
        this.global_items.dismissLoading();
        console.log(err);
        this.global_items.showToast("Something went wrong");
        this.goback();
      }
    );
  }

  goback() {
    this.navCtrl.pop();
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
  share(item) {
    console.log(item.share_url);
    let message = item.title;
    let subject = "";
    let file = null;
    let url = item.share_url;
    this.socialSharing
      .share(message, subject, file, url)
      .then(() => {
        // success
      })
      .catch(() => {
        // error
      });
  }
  report(type, id?) {
    console.log("type:-" + type);
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
          type: "jobs",
          fk_id: id,
          reason: data,
          listing: 0
        };
        console.log("report-payload");
        console.log(payload);

        this.apiService.postData(payload, "report-spam").subscribe(
          res => {
            console.log(res);
            if (res.status) {
              this.global_items.showToast("Your report has been submitted");
            }
          },
          error => {
            this.global_items.showToast("Something went wrong");
            if (error instanceof BadRequestError) {
              if (error.originalError.error.error_message) {
                let errors = error.originalError.error.error_message;
                for (let error in errors) {
                }
              }
            } else {
            }
          }
        );
        console.log("data:-" + data);
      }
    });
    alert.present();
  }
  Apply(apply_method, apply_url, pk_i_id) {
    let token = this.db_service.accessToken();
    if (token.hasOwnProperty("access")) {
      console.log("apply_method:", apply_method, "\n apply-url:", apply_url);
      switch (apply_method) {
        case "Muscateer":
          {
            //muscateer
            this.navCtrl.push("JobApplyFormPage", { id: pk_i_id });
          }

          break;
        case "Company Website":
          {
            //Company Website
            this.go_to_page(apply_url);
          }
          break;
        case "Email":
          {
            //email
            this.send_email(apply_url);
          }
          break;
        default:
          break;
      }
    } else {
      this.global_items.showAlert("Oops", "Plase login first", "error");
    }
  }
  send_email(mail_id: string) {
    if (mail_id == "" || mail_id == undefined) {
      this.global_items.showToast("Invalid Address");
    } else if (mail_id.includes("@")) {
      let url = `mailto:${mail_id}?subject=my%20App`;
      window.location.href = url;
    } else {
      this.global_items.showToast("Invalid Address");
    }
  }
  go_to_page(url) {
    console.log("clicked>>", url);
    if (url == "" || url == undefined || url == null) {
      this.global_items.showToast("Invalid Address");
    } else {
      const browser = this.iab.create(url, "_system");
      browser.on("loadstop").subscribe(
        event => {},
        err => {
          this.global_items.showToast("Invalid Address");
        }
      );
    }
  }
  suggest(head) {
    let token = this.db_service.accessToken();
    if (token.hasOwnProperty("access")) {
      if (head == "Jobs wanted") {
        console.log("jobs wanted>>");
        this.navCtrl.push("JobWantedAddPage");
      } else if (head == "Jobs Available") {
        console.log("jobs available");
        this.navCtrl.push("JobAvailableAddPage");
      } else {
        console.log("something went wrong");
        this.navCtrl.pop();
      }
    } else {
      this.global_items.showToast("Please login first");
    }
  }
}
