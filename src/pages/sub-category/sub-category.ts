import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
import { CommonApiService } from "./../../services/common-api.service";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

/**
 * Generated class for the SubCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "SubCategoryPage"
})
@Component({
  selector: "page-sub-category",
  templateUrl: "sub-category.html"
})
export class SubCategoryPage {
  subcategories: any[];
  id;
  constructor(
    public global_providers: GlobalItemsProvider,
    private service: CommonApiService,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad SubCategoryPage");
    let cat_id = this.navParams.get("cat_id");
    this.id = this.navParams.get("cat_id");
    console.log("parant:pk_i_id", cat_id);
    this.show_sub_categories(cat_id);
  }
  show_sub_categories(cat_id) {
    this.global_providers.showLoading("please wait...");
    console.log("parant:pk_i_id", cat_id);
    this.categoryClick(cat_id);
  }
  goback() {
    this.navCtrl.pop();
  }

  categoryClick(id) {
    console.log(id);
    this.service.get("subcategories", { category_id: id }).subscribe(res => {
      if (Object.keys(res.data).length > 0) {
        this.subcategories = res.data;
        console.log("subcategories", this.subcategories);
        this.global_providers.loading.dismiss();
      } else {
        console.log("error");
        this.navCtrl.push("NoItemFoundPage");
        this.global_providers.loading.dismiss();
      }
    });
  }
  show_inner_sub_categories(pk_id, head, fk_i_parent_id) {
    console.log("pkid", pk_id);
    console.log("parent id", fk_i_parent_id);
    if (fk_i_parent_id == 8 && pk_id == 94) {
      this.navCtrl.push("CategoriesJobWantedListingPage");
    } else if (fk_i_parent_id == 5) {
      this.navCtrl.push("CategoriesServiceListingPage", {
        head: "Services",
        id: pk_id
      });
    } else {
      this.navCtrl.push("SubCategoryInnerPage", {
        pkid: pk_id,
        head: head,
        parent_id: fk_i_parent_id
      });
    }
  }
  showall() {
    if (this.id == 5) {
      this.navCtrl.push("CategoriesServiceListingPage", {
        head: "All",
        id: 0
      });
    } else {
      this.navCtrl.push("SubCategoryInnerPage", {
        pkid: this.navParams.get("cat_id")
      });
    }
  }
}
