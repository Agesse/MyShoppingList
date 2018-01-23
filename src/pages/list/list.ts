import { Component } from '@angular/core';
import { ModalController, AlertController, Events } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';

import { StorageService } from "../../app/services/storage.service";
import { AppService } from "../../app/services/app.service";
import { AddItem } from "../modals/add-item/modal-add-item";
import { EditItem } from '../modals/edit-item/modal-edit-item';
import { Item } from '../../app/classes/item.class';
import { List } from '../../app/classes/list.class';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { EditList } from '../modals/edit-list/modal-edit-list';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  // VARIABLES
  items: Item[]; // tableau des items
  sections: Item[]; // tableau des sections
  list: List;


  // CONSTRUCTEUR
  constructor(private storage: StorageService,
    private app: AppService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private vibration: Vibration,
    private event: Events,
    private translate: TranslateService) {

    this.list = new List("");
    event.subscribe("list:change", () => {
      this.changeList();
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


  addItem() {
    const modal = this.modalCtrl.create(AddItem, { sections: this.sections });
    modal.onDidDismiss(response => {
      if (response && response.item) {
        this.storage.setItem(response.item)
          .then(item => {
            this.storage.addItemToList(this.list, item.id, response.sectionId);
            this.updateList();
          });
      }
    });
    modal.present();
  }


  editItem(item: Item) {
    let sectionId = null;
    let itemIndex = this.items.findIndex((itm) => { return itm.id === item.id; });
    // Recherche la 1ere section au dessus de l'item
    for (var i = itemIndex; i >= 0; i--) {
      if (this.items[i].isSection) {
        sectionId = this.items[i].id;
        break;
      }
    }
    const modal = this.modalCtrl.create(EditItem, {
      sections: this.sections,
      item: item,
      sectionId: sectionId
    });
    modal.onDidDismiss(response => {
      if (response && response.item) {
        this.storage.setItem(response.item, true)
          .then(() => {
            if (!item.isSection && response.sectionId !== sectionId) {
              this.storage.updateItemRayon(this.list, item.id, response.sectionId);
              this.updateList();
            }
          });
      }
    });
    modal.present();
  }


  delItem(id: number) {
    this.translate.get(["ALERT_DEL_ITEM_TITLE", "ALERT_DEL_ITEM_MESSAGE", "CANCEL", "SUBMIT"]).subscribe(translation => {
      let confirm = this.alertCtrl.create({
        title: translation["ALERT_DEL_ITEM_TITLE"],
        message: translation["ALERT_DEL_ITEM_MESSAGE"],
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
          message: translations["ALERT_DEL_LIST_MESSAGE"],
          buttons: [
            {
              text: translations["CANCEL"],
              handler: () => {
              }
            },
            {
              text: translations["SUBMIT"],
              handler: () => {
                this.storage.getList(this.app.currentListId)
                  .then(list => {
                    this.storage.delList(list)
                      .then(notMainList => {
                        if (notMainList) {
                          this.app.previousList();
                          this.app.listsIds.splice(this.app.listsIds.findIndex(id => id === list.id), 1);
                          this.changeList();
                        }
                      });
                  });
              }
            }
          ]
        });
        confirm.present();
      });
  }


  // Modal d'edition/ d'ajout de liste
  editList() {
    this.storage.getList(this.app.currentListId)
      .then((list) => {
        const modal = this.modalCtrl.create(EditList, {
          'list': list
        });
        modal.onDidDismiss(response => {
          if (response && response.list) {
            if (response.new) {
              this.storage.setList(response.list)
                .then(list => {
                  this.app.currentListId = list.id;
                  this.event.publish("list:change");
                });
            } else {
              this.storage.setList(response.list, true)
                .then(list => {
                  this.changeList();
                });
            }
          }
        });
        modal.present();
      })
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


  changeList() {
    this.storage.getList(this.app.currentListId)
      .then(list => {
        this.list = list;
        this.updateList();
      });
  }


  updateList() {
    this.storage.getAllItems(this.list.itemOrder)
      .then(items => {
        this.items = items;
        this.sections = this.items.filter(item => {
          return item.isSection;
        });
      });;
  }
} 
