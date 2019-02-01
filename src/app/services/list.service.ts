import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import { MessageService } from "./messages.service";
import { listTable, itemTable } from "../constants/tables.constants";
import { List } from "../classes/list.class";


// Service permettant d'effectuer diverses operations liees a l'application.
@Injectable()
export class ListService {

  // VARIABLES
  lists: List[] = [];
  currentList: List = null;


  constructor(private storage: Storage, private messageService: MessageService) { }


  // Recupere l'ensemble des listes
  getAll() {
    return this.storage.keys()
      .then((keys) => {
        let promises: Promise<List>[] = [];
        keys.forEach(key => {
          if (key.includes(listTable)) {
            promises.push(this.storage.get(key));
          }
        });
        return Promise.all(promises)
          .then(lists => {
            // tri par ordre alphabetique, avec la liste primaire en 1er
            this.lists = lists;
            return lists;
          })
          .catch(e => {
            this.messageService.notify(this.messageService.messages["ERROR.GET_ALL_LISTS"] + ": " + e);
            return [];
          });
      })
      .catch(e => {
        this.messageService.notify(this.messageService.messages["ERROR.GET_KEYS"] + ": " + e);
        return [];
      });
  }

  /**
   * @description Recupere une liste en BDD par son ID
   * @param {number} id 
   * @returns {Promise<List>} 
   */
  getList(id: number): Promise<List> {
    return this.storage.get(listTable + id)
      .then(list => { return list; })
      .catch(e => this.messageService.notify(this.messageService.messages["ERROR.GET_LIST"] + ": " + e));
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
          this.lists.push(list);
          return this.storage.set(listTable + id, list)
            .then(list => { return list; })
            .catch(e => this.messageService.notify(this.messageService.messages["ERROR.SET_LIST"] + ": " + e));
        });
    } else {
      return this.storage.set(listTable + list.id, list)
        .then(list => { return list; })
        .catch(e => this.messageService.notify(this.messageService.messages["ERROR.UPDATE_LIST"] + ": " + e))
    }
  }


  /**
   * @description Suppression d'une liste en BDD
   * @param {List} list - liste a supprimer
   * @returns {Promise<boolean>} Vrai si la suppression est un succes, faux sinon
   */
  delList(list: List): Promise<boolean> {
    return this.storage.remove(listTable + list.id)
      .then(() => {
        let promises = [];
        list.itemOrder.forEach((id) => {
          promises.push(this.storage.remove(itemTable + id));
        });
        return Promise.all(promises)
          .then(() => {
            this.messageService.notify(this.messageService.messages["SUCCESS.DEL_LIST"]);
            return true;
          });
      })
      .catch(e => {
        this.messageService.notify(this.messageService.messages["ERROR.DEL_LIST"] + ": " + e);
        return false;
      });
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
