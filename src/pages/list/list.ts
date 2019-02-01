import { Component, ViewChild } from '@angular/core';
import { ModalController, AlertController, Events, Content } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

import { ItemService } from "../../app/services/item.service";
import { MessageService } from "../../app/services/messages.service";
import { ListService } from "../../app/services/list.service";
import { Item } from '../../app/classes/item.class';
import { List } from '../../app/classes/list.class';
import { EditList } from '../modals/edit-list/edit-list';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  animations: [
    trigger('flyInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate(300)
      ]),
      transition(':leave', [
        animate(300, style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class ListPage {

  // VARIABLES
  @ViewChild(Content) content: Content;
  items: Item[]; // tableau des items
  list: List;

  // variables pour la fonction ajout rapide
  newItemName = "";

  reordering = false; // indique l'etat de reordonnement des items


  // CONSTRUCTEUR
  constructor(private itemService: ItemService,
    private listService: ListService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private vibration: Vibration,
    private event: Events,
    private messageService: MessageService) {
    this.event.subscribe("list:change", () => {
      this.updateList();
    });
  }


  // Permet d'ajouter rapidement un item/tag avec juste son nom 
  quickAdd() {
    let newItem = new Item(this.newItemName);
    this.itemService.setItem(newItem)
      .then(item => {
        this.itemService.addItemToList(this.list, item.id);
        this.items.push(item);
        this.newItemName = "";
        window.setTimeout(() => {
          this.content.scrollToBottom()
        }, 200);
      });
  }


  editItem(item: Item) {
    if (!this.reordering) {
      let inputs = [{
        name: "label",
        placeholder: this.messageService.messages["NAME_LABEL"],
        value: item.label,
        type: "text"
      }];
      inputs.push({
        name: "qty",
        placeholder: this.messageService.messages["QTY_LABEL"],
        type: "number",
        value: item.qty.toString()
      });
      let alert = this.alertCtrl.create({
        title: this.messageService.messages["MODAL_EDIT_ITEM_TITLE"],
        inputs: inputs,
        buttons: [
          {
            text: this.messageService.messages["CANCEL"],
            role: 'cancel'
          },
          {
            text: this.messageService.messages["SUBMIT"],
            handler: data => {
              item.label = data.label;
              item.qty = data.qty;
              this.itemService.setItem(item, true);
            }
          }
        ]
      });
      alert.present();
    }
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
    this.listService.setList(this.list, true);
  }

  // Vibration + delai animation apres check d'un item
  checkItem(checkedItem: Item) {
    this.vibration.vibrate(500);
    window.setTimeout((checkedItem) => {

      this.itemService.delItem(this.list, checkedItem.id);
      let itemIndex = this.items.findIndex((item) => {
        return item.id === checkedItem.id;
      });
      this.items.splice(itemIndex, 1);
    }, 500, checkedItem);
  }


  // Alerte pour supprimer une liste
  delList() {
    let alert;
    if (this.listService.lists.length > 1) {
      alert = this.alertCtrl.create({
        title: this.messageService.messages["ALERT_DEL_LIST_TITLE"],
        message: "",
        buttons: [
          {
            text: this.messageService.messages["CANCEL"],
            handler: () => { }
          },
          {
            text: this.messageService.messages["SUBMIT"],
            handler: () => {
              this.listService.delList(this.listService.currentList)
                .then(success => {
                  if (success) {
                    this.listService.lists.splice(this.listService.lists.findIndex(elem => elem.id === this.listService.currentList.id), 1);
                    this.listService.currentList = this.listService.lists[0];
                    this.updateList();
                  }
                });
            }
          }
        ]
      });
    } else {
      alert = this.alertCtrl.create({
        title: this.messageService.messages["ALERT_WARNING"],
        message: this.messageService.messages["ERROR.DEL_LAST_LIST"],
        buttons: [
          {
            text: this.messageService.messages["SUBMIT"],
            handler: () => { }
          }
        ]
      });
    }
    alert.present();
  }


  // Modal d'edition de liste
  editList() {
    const modal = this.modalCtrl.create(EditList, {
      'list': this.listService.currentList
    });
    modal.onDidDismiss(response => {
      if (response && response.list) {
        this.list = response.list;
        this.listService.setList(response.list, true);
      }
    });
    modal.present();
  }


  updateList() {
    this.list = this.listService.currentList;
    this.itemService.getAllItems(this.list.itemOrder)
      .then(items => {
        this.items = items;
      });;
  }
} 
