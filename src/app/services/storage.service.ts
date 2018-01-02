import { Injectable, EventEmitter } from "@angular/core";
import { Storage } from "@ionic/storage";

import { NotificationService } from "./notification.service";
import { List } from "../classes/list.class";
import { Item } from "../classes/item.class";
import { AppService } from "./app.service";
import { listTable, itemTable } from "../constants/tables.constants";


@Injectable()
export class StorageService {

  constructor(private storage: Storage, private notif: NotificationService, private app: AppService) {
  }


  setFirstList(): Promise<void> {
    return this.storage.ready()
      .then(() => {
        var firstList = new List("Ma liste");
        firstList.id = 0;
        this.app.listsIds.push(0);
        return this.storage.set(listTable + firstList.id, firstList)
          .catch(e => this.notif.notify("Erreur lors de la création de la première liste: " + e, true));
      })
  }


  setList(list: List, update?: boolean): Promise<List> {
    if (!update) {
      return this.getRandomID(listTable)
        .then((id) => {
          list.id = id;
          this.app.listsIds.push(id);
          return this.storage.set(listTable + id, list)
            .then((list) => { return list; })
            .catch((error) => this.notif.notify("Erreur lors de la creation de la liste: " + error, true));
        });
    } else {
      return this.storage.set(listTable + list.id, list)
        .catch((() => this.notif.notify("Erreur dans la modification de la liste", true)))
    }
  }


  getList(id: number): Promise<List> {
    return this.storage.get(listTable + id)
      .then(list => {
        return list;
      })
      .catch(e => this.notif.notify("Erreur lors de la récupération de la liste: " + e, true));
  }


  getAllItems(idList: number[]): Promise<Item[]> {
    var promiseList = [];
    idList.forEach(id => {
      promiseList.push(this.storage.get(itemTable + id));
    });

    return Promise.all(promiseList)
      .then(itemList => { return itemList; })
      .catch(e => {
        this.notif.notify("Erreur lors de la récupération des items de la liste: " + e, true);
        return [];
      })
  }


  setItem(item: Item, update?: boolean): Promise<Item> {
    if (!update) {
      return this.getRandomID(itemTable)
        .then(id => {
          item.id = id;
          return this.storage.set(itemTable + id, item)
            .then((() => {
              return item;
            }))
            .catch((() => {
              this.notif.notify("Erreur dans la création du nouvel item", true);
              return null;
            }))
        });
    } else {
      return this.storage.set(itemTable + item.id, item)
        .catch((() => this.notif.notify("Erreur dans la modification de l'item", true)))
    }
  }


  delEntry(list: List, idItem: number): Promise<boolean> {
    return this.storage.remove(itemTable + idItem)
      .then((() => {
        list.itemOrder.splice(list.itemOrder.indexOf(idItem), 1);
        this.storage.set(listTable + list.id, list);
        return true;
      }))
      .catch((() => {
        this.notif.notify("Erreur lors de la suppression de l'item");
        return false;
      }));
  }


  delList(list: List): Promise<boolean> {
    if (list.id) {
      return this.storage.remove(listTable + list.id)
        .then((() => {
          let promises = [];
          list.itemOrder.forEach((id) => {
            promises.push(this.storage.remove(itemTable + id));
          });
          return Promise.all(promises)
            .then(() => {
              this.notif.notify("Liste supprimée");
              return true;
            })
        }))
        .catch((() => {
          this.notif.notify("Erreur lors de la suppression de l'item");
          return false;
        }));
    } else {
      this.notif.notify("Impossible de supprimer la liste de base", true);
      let p = new Promise<boolean>((resolve, reject) => resolve(false));
      return p;
    }
  }


  /**
   * Ajoute un item dans une liste.
   * @param {List} list - liste dans laquelle ajouter l'item
   * @param {number} idItem - id de l'item a ajouter
   * @param {number} idRayon - id du rayon dans lequel ajouter l'item
   */
  addItemToList(list: List, idItem: number, idRayon: number) {
    // warn: 0 peut etre un id rayon valide
    if (idRayon !== null) {
      let indexRayon = list.itemOrder.findIndex((id) => { return id === idRayon });
      list.itemOrder.splice(indexRayon + 1, 0, idItem);
    } else {
      list.itemOrder.push(idItem);
    }
    this.storage.set(listTable + list.id, list);
  }


  // Change le rayon d'un item
  updateItemRayon(list: List, idItem: number, idRayon: number) {
    let indexItem = list.itemOrder.findIndex((id) => { return id === idItem; });
    list.itemOrder.splice(indexItem, 1);
    this.addItemToList(list, idItem, idRayon);
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
        this.notif.notify("Probleme de recuperation des cles en BDD", true);
        return null;
      });
  }

}
