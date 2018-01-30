import { Component } from "@angular/core";
import { NavParams, ViewController } from 'ionic-angular';
import { Item } from "../../../app/classes/item.class";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'edit-item',
  templateUrl: 'edit-item.html'
})
export class EditItem {

  // VARIABLES
  item: Item; // item a modifier


  // FONCTIONS
  constructor(params: NavParams, public viewCtrl: ViewController, private translate: TranslateService) {
    this.item = params.get("item");
  }

  dismiss(validateForm?: boolean) {
    if (validateForm) {
      this.viewCtrl.dismiss({
        item: this.item
      });
    } else {
      this.viewCtrl.dismiss();
    }
  }
}
