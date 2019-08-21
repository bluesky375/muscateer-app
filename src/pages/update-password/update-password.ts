import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { CommonApiService } from "../../services/common-api.service";
import { AppError } from "../../Errors/app-error";
import { BadRequestError } from "../../Errors/bad-request-error";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the UpdatePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "UpdatePasswordPage" })
@Component({
  selector: "page-update-password",
  templateUrl: "update-password.html"
})
export class UpdatePasswordPage {
  passForm: FormGroup;
  userInfo: any = {};
  errors: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    public apiService: CommonApiService,
    public global_items: GlobalItemsProvider
  ) {
    this.passForm = fb.group({
      current: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      new: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      confirm: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }

  isTouchInvalid(name: string) {
    return this.passForm.get(name).touched && this.passForm.get(name).invalid;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad UpdatePasswordPage");
  }

  onSave() {
    this.userInfo["previous_password"] = this.passForm.get("current").value;
    this.userInfo["password"] = this.passForm.get("new").value;
    this.userInfo["password_confirmation"] = this.passForm.get("confirm").value;
    this.updatePassword();
  }

  updatePassword() {
    this.global_items.showLoading("Please wait...");
    this.apiService.postData(this.userInfo, "user/update-password").subscribe(
      res => {
        if (res.status) {
          console.log(res.status);
          this.global_items.dismissLoading();
          this.global_items.showAlert("Done", "Success", "success");
          this.navCtrl.pop();
        } else {
        }
      },
      (error: AppError) => {
        if (error instanceof BadRequestError) {
          if (error.originalError.error) {
            let errors = error.originalError.error.error_message;
            for (let error in errors) {
              this.doValidationMessage(errors[error]);
              console.log(errors);
            }
            this.global_items.showAlert(
              "Oops",
              "Something went wrong",
              "error"
            );
            this.global_items.dismissLoading();
          }
        } else throw error;
      }
    );
  }
  doValidationMessage(message) {
    let val = { message: message[0], error: true };
    this.errors.push(val);
  }
  goback() {
    this.navCtrl.pop();
  }
}
