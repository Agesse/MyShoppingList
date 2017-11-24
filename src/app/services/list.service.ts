import { Injectable, EventEmitter } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Subject } from 'rxjs/Subject';

import { NotificationService } from "./notification.service";
import { List } from "../classes/list.class";
import { Item } from "../classes/item.class";

const listPrefix = "myshoppinglist-list";
const itemPrefix = "myshoppinglist-item";

@Injectable()
export class ListService {

  currentListId = 0;

  constructor(private storage: Storage, private notif: NotificationService) {
  }

  setFirstList(): void {
    this.storage.ready()
      .then(() => {
        var firstList = new List("Ma liste");
        firstList.id = 0;
        this.storage.set(listPrefix + firstList.id, firstList)
          .catch(e => this.notif.notify("Erreur lors de la création de la première liste: " + e, true));
      })
  }
}
