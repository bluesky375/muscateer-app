import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";
import { UploadService } from "../../services/file-upload.service";
import { StaticSettings } from "../../services/settings.service";
import { Toast } from "@ionic-native/toast";

@Component({
  selector: "multiple-image",
  templateUrl: "multiple-image.html"
})
export class MultipleImageUpload implements OnInit, OnChanges {
  public imagesArray: any[] = [];
  public uploadStatus: any[] = ["uploaded", "uploading", "not_started"];
  constructor(
    private upload: UploadService,
    private settings: StaticSettings,
    private toast: Toast
  ) {}
  @Input() count: number = 4;
  @Input() edit: boolean = false;
  @Input() imagesInput: any[] = [];
  @Input() type;
  @Output() onupload: EventEmitter<any[]> = new EventEmitter();
  @Output() onremove: EventEmitter<any> = new EventEmitter();
  ngOnInit() {
    this.initializeInput();
  }
  initializeInput() {
    if (this.edit && this.imagesInput) {
      this.imagesInput.forEach((value, key) => {
        const imageData = {
          id: value.id,
          uploadStatus: this.uploadStatus[0],
          isError: false,
          path: value.path,
          display: this.settings.IMAGE_URL + value.path
        };
        this.imagesArray.push(imageData);
      });
    } else {
      this.addMore();
    }
  }

  ngOnChanges() {
    // this.initializeInput();
  }
  addMore() {
    if (this.imagesArray.length < this.count) {
      const data = {
        uploadStatus: this.uploadStatus[2],
        isError: false
      };
      this.imagesArray.push(data);
    }
  }
  setImage(index, status, error, data?) {
    this.imagesArray[index]["uploadStatus"] = status;
    this.imagesArray[index]["isError"] = error;
    if (data && data.s_path) {
      this.imagesArray[index]["path"] = data.s_path;
      this.imagesArray[index]["display"] =
        this.settings.IMAGE_URL + data.s_path;
    }
  }
  getImage(index, event) {
    let files = event.srcElement.files;
    this.setImage(index, this.uploadStatus[1], false);
    if (files) {
      this.upload
        .makeFileRequest(
          this.settings.BASE_URL + "/api/v1/ajax-image",
          [],
          files
        )
        .subscribe(
          res => {
            if (res.status) {
              this.setImage(index, this.uploadStatus[0], false, res.data);
              this.emitNewImages();
            } else {
              this.setImage(index, this.uploadStatus[0], true);
              this.toast
                .show(` error in uploading`, "2000", "bottom")
                .subscribe(toast => {
                  console.log(toast);
                });
            }
          },
          error => {
            this.setImage(index, this.uploadStatus[0], true);
            let err;
            console.log(error);
            try {
              if (error.error.error_message.image[0])
                err = error.error.error_message.image[0];
            } catch (e) {
              err = "Error while uploading image";
            }
            this.toast
              .show(` error in uploading`, "2000", "bottom")
              .subscribe(toast => {
                console.log(toast);
              });
          }
        );
    }
  }

  private emitNewImages() {
    let imageListToEmit: any[] = [];
    this.imagesArray.forEach((value, key) => {
      const imageInfo = {};
      if (value.hasOwnProperty("path")) {
        imageInfo["path"] = value.path;
        if (value.hasOwnProperty("id")) {
          imageInfo["id"] = value.id;
        }
        imageListToEmit.push(imageInfo);
      }
    });
    this.onupload.emit(imageListToEmit);
  }

  isImagePresent(index) {
    if (this.imagesArray[index]["uploadStatus"] == this.uploadStatus[0]) {
      return this.imagesArray[index]["display"];
    }
    return false;
  }

  isError(index) {
    return this.imagesArray[index]["isError"];
  }

  isUploading(index) {
    if (this.imagesArray[index]["uploadStatus"] == this.uploadStatus[1]) {
      return true;
    }
    return false;
  }
  clearImage(index) {
    const data = {
      uploadStatus: this.uploadStatus[2],
      isError: false
    };
    if (
      this.imagesArray[index] &&
      this.imagesArray[index].hasOwnProperty("id")
    ) {
      this.onremove.emit(this.imagesArray[index]);
    }
    if (this.imagesArray[index]["path"] || this.imagesArray[index]["id"]) {
      this.imagesArray[index] = data;
    } else {
      if (this.imagesArray.length > 1) {
        this.imagesArray.splice(index, 1);
      }
    }

    this.emitNewImages();
  }
}
