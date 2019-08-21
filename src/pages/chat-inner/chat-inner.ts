import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase";
import {
  Content,
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ToastController,
  LoadingController
} from "ionic-angular";
import { Observable } from "rxjs/Rx";
import { ChatService, Message } from "../../services/chat.service";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';


/**
 * Generated class for the ChatInnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "ChatInnerPage" })
@Component({
  selector: "page-chat-inner",
  templateUrl: "chat-inner.html",
  providers: [Camera]
})
export class ChatInnerPage implements AfterViewInit {
  @ViewChild("chatHead")
  chatHead: ElementRef;
  @ViewChild(Content)
  content: Content;

  threadKey: any = {};
  recipientId: number = -1;
  messageList: any[] = [];
  totalMessages: number;
  message: string;
  messagesInView: number;
  height: number = 12;
  userId: number = 1;
  name: any = {};
  loading: boolean = true;
  isChatValid: boolean = true;
  viewHeight: any;
  lastKey: any;
  moreMessages: boolean = true;
  @ViewChild("myInput")
  myInput: ElementRef;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _db: AngularFireDatabase,
    private _fbAuth: AngularFireAuth,
    private _chat: ChatService,
    public platform: Platform,
    private storage: Storage,
    public global_items: GlobalItemsProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private transfer: FileTransfer,
    private camera: Camera
  ) {
    this.loading = true;
    this.userId = this.navParams.get("user_id");
    this.threadKey = this.navParams.get("info");
    this.name = this.navParams.get("name");
    this.messageList = [];
    console.log(this.threadKey);
    this.isThreadKeyValid().subscribe(res => {
      this._chat.selectedChatSubject.next(this.threadKey);
      this.clearAllMessageBadges();
      this.registerMessageChildAddedEvent();
      this.fetchAllChatDetails();
    });

    this.home_setup();
  }
  home_setup() { }
  resize() {
    // var element = this.myInput[
    //   "_elementRef"
    // ].nativeElement.getElementsByClassName("text-input")[0];
    // var scrollHeight = element.scrollHeight;
    // element.style.height = scrollHeight + "px";
    // this.myInput["_elementRef"].nativeElement.style.height =
    //   scrollHeight + 16 + "px";
  }
  ngAfterViewInit() {
    this.content.scrollToBottom();
    setTimeout(() => {
      this.content.scrollToBottom(0);
    }, 1000);
  }

  isThreadKeyValid() {
    console.log("CHECKING IF THREADKEY is valid");
    return Observable.create(observer => {
      this._db.database
        .ref(`users/${this.userId}/chat_nodes`)
        .orderByChild("thread_key")
        .equalTo(this.threadKey)
        .once(
          "value",
          snaps => {
            console.log("2.5");
            const snap = snaps.val();
            console.log("Inside valid check thread");
            if (snap) {
              this.recipientId = Number(Object.keys(snap)[0]);
              console.log(this.recipientId);
              this._db.database
                .ref(`users/${this.recipientId}/info`)
                .once("value", data => {
                  console.log("inside valid thead user");
                  if (data.val()) this._chat.isSelectedChatValidSub.next(true);

                  if (this.recipientId) {
                    console.log("inside recepitent check ", snap);
                    observer.next(snap);
                    observer.complete();
                  } else {
                    observer.error();
                  }
                });
            } else {
              observer.error();
            }
          },
          err => {
            observer.error();
          }
        );
    });
  }

  protected registerMessageChildAddedEvent() {
    this._db.database
      .ref(`users/${this.userId}/threads/${this.threadKey}/messages`)
      .orderByKey()
      .on("child_added", child => {
        console.log("i m here inside");
        console.log(this.loading);
        if (!this.loading) {
          let snapVal = child.val();
          snapVal["key"] = child.key;
          this.messageList.push(snapVal);
          this.loading = false;
          console.log("child added event invoked ");
        }
        this.messagesInView = this.messageList.length;
      });
  }

  protected fetchAllChatDetails() {
    console.log(this.threadKey);
    this._db.database
      .ref(`users/${this.userId}/threads/${this.threadKey}/messages`)
      .orderByChild("created_at")
      .limitToLast(20)
      .once("value", snap => {
        let snapVal = snap.val();
        for (let key in snapVal) {
          snapVal[key]["key"] = key;
          this.messageList.push(snapVal[key]);
          console.log(this.messageList);
        }
        this.loading = false;
        this.messagesInView = this.messageList.length;
        this.content.scrollToBottom(10);
      });
    //fetch chat meta
    this._db.database
      .ref(`users/1/threads/${this.threadKey}/meta/total`)
      .on("value", snap => {
        //Total messages in conversation
        this.totalMessages = snap.val();
      });
  }

  loadMore(refresher) {
    // return new Promise((resolve, reject) => {
    this.lastKey = this.messageList[0]["key"];
    this._db.database
      .ref(`users/${this.userId}/threads/${this.threadKey}/messages`)
      .orderByKey()
      .endAt(this.lastKey)
      .limitToLast(20)
      .once("value", snap => {
        let count = this.messageList.length;
        console.log("count : ", count);
        let snapVal = snap.val();
        let messageArray: any[] = [];
        console.log("length : ", messageArray.length);
        for (let messaege in snapVal) {
          //eliminates first one since its the lastkey
          if (messaege == this.lastKey) {
            console.log(count);
            break;
          }
          snapVal[messaege]["key"] = messaege;
          messageArray.push(snapVal[messaege]);
          //push messages to temporary array
        }

        // revserse the array and append to the begining of mesage list
        messageArray.reverse();
        for (let item in messageArray) {
          this.messageList.unshift(messageArray[item]);
        }

        //
        refresher.complete();
        this.messagesInView = this.messageList.length;
        //updates messags in view count
      })
      .catch(err => {
        console.error("ERROR");
      });
    // });
  }

  sendMessage() {
    if (!this.message) {
      return console.log("Cannot be empty");
    }
    if (!this.isChatValid) {
      return console.error("This user no loger exists");
    }
    let db = this._db.database;
    const messageBody = new Message();

    messageBody.data = this.message.replace(/(\r\n|\n|\r)/gm, "");
    messageBody.sender = this.userId;
    messageBody.type = 'text';
    messageBody.created_at = firebase.database.ServerValue.TIMESTAMP;
    this.message = "";
    let updates = {};
    let messageKey = db.ref(`users/${this.userId}/threads/messages`).push().key;
    updates[
      `users/${this.userId}/chat_nodes/${this.recipientId}/last_modified`
    ] = firebase.database.ServerValue.TIMESTAMP;
    updates[
      `users/${this.recipientId}/chat_nodes/${this.userId}/last_modified`
    ] = firebase.database.ServerValue.TIMESTAMP;
    updates[
      `users/${this.recipientId}/chat_nodes/${this.userId}/thread_key`
    ] = this.threadKey;
    updates[
      `users/${this.recipientId}/chat_nodes/${this.userId}/user_id`
    ] = this.userId;

    updates[
      `users/${this.userId}/threads/${this.threadKey}/messages/${messageKey}`
    ] = messageBody;
    updates[
      `users/${this.recipientId}/threads/${
      this.threadKey
      }/messages/${messageKey}`
    ] = messageBody;
    this._db.database
      .ref()
      .update(updates)
      .then(res => { });
    // .catch(err => { });
    this.updateMessageCount(this.threadKey);
    this.updateUnreadCount();
    this.content.scrollToBottom(0);
  }


  async fileUpload(file) {

    if (!this.isChatValid) {
      return console.error("This user no longer exists");
    }
    let db = this._db.database;
    const messageBody = new Message();
    this.closeDD();

    this.startLoading();


    let url;

    await this._chat.uploadFile(file).toPromise().then((res) => {
      url = res.data.path;
    })

    messageBody.data = url;
    messageBody.type = 'image';
    messageBody.sender = this.userId;
    messageBody.created_at = firebase.database.ServerValue.TIMESTAMP;
    this.message = "";
    let updates = {};
    let messageKey = db.ref(`users/${this.userId}/threads/messages`).push().key;
    updates[
      `users/${this.userId}/chat_nodes/${this.recipientId}/last_modified`
    ] = firebase.database.ServerValue.TIMESTAMP;
    updates[
      `users/${this.recipientId}/chat_nodes/${this.userId}/last_modified`
    ] = firebase.database.ServerValue.TIMESTAMP;
    updates[
      `users/${this.recipientId}/chat_nodes/${this.userId}/thread_key`
    ] = this.threadKey;
    updates[
      `users/${this.recipientId}/chat_nodes/${this.userId}/user_id`
    ] = this.userId;

    updates[
      `users/${this.userId}/threads/${this.threadKey}/messages/${messageKey}`
    ] = messageBody;
    updates[
      `users/${this.recipientId}/threads/${
      this.threadKey
      }/messages/${messageKey}`
    ] = messageBody;
    this._db.database
      .ref()
      .update(updates)
      .then(res => { });
    // .catch(err => { });
    this.updateMessageCount(this.threadKey);
    this.updateUnreadCount();
    this.stopLoading();
    this.content.scrollToBottom(0);
    setTimeout(() => {
      this.content.scrollToBottom(0);
    }, 300);
  }

  ddIsOpen = false;
  openDD() {
    this.ddIsOpen = true;
  }
  closeDD() {
    this.ddIsOpen = false;
  }

  base64Img;
  openCamera() {
    this.closeDD();
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then(
      (imgData) => {
        this.base64Img = 'data:image/jpeg;base64,' + imgData;
        this.fileUpload(this.base64Img);
      },
      (err) => {
        console.log(err);
        this.makeToast('Camera Error');
      }
    ).catch((err) => {
      console.log(err);
      this.makeToast('Camera Error');
    })
  }

  openGallery() {
    this.closeDD();
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then(
      (imgData) => {
        this.base64Img = 'data:image/jpeg;base64,' + imgData;
        this.fileUpload(this.base64Img);
      },
      (err) => {
        console.log(err);
        this.makeToast('Camera Error');
      }
    ).catch((err) => {
      console.log(err);
      this.makeToast('Camera Error');
    })
  }

  private loader;
  startLoading() {
    this.loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loader.present();
  }
  stopLoading() {
    this.loader.dismiss()
  }

  makeToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  /**Update the total messages count in sender and receivers message meta
   *
   * @param threadKey
   */
  protected updateMessageCount(threadKey) {
    let itemsToupdate = [this.recipientId, this.userId];
    for (let i = 0; i < 2; i++) {
      this._db.database
        .ref(`users/${itemsToupdate[i]}/threads/${threadKey}/meta/total`)
        .transaction(current => {
          console.log("about to update total message count", current);
          if (!current) {
            return 1;
          }
          return current + 1;
        });
    }
  }

  /**
   * Increment the receivers unread count
   */
  protected updateUnreadCount() {
    console.log("inside update unread count");
    this._db.database
      .ref(`users/${this.recipientId}/chat_nodes/${this.userId}/unread_count`)
      .transaction(current => {
        console.log("about to update unread couunt", current);
        if (!current) return 1;
        return current + 1;
      });
  }

  /**
   * Clears all message badges to 0
   */
  clearAllMessageBadges() {
    console.log("inside clear message ");
    this.messageClearTransaction();
    this._db.database
      .ref(`users/${this.userId}/chat_nodes/${this.recipientId}`)
      .on("value", snap => {
        let snapVal = snap.val();
        console.log("clear badge count subscrivbe");
        this.messageClearTransaction();
      });
  }

  messageClearTransaction() {
    const badgeRefe = this._db.database.ref(
      `users/${this.userId}/chat_nodes/${this.recipientId}/unread_count`
    );
    badgeRefe.transaction(current => {
      console.log("set unread count to 0");
      return 0;
    });
  }

  goback() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    // this.content.scrollTop(400);
  }

  ionViewDidEnter() { }
}
