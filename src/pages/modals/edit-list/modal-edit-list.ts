import { Component, AfterViewInit, ViewChild } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";
import { List } from "../../../app/classes/list.class";
import { Colors } from "@agesse/core";
import { COLOR_BASICS } from "../../../app/constants/color.constants";

@Component({
  selector: "modal-edit-list",
  templateUrl: "modal-edit-list.html"
})
export class EditList implements AfterViewInit {

  // VARIABLES
  @ViewChild("colorSelect")
  private colorSelectComponent: any;

  list: List; // liste a editer
  colorList: Colors[]; // liste des couleurs selectionnables
  isNewList: boolean = false; // creation d'une nouvelle liste ?


  // CONSTRUCTEUR
  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.list = params.get("list");
    this.colorList = COLOR_BASICS;
  }


  // FONCTIONS
  ngAfterViewInit() {
    // Permet de preselectionner la couleur de la liste
    for (let i = 0, l = this.colorSelectComponent.colors.length; i < l; i++) {
      if (this.colorSelectComponent.colors[i].label === this.list.color.label) {
        this.colorSelectComponent.selectedColor = this.colorSelectComponent.colors[i];
        break;
      }
    }
  }

  dismiss(validateForm?: boolean) {
    if (validateForm) {
      this.list.color = this.colorSelectComponent.selectedColor;
      if (this.isNewList) {
        this.list.itemOrder = [];
      }
      this.viewCtrl.dismiss({
        list: this.list,
        new: this.isNewList
      });
    } else {
      this.viewCtrl.dismiss();
    }
  }
}
