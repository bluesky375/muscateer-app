import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CommonApiService } from "../../services/common-api.service";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { EventsInnerPage } from "../events-inner/events-inner";
import { InnerClassifiedsPage } from "../inner-classifieds/inner-classifieds";
/**
 * Generated class for the NotificationhistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "NotificationhistoryPage"
})
@Component({
  selector: "page-notificationhistory",
  templateUrl: "notificationhistory.html"
})
export class NotificationhistoryPage implements OnInit {
  notification_history_array: any[];
  notification_history_array_length = 0;
  ngOnInit(): void {
    this.get_notifications();
  }
  constructor(
    private iab: InAppBrowser,
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiservices: CommonApiService,
    public global_items: GlobalItemsProvider
  ) {}
  ionViewDidLoad() {
    console.log("ionViewDidLoad NotificationhistoryPage");
  }
  goback() {
    this.navCtrl.pop();
  }
  get_notifications() {
    this.apiservices.get("notifications").subscribe(
      res => {
        console.log(res["data"]);
        console.log(res["data"].length);
        this.notification_history_array = res["data"];
        this.notification_history_array_length = res["data"].length;
      },
      err => {
        console.log(err);
      }
    );
  }
  redirect_page(type, property, pk_i_id) {
    switch (type) {
      case "static":
        {
          this.global_items.showToast("This is static notification");
        }

        break;
      case "app":
        {
          switch (property) {
            case "events":
              {
                console.log("events -->", pk_i_id);
                this.navCtrl.push("EventsInnerPage", {
                  id: pk_i_id
                });
              }
              break;
            case "classified":
              {
                console.log("classifieds -->", pk_i_id);
                this.navCtrl.push("InnerClassifiedsPage", {
                  id: pk_i_id
                });
              }
              break;
            case "news":
              {
                this.navCtrl.push("ForumInnerPage", {
                  id: pk_i_id,
                  type: property,
                  category: ""
                });
              }
              break;
            case "advice":
              {
                this.navCtrl.push("ForumInnerPage", {
                  id: pk_i_id,
                  type: property,
                  category: ""
                });
              }
              break;
            case "muscut":
              {
                this.navCtrl.push("ForumInnerPage", {
                  id: pk_i_id,
                  type: property,
                  category: ""
                });
              }
              break;
            case "feeds":
              {
                this.navCtrl.push("ForumInnerPage", {
                  id: pk_i_id,
                  type: property,
                  category: ""
                });
              }
              break;
            case "relax":
              {
                this.navCtrl.push("ForumInnerPage", {
                  id: pk_i_id,
                  type: property,
                  category: ""
                });
              }
              break;
            case "todo":
              {
                this.navCtrl.push("ForumInnerPage", {
                  id: pk_i_id,
                  type: "tourism",
                  category: property
                });
              }
              break;
            case "hotels":
              {
                this.navCtrl.push("ForumInnerPage", {
                  id: pk_i_id,
                  type: "tourism",
                  category: property
                });
              }
              break;
            case "restaurants":
              {
                this.navCtrl.push("ForumInnerPage", {
                  id: pk_i_id,
                  type: "tourism",
                  category: property
                });
              }
              break;
            case "attractions":
              {
                this.navCtrl.push("ForumInnerPage", {
                  id: pk_i_id,
                  type: "tourism",
                  category: property
                });
              }
              break;
            case "services":
              {
                this.navCtrl.push("TabServicesInnerPage", {
                  id: pk_i_id
                });
              }
              break;
            case "jobs_available":
              {
                let param = {
                  title: property,
                  id: pk_i_id
                };
                this.navCtrl.push("TabJobJobinnerPage", { source: param });
              }
              break;
            case "jobs_wanted":
              {
                let param = {
                  title: property,
                  id: pk_i_id
                };
                this.navCtrl.push("TabJobJobinnerPage", { source: param });
              }
              break;
            default:
              {
                this.global_items.showToast("Something went wrong");
              }
              break;
          }
        }
        break;
      case "external":
        {
          if (property == "" || property == undefined || property == null) {
            property = "http://google.com";
          }
          const browser = this.iab.create(property, "_system");
          browser.on("loadstop").subscribe(event => {});
          // let browser = new InAppBrowser('url', '_system');
        }
        break;
      default:
        {
          this.global_items.showToast("Something went wrong");
        }
        break;
    }
  }
}
