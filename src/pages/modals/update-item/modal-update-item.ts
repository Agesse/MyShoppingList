import { Component } from "@angular/core";
import { NavParams, ViewController } from 'ionic-angular';
import { Item } from "../../../app/classes/item.class";

@Component({
  selector: 'modal-update-item',
  templateUrl: 'modal-update-item.html'
})
export class UpdateItem {

  item: Item;
  idRayon: number;
  subtitles: Item[];

  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.subtitles = params.get("subtitles");
    this.item = params.get("item");
    this.idRayon = params.get("idRayon");
  }

  dismiss(validateForm?: boolean) {
    if (validateForm) {
      this.viewCtrl.dismiss({
        item: this.item,
        idRayon: this.idRayon
      });
    } else {
      this.viewCtrl.dismiss();
    }
  }

}
