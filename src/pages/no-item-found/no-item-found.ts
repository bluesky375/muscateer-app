import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the NoItemFoundPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "NoItemFoundPage"
})
@Component({
  selector: "page-no-item-found",
  templateUrl: "no-item-found.html"
})
export class NoItemFoundPage implements OnInit {
  constructor(
    public navCtrl: NavController,
    public global_items: GlobalItemsProvider,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad NoItemFoundPage");
  }
  ngOnInit() {}
}
