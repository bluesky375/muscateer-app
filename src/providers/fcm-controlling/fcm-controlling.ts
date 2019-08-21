import { Injectable } from "@angular/core";
import { PhonegapLocalNotification } from "@ionic-native/phonegap-local-notification";
// import { Push } from "@ionic-native/push";
import { Storage } from "@ionic/storage";
import { AngularFireDatabase } from "angularfire2/database";
import { AlertController, Platform, ToastController } from "ionic-angular";
// import { LocalNotifications } from "@ionic-native/local-notifications";
import { StaticSettings } from "../../services/settings.service";
/*
  Generated class for the FcmControllingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmControllingProvider {
  chatList: any[] = [];
  loading: boolean = true;
  emptyChat: boolean = false;
  userId: number;
  constructor(
    // private push: Push,
    private alertCtrl: AlertController,
    private _db: AngularFireDatabase,
    private localNotification: PhonegapLocalNotification,
    private storage: Storage,
    private toastCtrl: ToastController,
    private platform: Platform,
    public settings: StaticSettings
  ) {}

  // ngOnInit() {
  //   this.fetchUserId();
  // }
  fetchUserId() {
    this.storage.get("id").then(val => {
      this.userId = val;
      if (this.userId) {
        this.getNodes();
      } else {
        // this.navCtrl.push(LoginPage);
        console.log("fcmctrl-->error while fetching userid");
      }
    });
  }

  getNodes() {
    this._db.database
      .ref(`users/${this.userId}/chat_nodes`)
      .orderByChild("last_modified")
      .on("child_added", snap => {
        const nodeData = snap.val();
        const user_id = nodeData.user_id || snap.key;
        this.watchForBadgeChanges(user_id);
        this._db.database.ref(`users/${user_id}/info`).once(
          "value",
          snap => {
            let value = snap.val();
            if (value) {
              value.enabled = true;
              // nodeData["user"] = value;
              // nodeData["uname"] = value.name;
              let new_value = value[Object.keys(value)[0]];
              nodeData["user"] = new_value;
              nodeData["uname"] = nodeData.user.name;
              nodeData.user.photoURL =
                this.settings.IMAGE_URL + nodeData.user.photoURL;
            } else {
              nodeData["uname"] = "Omasouq User";
              nodeData["user"] = {
                name: "Omasouq User",
                photoURL: this.settings.IMAGE_URL + "profile/user-dummy.png",
                enabled: false
              };
            }
            this.loading = false;
            this.chatList.unshift(nodeData);
            console.log(this.chatList);
          },
          fail => {
            console.log("fcm-controlling>>get nodes", fail);
          }
        );
      });
    this._db.database.ref(`users/${this.userId}/chat_nodes`).once(
      "value",
      snap => {
        if (!snap.val()) {
          this.loading = false;
          this.emptyChat = true;
        }
      },
      err => {
        console.log("db database err", err);
      }
    );
  }

  watchForBadgeChanges(recipientId) {
    let isNotify = false;
    this._db.database.ref(`users/${this.userId}/chat_nodes/${recipientId}`).on(
      "value",
      snap => {
        let snapshot = snap.val();
        console.log("snapshot value:-", snapshot);
        //fetch the changed node
        // find the node in chatlist
        for (let node in this.chatList) {
          if (this.chatList[node]["user_id"] == snap.key) {
            snapshot.user = this.chatList[node]["user"];
            this.chatList.splice(Number(node), 1);
            //remove the chat node
            this.chatList.unshift(snapshot);
            // append the chat node to existing chat list
          }
          console.log("not_count" + this.chatList[0].unread_count);

          if (this.chatList[0].unread_count >= 0) {
            isNotify = true;
          } else {
            isNotify = false;
          }
        }
        if (isNotify) {
          console.log("Notification showing");
          this.show_local_notification();
        } else {
          console.log("no notification arrived");
        }
      },
      err => {
        console.log("error on watch badge", err);
      }
    );
  }
  show_local_notification() {
    this.localNotification.requestPermission().then(permission => {
      if (permission === "granted") {
        // Create the notification
        this.localNotification.create("Muscateer", {
          tag: "message1",
          body: "Received a new Message",
          icon: "assets/images/Logo-Header.png"
        });

        //add click action start
        //end--------------------
      } else {
        //add notification permission
        // this.toastCtrl.create({
        //   message: this("new notification arrived, please grant permission"),
        //   duration: 3000
        // });
      }
    });
  }
}
