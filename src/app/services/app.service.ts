import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import { listTable } from "../constants/tables.constants";
import { List } from "../classes/list.class";
import { StorageService } from "./storage.service";


// Service permettant d'effectuer diverses operations liees a l'application.
@Injectable()
export class AppService {

  // VARIABLES
  lists: List[] = []; // tableau des listes
  currentList: List = null;


  constructor(private storage: Storage) {
    this.getAllLists();
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


  // Recupere l'ensemble des listes
  getAllLists() {
    this.storage.keys()
      .then((keys) => {
        let promises: Promise<List>[] = [];
        keys.forEach(key => {
          if (key.includes(listTable)) {
            promises.push(this.storage.get(key));
          }
        });
        Promise.all(promises)
          .then(lists => {
            // tri par ordre alphabetique, avec la liste primaire en 1er
            this.lists = lists;
            this.sortList();
          });
      })
  }


  sortList() {
    this.lists.sort((a, b) => {
      if (a.id === 0) {
        return -1;
      }
      if (b.id === 0) {
        return 1;
      }
      return a.label > b.label ? 1 : -1;
    });
  }
}
