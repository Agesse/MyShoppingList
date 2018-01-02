import { Component } from '@angular/core';
import { ModalController, AlertController, MenuController, Events } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';

import { StorageService } from "../../app/services/storage.service";
import { AddItem } from "../modals/add-item/modal-add-item";
import { Item } from '../../app/classes/item.class';
import { List } from '../../app/classes/list.class';
import { EditItem } from '../modals/edit-item/modal-edit-item';
import { AppService } from "../../app/services/app.service";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  // VARIABLES
  listItems: Item[];
  sections: Item[];
  list: List;

  constructor(private storage: StorageService,
    private app: AppService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private menu: MenuController,
    private vibration: Vibration,
    private event: Events) {

    menu.enable(true);
    this.list = new List("");
    event.subscribe("list:change", () => {
      this.changeList();
    });
  }


  hideRayon(sectionId: number) {
    var indexRayon = this.listItems.findIndex((item) => { return item.id === sectionId });
    var indexProchainRayon = this.listItems.findIndex((item, index) => {
      return index > indexRayon && item.isSection;
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
    const modal = this.modalCtrl.create(AddItem, { sections: this.sections });
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
    let sectionId = null;
    let indexItem = this.listItems.findIndex((itm) => { return itm.id === item.id; });
    for (var i = indexItem; i >= 0; i--) {
      if (this.listItems[i].isSection) {
        sectionId = this.listItems[i].id;
        break;
      }
    }
    const modal = this.modalCtrl.create(EditItem, {
      sections: this.sections,
      item: item,
      sectionId: sectionId
    });
    modal.onDidDismiss(retour => {
      if (retour && retour.item) {
        this.storage.setItem(retour.item, true)
          .then(() => {
            if (!item.isSection && retour.sectionId !== sectionId) {
              this.storage.updateItemRayon(this.list, item.id, retour.sectionId);
              this.updateList();
            }
          });
      }
    });
    modal.present();
  }


  delItem(id: number) {
    let confirm = this.alertCtrl.create({
      title: 'Supprimer item',
      message: 'Etes-vous surs de vouloir supprimer l\'item ?',
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: 'Valider',
          handler: () => {
            this.storage.delEntry(this.list, id)
              .then(() => this.updateList());
          }
        }
      ]
    });
    confirm.present();
  }


  previousList() {
    this.app.previousList();
    this.changeList();
  }

  nextList() {
    this.app.nextList();
    this.changeList();
  }


  // Vibration + delai animation apres check d'un item
  checkItem(item: Item) {
    this.vibration.vibrate(500);
    window.setTimeout((item) => {
      item.hide = true;
      this.storage.setItem(item, true);
    }, 500, item);
  }

  // Met a jour la liste en cours
  changeList() {
    this.storage.getList(this.app.currentListId)
      .then(list => {
        this.list = list;
        this.updateList();
      });
  }

  // Met a jour les items de la liste
  updateList() {
    this.storage.getAllItems(this.list.itemOrder)
      .then(listItems => {
        this.listItems = listItems;
        this.sections = this.listItems.filter(item => {
          return item.isSection;
        });
      });;
  }
} 
