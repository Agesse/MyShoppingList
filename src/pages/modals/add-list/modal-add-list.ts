import { Component, ViewChild } from "@angular/core";
import { ViewController } from 'ionic-angular';
import { List } from "../../../app/classes/list.class";
import { COLOR_BASICS, Colors } from "@ng-agesse/core";

@Component({
  selector: 'modal-add-list',
  templateUrl: 'modal-add-list.html'
})
export class AddList {

  // VARIABLES
  @ViewChild('colorSelect')
  private colorSelectComponent: any; // reference vers le composant agesseColorSelect

  list: List; // nouvelle liste
  colorList: Colors[]; // liste des couleurs selectionnables


  // CONSTRUCTEUR
  constructor(public viewCtrl: ViewController) {
    this.list = new List("");
    this.colorList = COLOR_BASICS;
  }


  // FONCTIONS
  dismiss(validateForm?: boolean) {
    if (validateForm) {
      this.list.color = this.colorSelectComponent.selectedColor;
      this.viewCtrl.dismiss({
        list: this.list
      });
    } else {
      this.viewCtrl.dismiss();
    }
  }
}
