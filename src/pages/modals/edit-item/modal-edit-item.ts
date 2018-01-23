import { Component } from "@angular/core";
import { NavParams, ViewController } from 'ionic-angular';
import { Item } from "../../../app/classes/item.class";
import { TranslateService } from "@ngx-translate/core";

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
  constructor(params: NavParams, public viewCtrl: ViewController, private translate: TranslateService) {
    this.item = params.get("item");
    this.sectionId = params.get("sectionId") || -1;
    this.sections = params.get("sections");

    // si on n'a pas de section nulle, on l'ajoute
    if (this.sections[0].id != -1) {
      translate.get("SECTION_PLACEHOLDER")
        .subscribe(sectionLabel => {
          let nullSection = new Item(sectionLabel);
          nullSection.id = -1;
          this.sections.splice(0, 0, nullSection);
        });
    }
  }

  dismiss(validateForm?: boolean) {
    if (validateForm) {
      this.sectionId = this.sectionId === -1 ? null : this.sectionId;
      this.viewCtrl.dismiss({
        item: this.item,
        sectionId: this.sectionId
      });
    } else {
      this.viewCtrl.dismiss();
    }
  }
}
