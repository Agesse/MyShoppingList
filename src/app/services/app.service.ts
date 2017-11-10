/**
 * Service permettant d'effectuer diverses operations liees a l'application.
 */
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

import { NotificationService } from "./notification.service";


@Injectable()
export class AppService {

  constructor(private storage: Storage, private notif: NotificationService) {
  }

  /**
   * Stock en memoire que l'application a deja ete lancee une fois. 
   */
  setInit(): void {
    this.storage.ready()
      .then(() => {
        this.storage.set("firstRun", true);
      })
  }

  /**
   * Check si l'application est lancee pour la premiere fois.
   */
  isFirstRun(): Promise<boolean> {
    return this.storage.ready()
      .then(() => {
        return this.storage.get("firstRun")
          .then(isFirstRun => {
            if (isFirstRun) {
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
}