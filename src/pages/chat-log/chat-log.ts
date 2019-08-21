import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AngularFireDatabase } from "angularfire2/database";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { StaticSettings } from "../../services/settings.service";
import { ChatInnerPage } from "../chat-inner/chat-inner";
import { LoginPage } from "../login/login";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the ChatLogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "ChatLogPage" })
@Component({
  selector: "page-chat-log",
  templateUrl: "chat-log.html"
})
export class ChatLogPage implements OnInit {
  chatList: any[] = [];
  loading: boolean = true;
  emptyChat: boolean = false;
  userId: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _db: AngularFireDatabase,
    private storage: Storage,
    public settings: StaticSettings,
    public global_items: GlobalItemsProvider
  ) {}

  ngOnInit() {
    this.fetchUserId();
  }

  fetchUserId() {
    this.storage.get("id").then(val => {
      this.userId = val;
      console.log("user_id", this.userId);

      if (this.userId) {
        this.getNodes();
      } else {
        this.navCtrl.push(LoginPage);
      }
    });
  }

  getNodes() {
    console.log("getting nodes...");

    this._db.database
      .ref(`users/${this.userId}/chat_nodes`)
      .orderByChild("last_modified")
      .on("child_added", snap => {
        console.log(snap);
        console.log(snap.val());
        console.log("snap_key:", snap.key);
        const nodeData = snap.val();
        const user_id = nodeData.user_id || snap.key;
        this.watchForBadgeChanges(user_id);
        this._db.database.ref(`users/${user_id}/info`).once(
          "value",
          snap => {
            let value = snap.val();
            console.log("snap val()", value);
            if (value) {
              console.log("inside if");
              value.enabled = true;
              let new_value = value[Object.keys(value)[0]];
              nodeData["user"] = new_value;
              nodeData["uname"] = nodeData.user.name;
              nodeData.user.photoURL =
                this.settings.IMAGE_URL + nodeData.user.photoURL;
              console.log("new_value>>", nodeData);
            } else {
              console.log("snap value null");
              nodeData["uname"] = "Omasouq User";
              nodeData["user"] = {
                name: "Omasouq User",
                photoURL: this.settings.IMAGE_URL + "profile/user-dummy.png",
                enabled: false
              };
            }
            this.loading = false;
            this.chatList.unshift(nodeData);
            console.log("chatlist data");
            console.log(this.chatList);
          },
          err => {
            console.log("getting chat nodes err", err);
          }
        );
      });
    this._db.database
      .ref(`users/${this.userId}/chat_nodes`)
      .once("value", snap => {
        console.log("once value snap", snap);

        if (!snap.val()) {
          this.loading = false;
          this.emptyChat = true;
        }
      });
  }

  watchForBadgeChanges(recipientId) {
    console.log("watch for badge");

    this._db.database
      .ref(`users/${this.userId}/chat_nodes/${recipientId}`)
      .on("value", snap => {
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
        }
      });
  }

  redirectToChat(info) {
    console.log(info);
    this.navCtrl.push("ChatInnerPage", {
      user_id: this.userId,
      info: info.thread_key,
      name: info.uname
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ChatLogPage");
  }

  goback() {
    this.navCtrl.pop();
  }
}
