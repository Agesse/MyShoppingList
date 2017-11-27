import { Component } from "@angular/core";
import { NavParams, ViewController } from 'ionic-angular';
import { Item } from "../../../app/classes/item.class";

@Component({
  selector: 'modal-add-item',
  templateUrl: 'modal-add-item.html'
})
export class AddItem {

  newItem: Item;
  rayonId: number = null;
  subtitles: Item[];

  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.subtitles = params.get("subtitles");
    this.newItem = new Item("");
  }

  dismiss(validateForm?: boolean) {
    if (validateForm) {
      this.viewCtrl.dismiss({
        item: this.newItem,
        rayonId: this.rayonId
      });
    } else {
      this.viewCtrl.dismiss();
    }
  }

}
