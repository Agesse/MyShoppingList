import { Injectable, EventEmitter } from "@angular/core";
import { Storage } from "@ionic/storage";

import { NotificationService } from "./notification.service";
import { List } from "../classes/list.class";
import { Item } from "../classes/item.class";

const listPrefix = "myshoppinglist-list";
const itemPrefix = "myshoppinglist-item";

@Injectable()
export class ListService {

  constructor(private storage: Storage, private notif: NotificationService) {
  }

  /**
   * Cree en BDD la toute premiere liste.
   */
  setFirstList(): void {
    this.storage.ready()
      .then(() => {
        var firstList = new List("Ma liste");
        firstList.id = 0;
        this.storage.set(listPrefix + firstList.id, firstList)
          .catch(e => this.notif.notify("Erreur lors de la création de la première liste: " + e, true));
      })
  }

  /**
   * Recupere une liste.
   * @param {number} id - id de la liste
   * @return {Promise<List>}
   */
  getList(id: number): Promise<List> {
    return this.storage.get(listPrefix + id)
      .then(list => {
        return list;
      })
      .catch(e => this.notif.notify("Erreur lors de la récupération de la liste: " + e, true));
  }


  /**
   * Recupere tous les items associes a une liste.
   * @param {number[]} idList - liste des id des items
   * @return {Promise<Item[]>}
   */
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


  /**
   * @desc Cree ou met a jour un Item en BDD.
   * @param {Item} item - item a recuperer
   * @param {boolean} update? - vrai si update de l'item
   */
  setItem(item: Item, update?: boolean): Promise<Item> {
    if (!update) {
      return this.getRandomID(itemPrefix)
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
        .then((() => this.notif.notify("Item modifié")))
        .catch((() => this.notif.notify("Erreur dans la modification de l'item", true)))
    }
  }


  /**
   * Ajoute un item dans une liste.
   * @param {List} list - liste dans laquelle ajouter l'item
   * @param {number} idItem - id de l'item a ajouter
   * @param {number} idRayon - id du rayon dans lequel ajouter l'item
   */
  addItemToList(list: List, idItem: number, idRayon: number) {
    if (idRayon) {
      let indexRayon = list.itemOrder.findIndex((id) => { return id === idItem });
      list.itemOrder.splice(indexRayon, 0, idItem);
    } else {
      list.itemOrder.push(idItem);
    }
    this.storage.set(listPrefix + list.id, list);
  }

  /**
   * @desc UPDATE : supprime l'ancienne et ajoute la nouvelle
   * @param {Entry} newEntry - Nouvelle valeur
   * @returns {Promise<void>} Resolue quand la valeur a bien ete modifiee
   */
  /*updateEntry(newEntry: Entry): Promise<void> {
    return this.storage.remove("entry-" + newEntry.id)
      .then(() => {
        return this.setEntry(newEntry, true)
      })
      .catch(() => this.notify("Probleme lors de la suppression de l'entree", true))
  }*/

  /**
   * @desc DEL : id => boolean
   * @param {number} id
   * @returns {Promise<void>}
   */
  /*delEntry(id: number): Promise<void> {
    return this.storage.remove("entry-" + id)
      .then(() => this.notify("Entree supprimee"))
      .catch(() => this.notify("Probleme lors de la suppression de l'entree", true))
  }*/

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
