import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import { NotificationService } from "./notification.service";
import { List } from "../classes/list.class";
import { Item } from "../classes/item.class";
import { AppService } from "./app.service";
import { listTable, itemTable } from "../constants/tables.constants";


@Injectable()
export class StorageService {

  // VARIABLES
  messagesKeys = ["FIRST_LIST_NAME",
    "SUCCESS.DEL_LIST",
    "ERROR.SET_LIST",
    "ERROR.SET_ITEM",
    "ERROR.UPDATE_LIST",
    "ERROR.UPDATE_ITEM",
    "ERROR.GET_LIST",
    "ERROR.GET_ITEMS_IN_LIST",
    "ERROR.DEL_LISTE",
    "ERROR.DEL_ITEM",
    "ERROR.DEL_FIRST_LIST",
    "ERROR.GET_KEYS"];
  messages: string[] = [];


  // CONSTRUCTEUR
  constructor(
    private storage: Storage,
    private notif: NotificationService,
    private app: AppService) {
  }


  /**
   * @description Cree la premiere liste en BDD
   * @returns {Promise<void>} 
   */
  setFirstList(): Promise<void> {
    return this.storage.ready()
      .then(() => {
        var firstList = new List(this.messages["FIRST_LIST_NAME"]);
        firstList.id = 0;
        this.app.lists.push(firstList);
        return this.storage.set(listTable + firstList.id, firstList)
          .catch(e => this.notif.notify(this.messages["ERROR.SET_LIST"] + ": " + e));
      })
  }


  /**
   * @description Ajoute/modifie une liste en BDD
   * @param {List} list - liste a ajouter
   * @param {boolean} [update] - vrai si la liste existe deja en BDD
   * @returns {Promise<List>} 
   */
  setList(list: List, update?: boolean): Promise<List> {
    if (!update) {
      return this.getRandomID(listTable)
        .then((id) => {
          list.id = id;
          this.app.lists.push(list);
          this.app.sortList();
          return this.storage.set(listTable + id, list)
            .then(list => { return list; })
            .catch(e => this.notif.notify(this.messages["ERROR.SET_LIST"] + ": " + e));
        });
    } else {
      return this.storage.set(listTable + list.id, list)
        .then(list => { return list; })
        .catch(e => this.notif.notify(this.messages["ERROR.UPDATE_LIST"] + ": " + e))
    }
  }


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
            .catch(e => { this.notif.notify(this.messages["ERROR.SET_ITEM"] + ": " + e); })
        });
    } else {
      return this.storage.set(itemTable + item.id, item)
        .then(item => { return item; })
        .catch(e => this.notif.notify(this.messages["ERROR.UPDATE_ITEM"] + ": " + e))
    }
  }


  /**
   * @description Recupere une liste en BDD par son ID
   * @param {number} id 
   * @returns {Promise<List>} 
   */
  getList(id: number): Promise<List> {
    return this.storage.get(listTable + id)
      .then(list => { return list; })
      .catch(e => this.notif.notify(this.messages["ERROR.GET_LIST"] + ": " + e));
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
        this.notif.notify(this.messages["ERROR.GET_ITEMS_IN_LIST"] + ": " + e);
        return [];
      })
  }


  /**
   * @description Suppression d'un item en BDD
   * @param {List} list - liste a laquelle appartient l'item
   * @param {number} itemId - ID de l'item
   * @returns {Promise<boolean>} Vrai si la suppression est un succes, faux sinon
   */
  delEntry(list: List, itemId: number): Promise<boolean> {
    return this.storage.remove(itemTable + itemId)
      .then(() => {
        list.itemOrder.splice(list.itemOrder.indexOf(itemId), 1);
        this.storage.set(listTable + list.id, list);
        return true;
      })
      .catch(e => {
        this.notif.notify(this.messages["ERROR.DEL_ITEM"] + ": " + e);
        return false;
      });
  }


  /**
   * @description Suppression d'une liste en BDD
   * @param {List} list - liste a supprimer
   * @returns {Promise<boolean>} Vrai si la suppression est un succes, faux sinon
   */
  delList(list: List): Promise<boolean> {
    if (list.id) {
      return this.storage.remove(listTable + list.id)
        .then(() => {
          let promises = [];
          list.itemOrder.forEach((id) => {
            promises.push(this.storage.remove(itemTable + id));
          });
          return Promise.all(promises)
            .then(() => {
              this.notif.notify(this.messages["SUCCESS.DEL_LISTE"]);
              return true;
            })
        })
        .catch(e => {
          this.notif.notify(this.messages["ERROR.DEL_LIST"] + ": " + e);
          return false;
        });
    } else {
      this.notif.notify(this.messages["ERROR.DEL_FIRST_LIST"]);
      let p = new Promise<boolean>((resolve, reject) => resolve(false));
      return p;
    }
  }


  /**
   * @desc Ajoute un item dans une liste.
   * @param {List} list - liste dans laquelle ajouter l'item
   * @param {number} itemId - id de l'item a ajouter
   */
  addItemToList(list: List, itemId: number) {
    list.itemOrder.splice(0, 0, itemId);
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
        this.notif.notify(this.messages["ERROR.GET_KEYS"]);
        return null;
      });
  }
}
