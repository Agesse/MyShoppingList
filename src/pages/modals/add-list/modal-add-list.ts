import { Component } from "@angular/core";
import { NavParams, ViewController } from 'ionic-angular';
import { List } from "../../../app/classes/list.class";

@Component({
  selector: 'modal-add-list',
  templateUrl: 'modal-add-list.html'
})
export class AddList {

  list: List;
  color: string;

  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.list = new List("");
    this.color = "blue";
  }

  dismiss(validateForm?: boolean) {
    if (validateForm) {
      this.viewCtrl.dismiss({
        list: this.list,
        color: this.color
      });
    } else {
      this.viewCtrl.dismiss();
    }
  }

}
