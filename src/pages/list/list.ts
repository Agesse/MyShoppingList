import { Component } from '@angular/core';
import { ModalController, AlertController, Events } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';

import { StorageService } from "../../app/services/storage.service";
import { AppService } from "../../app/services/app.service";
import { EditItem } from '../modals/edit-item/edit-item';
import { Item } from '../../app/classes/item.class';
import { List } from '../../app/classes/list.class';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { EditList } from '../modals/edit-list/edit-list';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  // VARIABLES
  items: Item[]; // tableau des items
  sections: Item[]; // tableau des sections
  list: List;

  // variables pour la fonction ajout rapide
  newItemIsTag = false;
  newItemName = "";

  reordering = false; // indique l'etat de reordonnement des items


  // CONSTRUCTEUR
  constructor(private storage: StorageService,
    private app: AppService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private vibration: Vibration,
    private event: Events,
    private translate: TranslateService) {
    event.subscribe("list:change", () => {
      this.updateList();
    });
  }


  // Cache les items d'une section
  hideSection(sectionId: number) {
    var sectionIndex = this.items.findIndex((item) => { return item.id === sectionId });
    var nextSectionIndex = this.items.findIndex((item, index) => {
      return index > sectionIndex && item.isSection;
    });
    // si c'est la derniere section, cache jusqu'a la fin
    if (nextSectionIndex === -1) {
      nextSectionIndex = this.items.length;
    }
    for (var i = 0, l = this.items.length; i < l; i++) {
      if (i >= sectionIndex && i < nextSectionIndex) {
        this.items[i].hide = !this.items[i].hide;
      }
    }
    let sectionLabel = this.items[sectionIndex].label;
    if (sectionLabel.includes(" ...")) {
      this.items[sectionIndex].label = sectionLabel.replace(" ...", " ");
    } else {
      this.items[sectionIndex].label = sectionLabel + " ...";
    }
  }


  // Decoche tous les items de la liste
  resetList() {
    this.items.forEach((item) => {
      item.hide = false;
      if (item.checked) {
        item.checked = false;
        this.storage.setItem(item, true);
      }
    });
  }


  // Permet d'ajouter rapidement un item/tag avec juste son nom 
  quickAdd() {
    let newItem = new Item(this.newItemName);
    newItem.isSection = this.newItemIsTag;
    this.storage.setItem(newItem)
      .then(item => {
        this.storage.addItemToList(this.list, item.id);
        this.updateList();
        this.newItemName = "";
        this.newItemIsTag = false;
      });
  }


  editItem(item: Item) {
    const modal = this.modalCtrl.create(EditItem, {
      item: item
    });
    modal.onDidDismiss(response => {
      if (response && response.item) {
        this.storage.setItem(response.item, true)
          .then(() => {
            this.updateList();
          });
      }
    });
    modal.present();
  }


  reorderItems(indexes) {
    let element = this.items[indexes.from];
    this.items.splice(indexes.from, 1);
    this.items.splice(indexes.to, 0, element);
  }


  validReordering() {
    this.reordering = false;
    let newItemOrder = [];
    this.items.forEach(element => {
      newItemOrder.push(element.id);
    });
    this.list.itemOrder = newItemOrder;
    this.storage.setList(this.list, true)
      .then(() => {
        this.updateList();
      });
  }


  delItem(id: number) {
    this.translate.get(["ALERT_DEL_ITEM_TITLE", "ALERT_DEL_ITEM_MESSAGE", "CANCEL", "SUBMIT"]).subscribe(translation => {
      let confirm = this.alertCtrl.create({
        title: translation["ALERT_DEL_ITEM_TITLE"],
        message: "",
        buttons: [
          {
            text: translation["CANCEL"],
            handler: () => {
            }
          },
          {
            text: translation["SUBMIT"],
            handler: () => {
              this.storage.delEntry(this.list, id)
                .then(() => this.updateList());
            }
          }
        ]
      });
      confirm.present();
    })
  }


  // Alerte pour supprimer une liste
  delList() {
    this.translate.get(["ALERT_DEL_LIST_TITLE", "ALERT_DEL_LIST_MESSAGE", "CANCEL", "SUBMIT"])
      .subscribe(translations => {
        let confirm = this.alertCtrl.create({
          title: translations["ALERT_DEL_LIST_TITLE"],
          message: "",
          buttons: [
            {
              text: translations["CANCEL"],
              handler: () => {
              }
            },
            {
              text: translations["SUBMIT"],
              handler: () => {
                this.storage.delList(this.app.currentList)
                  .then(notMainList => {
                    if (notMainList) {
                      this.app.lists.splice(this.app.lists.findIndex(elem => elem.id === this.app.currentList.id), 1);
                      this.app.currentList = this.app.lists[0];
                      this.updateList();
                    }
                  });
              }
            }
          ]
        });
        confirm.present();
      });
  }


  // Modal d'edition de liste
  editList() {
    const modal = this.modalCtrl.create(EditList, {
      'list': this.app.currentList
    });
    modal.onDidDismiss(response => {
      if (response && response.list) {
        this.storage.setList(response.list, true)
          .then(list => {
            this.updateList();
          });
      }
    });
    modal.present();
  }


  // Vibration + delai animation apres check d'un item
  checkItem(item: Item) {
    this.vibration.vibrate(1000);
    window.setTimeout((item) => {
      item.hide = true;
      this.storage.setItem(item, true);
    }, 400, item);
  }


  updateList() {
    this.list = this.app.currentList;
    this.storage.getAllItems(this.list.itemOrder)
      .then(items => {
        this.items = items;
        this.sections = this.items.filter(item => {
          return item.isSection;
        });
      });;
  }
} 
