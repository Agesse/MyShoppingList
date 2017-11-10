import { Component } from '@angular/core';
import { ModalController, AlertController } from 'ionic-angular';

import { ListService } from "../../app/services/list.service";
import { AddItem } from "../modals/add-item/modal-add-item";
import { Item } from '../../app/classes/item.class';
import { List } from '../../app/classes/list.class';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  // VARIABLES
  listItems: Item[];
  list: List;

  constructor(private listService: ListService, private modalCtrl: ModalController) {
    this.list = new List("");
    listService.getList(0)
      .then(list => {
        this.list = list;
        listService.getAllItems(list.itemOrder)
          .then(listItems => this.listItems = listItems);
      });
  }


  /**
   * @desc Ouvre la modale permettant d'ajouter un item.
   */
  addItem() {
    let subtitles = this.listItems.filter(item => {
      return item.isSubtitle;
    });
    const modal = this.modalCtrl.create(AddItem, { subtitles: subtitles });
    modal.onDidDismiss(retour => {
      if (retour && retour.item) {
        this.listService.setItem(retour.item)
          .then(item => {
            this.listService.addItemToList(this.list, item.id, retour.rayonId);
            this.updateList();
          });
      }
    });
    modal.present();
  }

  updateList() {
    this.listService.getAllItems(this.list.itemOrder)
      .then(listItems => this.listItems = listItems);;
  }

} 
