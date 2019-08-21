import { Component, Input, OnInit } from "@angular/core";
import { StaticSettings } from "../../services/settings.service";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";
import { DatabasesService } from "../../services/databases.service";
import { Events, AlertController } from "ionic-angular";
import { Storage } from "@ionic/storage";

/**
 * Generated class for the ReviewCommentsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "review-comments",
  templateUrl: "review-comments.html"
})
export class ReviewCommentsComponent implements OnInit {
  @Input() parent_id: any = null;
  @Input() type_id: any = null;
  public user = {
    s_name: "Muscateer",
    profile_picture: "",
    pk_i_id: 0
  };
  public all_reviews = {};
  public var_fetchUserId = 0;
  user_rate = 0;
  user_review = "";
  user_reply = "";
  url_if_access = "forum/reviews/user";
  url_not_access = "forum/reviews/all";
  all_reviews_length = 0;
  is_loged_in = false;
  constructor(
    public storage: Storage,
    public settings: StaticSettings,
    public global_items: GlobalItemsProvider,
    public apiservices: CommonApiService,
    public service: DatabasesService,
    public events: Events,
    public alertController: AlertController
  ) {
    this.fetchUserId();
    this.get_star_rating();
  }
  ngOnInit() {
    this.check_login();
    this.getUserDetails();
  }
  get_star_rating() {
    this.events.subscribe("star-rating:changed", starRating => {
      console.log(starRating);
      this.user_rate = starRating;
    });
  }

  post_review() {
    if (this.user_rate > 0) {
      let token = this.service.accessToken();
      if (token.hasOwnProperty("access")) {
        this.apiservices
          .postData(
            {
              type: this.type_id,
              parent_id: this.parent_id,
              score: this.user_rate,
              review: this.user_review
            },
            "forum/review-rating"
          )
          .subscribe(
            res => {
              console.log("response after post review", res);
              this.getReviews(this.url_if_access);
            },
            err => {
              console.log("response after post review err", err);
            }
          );
      } else {
        this.global_items.showToast("please login first");
      }
    } else {
      this.global_items.showToast("Rate first");
    }
  }
  post_like_dislike(event, pk_i_id, post_again) {
    // 0=dislike;
    // 1=like
    console.log(event, pk_i_id, post_again);
    let params = {
      rid: pk_i_id,
      response: event
    };
    if (post_again == event) {
    } else {
      this.apiservices.postData(params, "forum/review-response").subscribe(
        res => {
          this.getReviews(this.url_if_access);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
  check_login() {
    let token = this.service.accessToken();
    if (token.hasOwnProperty("access")) {
      this.getReviews(this.url_if_access);
      this.is_loged_in = true;
    } else {
      this.getReviews(this.url_not_access);
      this.is_loged_in = false;
    }
  }
  getUserDetails() {
    let token = this.service.accessToken();
    if (token.hasOwnProperty("access")) {
      this.apiservices.get("user/details").subscribe(res => {
        if (res.status) {
          this.user.s_name = res.data.user.s_name;
          this.user.profile_picture =
            this.settings.IMAGE_URL + res.data.user.profile_picture;
          this.user.pk_i_id = res.data.user.pk_i_id;
          console.log("user details", this.user);
        }
      });
    }
  }
  getReviews(url) {
    this.reset();
    this.apiservices
      .get(url, {
        parent_id: this.parent_id,
        type: this.type_id
      })
      .subscribe(
        res => {
          if (res.status) {
            this.all_reviews_length = res.data.reviews.data.length;
            Object.assign(this.all_reviews, res.data);
            // open_reply
            this.all_reviews["reviews"].data.forEach((element, index) => {
              Object.assign(this.all_reviews["reviews"].data[index], {
                open_reply: 0
              });
            });
          } else {
          }
          console.log("all reviews", this.all_reviews);
        },
        err => {}
      );
  }
  open_close_reply(position, value) {
    console.log("before change,", this.all_reviews);
    if (value == "0") {
      this.all_reviews["reviews"].data[position].open_reply = 1;
    } else {
      this.all_reviews["reviews"].data[position].open_reply = 0;
    }
    console.log("after change,", this.all_reviews);
  }
  //how to check loged in or not
  reset() {
    this.all_reviews = {};
    this.all_reviews_length = 0;
    this.user_rate = 0;
    this.user_review = "";
    this.user_reply = "";
  }

  post_comment(eid) {
    this.apiservices
      .postData(
        { parent_id: eid, comment: this.user_reply },
        "forum/review-comment"
      )
      .subscribe(
        res => {
          this.getReviews(this.url_if_access);
        },
        err => {}
      );
  }
  fetchUserId() {
    let userId = "";
    this.storage.get("id").then(val => {
      userId = val;
      console.log("userid:-" + userId);
      this.var_fetchUserId = parseInt(userId);
    });
  }
  delete_post(url, id) {
    console.log(url + id);
    const alert = this.alertController.create({
      title: this.global_items.do_translation("Confirm")!,
      message: this.global_items.do_translation("Do you want to delete?"),
      buttons: [
        {
          text: this.global_items.do_translation("Cancel"),
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            alert.dismiss();
          }
        },
        {
          text: this.global_items.do_translation("Okay"),
          handler: () => {
            console.log("Confirm Okay");
            this.global_items.showLoading("Please wait...");
            this.apiservices.postData({}, url + id).subscribe(
              res => {
                this.global_items.dismissLoading();
                if (res.status) {
                  this.check_login();
                } else {
                  this.global_items.showToast("Something went wrong");
                }
              },
              err => {
                this.global_items.showToast("Something went wrong");
              }
            );
          }
        }
      ]
    });

    alert.present();
  }
}
