import { Injectable, EventEmitter } from "@angular/core";
import { Storage } from "@ionic/storage";

import { NotificationService } from "./notification.service";
import { List } from "../classes/list.class";
import { Item } from "../classes/item.class";
import { AppService } from "./app.service";

const listPrefix = "myshoppinglist-list";
const itemPrefix = "myshoppinglist-item";

@Injectable()
export class StorageService {

  constructor(private storage: Storage, private notif: NotificationService, private utils: AppService) {
  }


  getList(id: number): Promise<List> {
    return this.storage.get(listPrefix + id)
      .then(list => {
        return list;
      })
      .catch(e => this.notif.notify("Erreur lors de la récupération de la liste: " + e, true));
  }


  getAllItems(idList: number[]): Promise<Item[]> {
    var promiseList = [];
    idList.forEach(id => {
      promiseList.push(this.storage.get(itemPrefix + id));
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
      return this.utils.getRandomID(itemPrefix)
        .then(id => {
          item.id = id;
          return this.storage.set(itemPrefix + id, item)
            .then((() => {
              this.notif.notify("Nouvel item créé");
              return item;
            }))
            .catch((() => {
              this.notif.notify("Erreur dans la création du nouvel item", true);
              return null;
            }))
        });
    } else {
      this.storage.set(itemPrefix + item.id, item)
        .catch((() => this.notif.notify("Erreur dans la modification de l'item", true)))
    }
  }


  delEntry(list: List, idItem: number): Promise<boolean> {
    return this.storage.remove(itemPrefix + idItem)
      .then((() => {
        this.notif.notify("Item supprimé");
        list.itemOrder.splice(list.itemOrder.indexOf(idItem), 1);
        this.storage.set(listPrefix + list.id, list);
        return true;
      }))
      .catch((() => {
        this.notif.notify("Erreur lors de la suppression de l'item");
        return false;
      }));
  }


  /**
   * Ajoute un item dans une liste.
   * @param {List} list - liste dans laquelle ajouter l'item
   * @param {number} idItem - id de l'item a ajouter
   * @param {number} idRayon - id du rayon dans lequel ajouter l'item
   */
  addItemToList(list: List, idItem: number, idRayon: number) {
    if (idRayon) {
      let indexRayon = list.itemOrder.findIndex((id) => { return id === idRayon });
      list.itemOrder.splice(indexRayon + 1, 0, idItem);
    } else {
      list.itemOrder.push(idItem);
    }
    this.storage.set(listPrefix + list.id, list);
  }


  // Change le rayon d'un item
  updateItemRayon(list: List, idItem: number, idRayon: number) {
    let indexItem = list.itemOrder.findIndex((id) => { return id === idItem; });
    list.itemOrder.splice(indexItem, 1);
    this.addItemToList(list, idItem, idRayon);
  }

}
