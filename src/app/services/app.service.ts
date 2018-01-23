import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import { listTable } from "../constants/tables.constants";


// Service permettant d'effectuer diverses operations liees a l'application.
@Injectable()
export class AppService {

  // VARIABLES
  listsIds = []; // tableau des IDs des listes
  currentListId = 0;


  constructor(private storage: Storage) {
    this.storage.ready()
      .then(() => {
        this.getAllListsId();
      })
  }


  // Stock en memoire que l'application a deja ete lancee une fois. 
  setInit(): void {
    this.storage.ready()
      .then(() => {
        this.storage.set("firstRun", true);
      })
  }


  // Check si l'application est lancee pour la premiere fois.
  isFirstRun(): Promise<boolean> {
    return this.storage.ready()
      .then(() => {
        return this.storage.get("firstRun")
          .then(variableInDatabase => {
            if (!variableInDatabase) {
              this.setInit();
              return true;
            } else {
              return false;
            }
          });
      });
  }


  // Recupere l'ensemble des ids des listes existantes
  getAllListsId() {
    this.storage.keys()
      .then((keys) => {
        keys.forEach(key => {
          if (key.includes(listTable)) {
            this.storage.get(key)
              .then(list => this.listsIds.push(list.id))
          }
        });
      })
  }


  // Passe a la liste suivante ou boucle si derniere
  nextList() {
    let currentIndex = this.listsIds.findIndex(id => id === this.currentListId);
    if (currentIndex === this.listsIds.length - 1) {
      this.currentListId = this.listsIds[0];
    } else {
      this.currentListId = this.listsIds[currentIndex + 1];
    }
  }

  // Passe a la liste precedente ou boucle si premiere
  previousList() {
    let currentIndex = this.listsIds.findIndex(id => id === this.currentListId);
    if (currentIndex === 0) {
      this.currentListId = this.listsIds[this.listsIds.length - 1];
    } else {
      this.currentListId = this.listsIds[currentIndex - 1];
    }
  }
}
