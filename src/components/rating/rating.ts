import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CommonApiService } from "../../services/common-api.service";

/**
 * Generated class for the RatingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "rating",
  templateUrl: "rating.html"
})
export class RatingComponent implements OnInit {
  @Input() type: number;
  @Input() id: number;
  @Input() value: number;
  @Input() total: number;
  @Input() disabled: boolean = false;
  @Input() editable: boolean = true;
  @Input() fontSize: number = 30;
  @Output() user_is_rated = new EventEmitter<string>();
  _rating: any[] = [];
  hoverValue: number = -1;

  constructor(private service: CommonApiService) {}

  ngOnInit() {
    if (this.value) this.hoverValue = this.value - 1;

    for (let i = 0; i < 5; i++) {
      this._rating.push({ id: i });
    }
  }

  ratingClick(hoverV) {
    if (this.type && this.id && hoverV > -1) {
      // console.log("hoverv : ", hoverV);
      // console.log("hello");
      let data = {};
      let old = this.value;
      this.hoverValue = this.value = hoverV;
      data["parent_id"] = this.id;
      data["type"] = this.type;
      data["score"] = this.hoverValue + 1;
      this.service.postData(data, "forum/rating").subscribe(
        res => {
          this.user_is_rated.emit("Submitted");
        },
        err => {
          this.user_is_rated.emit("Failed");
        }
      );
    }
  }
}
