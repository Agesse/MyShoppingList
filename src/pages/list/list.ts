import { Component } from '@angular/core';
import { ModalController, AlertController, MenuController, Events } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';

import { StorageService } from "../../app/services/storage.service";
import { AddItem } from "../modals/add-item/modal-add-item";
import { Item } from '../../app/classes/item.class';
import { List } from '../../app/classes/list.class';
import { UpdateItem } from '../modals/update-item/modal-update-item';
import { AppService } from "../../app/services/app.service";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  // VARIABLES
  listItems: Item[];
  subtitles: Item[];
  list: List;

  constructor(private storage: StorageService,
    private app: AppService,
    private modalCtrl: ModalController,
    private menu: MenuController,
    private vibration: Vibration,
    private event: Events) {
    menu.enable(true);
    this.list = new List("");
    event.subscribe("list:ready", () => {
      storage.getList(0)
        .then(list => {
          this.list = list;
          this.updateList();
        });
    });

    event.subscribe("list:refresh", () => {
      this.refreshList();
    });

    event.subscribe("list:new", (id) => {
      storage.getList(id)
        .then(list => {
          this.list = list;
          this.updateList();
        });
    });
  }


  hideRayon(idRayon: number) {
    var indexRayon = this.listItems.findIndex((item) => { return item.id === idRayon });
    var indexProchainRayon = this.listItems.findIndex((item, index) => {
      return index > indexRayon && item.isSubtitle;
    });
    for (var i = 0, l = this.listItems.length; i < l; i++) {
      if (i >= indexRayon && i < indexProchainRayon) {
        this.listItems[i].hide = !this.listItems[i].hide;
      }
    }
  }

  // Remet la liste a zero
  refreshList() {
    this.listItems.forEach((item) => {
      item.hide = false;
      if (item.checked) {
        item.checked = false;
        this.storage.setItem(item, true);
      }
    });
  }


  addItem() {
    const modal = this.modalCtrl.create(AddItem, { subtitles: this.subtitles });
    modal.onDidDismiss(retour => {
      if (retour && retour.item) {
        this.storage.setItem(retour.item)
          .then(item => {
            this.storage.addItemToList(this.list, item.id, retour.rayonId);
            this.updateList();
          });
      }
    });
    modal.present();
  }


  editItem(item: Item) {
    let idRayon = null;
    let indexItem = this.listItems.findIndex((itm) => { return itm.id === item.id; });
    for (var i = indexItem; i >= 0; i--) {
      if (this.listItems[i].isSubtitle) {
        idRayon = this.listItems[i].id;
        break;
      }
    }
    const modal = this.modalCtrl.create(UpdateItem, {
      subtitles: this.subtitles,
      item: item,
      idRayon: idRayon
    });
    modal.onDidDismiss(retour => {
      if (retour && retour.item) {
        this.storage.setItem(retour.item, true)
          .then(() => {
            if (!item.isSubtitle && retour.idRayon !== idRayon) {
              this.storage.updateItemRayon(this.list, item.id, retour.idRayon);
              this.updateList();
            }
          });
      }
    });
    modal.present();
  }


  delItem(id: number) {
    this.storage.delEntry(this.list, id)
      .then(() => this.updateList());
  }


  // Vibration + delai animation apres check d'un item
  checkItem(item: Item) {
    this.vibration.vibrate(500);
    window.setTimeout((item) => {
      item.hide = true;
    }, 500, item);
    this.storage.setItem(item, true);
  }


  // Met a jour la liste
  updateList() {
    this.storage.getAllItems(this.list.itemOrder)
      .then(listItems => {
        this.listItems = listItems;
        this.subtitles = this.listItems.filter(item => {
          return item.isSubtitle;
        });
      });;
  }
} 
