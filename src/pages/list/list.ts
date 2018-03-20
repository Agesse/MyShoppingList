import { Component } from '@angular/core';
import { ModalController, AlertController, Events } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';

import { StorageService } from "../../app/services/storage.service";
import { AppService } from "../../app/services/app.service";
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
    if (!this.reordering) {
      // Cherche de ou a ou cacher / montrer
      var sectionIndex = this.items.findIndex((item) => { return item.id === sectionId });
      var nextSectionIndex = this.items.findIndex((item, index) => {
        return index > sectionIndex && item.isSection;
      });
      // si c'est la derniere section, cache jusqu'a la fin
      if (nextSectionIndex === -1) {
        nextSectionIndex = this.items.length;
      }

      // Determine si on cache ou montre, important pour gerer apres deplacement
      let sectionLabel = this.items[sectionIndex].label;
      let isHiding = true;
      if (sectionLabel.includes(" ...")) {
        this.items[sectionIndex].label = sectionLabel.replace(" ...", " ");
        isHiding = false;
      } else {
        this.items[sectionIndex].label = sectionLabel + " ...";
      }

      for (var i = 0, l = this.items.length; i < l; i++) {
        if (i >= sectionIndex && i < nextSectionIndex) {
          this.items[i].hide = isHiding;
        }
      }
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
    if (!this.reordering) {
      this.translate.get(["MODAL_EDIT_ITEM_TITLE", "NAME_LABEL", "QTY_LABEL", "CANCEL", "SUBMIT"]).subscribe(messages => {
        let inputs = [{
          name: "label",
          placeholder: messages["NAME_LABEL"],
          value: item.label,
          type: "text"
        }];
        if (!item.isSection) {
          inputs.push({
            name: "qty",
            placeholder: messages["QTY_LABEL"],
            type: "number",
            value: item.qty.toString()
          });
        }
        let alert = this.alertCtrl.create({
          title: messages["MODAL_EDIT_ITEM_TITLE"],
          inputs: inputs,
          buttons: [
            {
              text: messages["CANCEL"],
              role: 'cancel',
              handler: data => {
              }
            },
            {
              text: messages["SUBMIT"],
              handler: data => {
                item.label = data.label;
                item.qty = data.qty;
                this.storage.setItem(item, true)
                  .then(() => {
                    this.updateList();
                  });
              }
            }
          ]
        });
        alert.present();
      });
    }
  }


  reorderItems(indexes) {
    let element = this.items[indexes.from];
    if (element.isSection && element.label.includes(" ...")) {
      let toMove = [element];
      for (let i = indexes.from + 1, l = this.items.length; i < l; i++) {
        if (this.items[i].hide) {
          toMove.push(this.items[i]);
        }
      }
      this.items.splice(indexes.from, toMove.length);
      for (let i = 0, l = toMove.length; i < l; i++) {
        this.items.splice(indexes.to + i, 0, toMove[i]);
      }
    } else {
      this.items.splice(indexes.from, 1);
      this.items.splice(indexes.to, 0, element);
    }
  }


  validReordering() {
    this.reordering = false;
    let newItemOrder = [];
    this.items.forEach(element => {
      newItemOrder.push(element.id);
    });
    this.list.itemOrder = newItemOrder;
    this.storage.setList(this.list, true);
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
      item.checked = true;
      this.storage.setItem(item, true);
    }, 500, item);
  }


  updateList() {
    this.list = this.app.currentList;
    this.storage.getAllItems(this.list.itemOrder)
      .then(items => {
        this.items = items;
      });;
  }
} 
