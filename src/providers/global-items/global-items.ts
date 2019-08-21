import { Injectable } from "@angular/core";
import {
  AlertController,
  LoadingController,
  ToastController
} from "ionic-angular";
import swal from "sweetalert";
import { LanguageProvider } from "../language/language";
import { Storage } from "@ionic/storage";

/*
  Generated class for the GlobalItemsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalItemsProvider {
  loading;
  nav_auth = "";
  public tab_forum_head = "news";
  public tab_events_head = "upcoming";
  public tab_job_head = "jobs available";
  public tab_recommendation_head = "hotel";
  public App_global_search_placeholder = "Search in Classifieds";
  public App_global_tab_head = "Search in Classifieds";
  public App_global_search_input = "";
  public App_global_location = "";
  public App_global_location_lat = null;
  public App_global_location_long = null;
  public App_version = 9;
  public App_Package_name = "com.muscateers";
  public App_direction = "ltr";
  public App_menu_direction = "left";
  public comment_Disclaimer_ltr =
    "The comments posted here/below/in the given space are not on behalf of Muscateer. The person posting the comment will be in sole ownership of its responsibility. According to the central government's IT rules, obscene or offensive statement made against a person, religion, community or nation is a punishable offense, and legal action would be taken against people who indulge in such activities.";
  public comment_Disclaimer_rtl =
    "التعليقات المنشورة هنا / تحت / في الفضاء المعطى ليست نيابة عن مسكتير. سيكون الشخص الذي ينشر التعليق في ملكية واحدة فقط لمسؤوليته. وفقا لقواعد تكنولوجيا المعلومات للحكومة المركزية ، فإن البيان البشع أو الهجومى ضد شخص أو دين أو مجتمع أو أمة يعد جريمة يعاقب عليها القانون ، وسيتم اتخاذ إجراء قانوني ضد الأشخاص الذين ينغمسون في مثل هذه الأنشطة.";
  constructor(
    public storage: Storage,
    public toast_ctrl: ToastController,
    public loadctrl: LoadingController,
    public alertctrl: AlertController,
    public language_provider: LanguageProvider
  ) {
    console.log("Hello GlobalItemsProvider Provider");
  }

  showToast(msg: any, pos?: any) {
    if (pos == null || pos == undefined) {
      pos = "bottom";
    }
    msg = this.do_translation(msg);
    this.toast_ctrl
      .create({
        message: msg,
        duration: 3000,
        position: pos
      })
      .present();
  }
  showAlert(title: any, msg: any, success_or_error?: any) {
    return new Promise(resolve => {
      title = this.do_translation(title);
      msg = this.do_translation(msg);
      swal({
        title: title,
        text: msg,
        closeOnEsc: false,
        icon: success_or_error,
        timer: 2000
      }).then(() => {
        resolve(true);
      });
    });
  }

  showLoading(msg: any) {
    let message = this.do_translation(msg);
    this.loading = this.loadctrl.create({
      content: message
    });
    this.loading.present();
  }
  dismissLoading() {
    if (this.loading.present()) {
      this.loading.dismiss();
    }
  }
  // get_app_direction() {
  //   if (this.App_direction == "rtl") {
  //     return "right";
  //   } else if (this.App_direction == "ltr") {
  //     return "left";
  //   } else {
  //     return "left";
  //   }
  // }

  do_translation(value) {
    if (this.App_direction == "rtl") {
      if (
        this.language_provider.arabic_language[value] == null ||
        this.language_provider.arabic_language[value] == undefined ||
        this.language_provider.arabic_language[value] == ""
      ) {
        return value;
      } else {
        return this.language_provider.arabic_language[value];
      }
    } else {
      return value;
    }
  }

  change_search_placeholder(tab_head?) {
    switch (tab_head) {
      case "classifieds":
        {
          this.App_global_search_placeholder = "Search in Classifieds";
          this.App_global_tab_head = "Classifieds";
        }
        break;
      case "Forums":
        {
          this.App_global_search_placeholder = "Search in Forums";
          this.App_global_tab_head = "Forums";
        }
        break;
      case "Events":
        {
          this.App_global_search_placeholder = "Search in Events";
          this.App_global_tab_head = "Events";
        }
        break;
      case "Recommendations":
        {
          this.App_global_search_placeholder = "Search in Recommendations";
          this.App_global_tab_head = "Recommendations";
        }
        break;
      case "Services":
        {
          this.App_global_search_placeholder = "Search in Services";
          this.App_global_tab_head = "Services";
        }
        break;
      case "Jobs":
        {
          this.App_global_search_placeholder = "Search in Jobs";
          this.App_global_tab_head = "Jobs";
        }
        break;

      default:
        {
          this.App_global_search_placeholder = "Search in Classifieds";
          this.App_global_tab_head = "Classifieds";
        }
        break;
    }
  }

  save_temp_user_location() {
    this.storage
      .get("temp_user_location")
      .then(res => {
        if (res == null || res == undefined || res == "") {
          this.App_global_location = "Update Location";
        } else {
          this.App_global_location = res;
        }
      })
      .catch(err => {
        this.App_global_location = "Update Location";
      });
    this.storage
      .get("temp_user_latitude")
      .then(res => {
        if (res == null || res == undefined || res == "" || res == 0) {
          this.App_global_location_lat = 0;
        } else {
          this.App_global_location_lat = res;
        }
      })
      .catch(err => {
        this.App_global_location_lat = 0;
      });
    this.storage
      .get("temp_user_longitude")
      .then(res => {
        if (res == null || res == undefined || res == "" || res == 0) {
          this.App_global_location_long = 0;
        } else {
          this.App_global_location_long = res;
        }
      })
      .catch(err => {
        this.App_global_location_long = 0;
      });
  }
}
