import { Component } from "@angular/core";
import { NavParams, ViewController } from 'ionic-angular';
import { Item } from "../../../app/classes/item.class";

@Component({
  selector: 'modal-add-item',
  templateUrl: 'modal-add-item.html'
})
export class AddItem {

  // VARIABLES
  item: Item; // nouvel item
  sectionId: number = null; // id de la categorie de l'item
  sections: Item[]; // liste des categories


  // CONSTRUCTEUR
  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.sections = params.get("sections");
    this.item = new Item("");
  }


  // FONCTIONS
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
