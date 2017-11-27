import { Injectable, EventEmitter } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Subject } from 'rxjs/Subject';

import { NotificationService } from "./notification.service";
import { List } from "../classes/list.class";
import { Item } from "../classes/item.class";
import { AppService } from "./app.service";

const listPrefix = "myshoppinglist-list";
const itemPrefix = "myshoppinglist-item";

@Injectable()
export class ListService {

  listsIds: string[];
  currentListId = 0;

  constructor(private storage: Storage, private notif: NotificationService, private utils: AppService) {
    this.storage.ready()
      .then(() => {
        this.getAllListsId();
      })
  }

  setFirstList(): Promise<void> {
    return this.storage.ready()
      .then(() => {
        var firstList = new List("Ma liste");
        firstList.id = 0;
        this.listsIds.push(listPrefix + 0);
        return this.storage.set(listPrefix + firstList.id, firstList)
          .catch(e => this.notif.notify("Erreur lors de la création de la première liste: " + e, true));
      })
  }


  setList(list: List): Promise<List> {
    return this.utils.getRandomID(listPrefix)
      .then((id) => {
        list.id = id;
        this.listsIds.push(listPrefix + id);
        return this.storage.set(listPrefix + id, list)
          .then((list) => { return list; })
          .catch((error) => this.notif.notify("Erreur lors de la creation de la liste: " + error, true));
      });
  }


  getAllListsId() {
    this.storage.keys()
      .then((keys) => {
        keys.forEach(key => {
          if (key.includes(listPrefix)) {
            this.listsIds.push(key);
          }
        });
      })
  }
}
