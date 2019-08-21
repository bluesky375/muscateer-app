import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ViewController } from "ionic-angular/navigation/view-controller";

/**
 * Generated class for the AvatarListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "AvatarListPage"
})
@Component({
  selector: "page-avatar-list",
  templateUrl: "avatar-list.html"
})
export class AvatarListPage {
  avatar_list: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad AvatarListPage");
    this.avatar_list = this.navParams.get("avatar");
  }
  dismiss(img_path, index) {
    // Returning data from the modal:
    this.viewCtrl.dismiss({ img_path: img_path, index: index });
  }
}
