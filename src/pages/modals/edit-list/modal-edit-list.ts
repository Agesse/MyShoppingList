import { Component, AfterViewInit, ViewChild } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";
import { List } from "../../../app/classes/list.class";
import { COLOR_BASICS, Colors } from "@ng-agesse/core";

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


  // CONSTRUCTEUR
  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.list = params.get("list");
    this.colorList = COLOR_BASICS;
  }


  // FONCTIONS
  //todo: faire fonctionner la selection
  ngAfterViewInit() {
    this.colorSelectComponent.selectedColor = this.list.color;
  }

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
