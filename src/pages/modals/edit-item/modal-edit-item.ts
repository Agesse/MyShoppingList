import { Component } from "@angular/core";
import { NavParams, ViewController } from 'ionic-angular';
import { Item } from "../../../app/classes/item.class";

@Component({
  selector: 'modal-edit-item',
  templateUrl: 'modal-edit-item.html'
})
export class EditItem {

  // VARIABLES
  item: Item; // item a modifier
  sectionId: number; // id de la categorie de l'item
  sections: Item[]; // liste des categories


  // FONCTIONS
  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.sections = params.get("sections");
    this.item = params.get("item");
    this.sectionId = params.get("sectionId");
  }

  dismiss(validateForm?: boolean) {
    if (validateForm) {
      this.viewCtrl.dismiss({
        item: this.item,
        sectionId: this.sectionId
      });
    } else {
      this.viewCtrl.dismiss();
    }
  }
}
