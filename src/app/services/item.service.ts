import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import { MessageService } from "./messages.service";
import { List } from "../classes/list.class";
import { Item } from "../classes/item.class";
import { listTable, itemTable } from "../constants/tables.constants";


@Injectable()
export class ItemService {


  constructor(private storage: Storage, private messageService: MessageService) { }


  /**
   * @description Ajoute/modifie un item en BDD
   * @param {Item} item - item a ajouter/modifier
   * @param {boolean} [update] - vrai si l'item existe deja en BDD
   * @returns {Promise<Item>} 
   */
  setItem(item: Item, update?: boolean): Promise<Item> {
    if (!update) {
      return this.getRandomID(itemTable)
        .then(id => {
          item.id = id;
          return this.storage.set(itemTable + id, item)
            .then(item => { return item; })
            .catch(e => { this.messageService.notify(this.messageService.messages["ERROR.SET_ITEM"] + ": " + e); })
        });
    } else {
      return this.storage.set(itemTable + item.id, item)
        .then(item => { return item; })
        .catch(e => this.messageService.notify(this.messageService.messages["ERROR.UPDATE_ITEM"] + ": " + e))
    }
  }


  /**
   * @description Recupere tous les items d'une liste en BDD
   * @param {number[]} idList - identifiant de la liste contenant les items
   * @returns {Promise<Item[]>} 
   */
  getAllItems(idList: number[]): Promise<Item[]> {
    // Ensemble des promesses de recuperation des items
    var promiseList = [];
    idList.forEach(id => {
      promiseList.push(this.storage.get(itemTable + id));
    });

    return Promise.all(promiseList)
      .then(itemList => { return itemList; })
      .catch(e => {
        this.messageService.notify(this.messageService.messages["ERROR.GET_ITEMS_IN_LIST"] + ": " + e);
        return [];
      })
  }


  /**
   * @description Suppression d'un item en BDD
   * @param {List} list - liste a laquelle appartient l'item
   * @param {number} itemId - ID de l'item
   * @returns {Promise<boolean>} Vrai si la suppression est un succes, faux sinon
   */
  delItem(list: List, itemId: number): Promise<boolean> {
    return this.storage.remove(itemTable + itemId)
      .then(() => {
        list.itemOrder.splice(list.itemOrder.indexOf(itemId), 1);
        this.storage.set(listTable + list.id, list);
        return true;
      })
      .catch(e => {
        this.messageService.notify(this.messageService.messages["ERROR.DEL_ITEM"] + ": " + e);
        return false;
      });
  }


  /**
   * @desc Ajoute un item dans une liste.
   * @param {List} list - liste dans laquelle ajouter l'item
   * @param {number} itemId - id de l'item a ajouter
   */
  addItemToList(list: List, itemId: number) {
    list.itemOrder.push(itemId);
    this.storage.set(listTable + list.id, list);
  }


  /**
   * @desc Cree un id random pour une table.
   * @param {string} table - Nom de la table en BDD.
   * @returns {Promise<number>}
   */
  getRandomID(table: string): Promise<number> {
    return this.storage.keys()
      .then(keys => {
        var rand: number = 0;
        while (keys.indexOf(table + rand) > -1) {
          rand = Math.floor(Math.random() * 10000);
        }
        return rand;
      })
      .catch(() => {
        this.messageService.notify(this.messageService.messages["ERROR.GET_KEYS"]);
        return null;
      });
  }
}
