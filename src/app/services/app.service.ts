import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import { NotificationService } from "./notification.service";
import { listTable } from "../constants/tables.constants";


// Service permettant d'effectuer diverses operations liees a l'application.
@Injectable()
export class AppService {

  // VARIABLES
  listsIds = []; // tableau des IDs des listes
  currentListId = 0;


  constructor(private storage: Storage, private notif: NotificationService) {
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
          .then(isFirstRun => {
            if (isFirstRun) {
              this.setInit();
              return false;
            } else {
              return true;
            }
          })
          .catch(e => {
            this.notif.notify(e, true);
            return false;
          });
      })
  }


  // Recupere l'ensemble des ids des listes
  getAllListsId() {
    this.storage.keys()
      .then((keys) => {
        keys.forEach(key => {
          if (key.includes(listTable)) {
            this.listsIds.push(key);
          }
        });
      })
  }
}