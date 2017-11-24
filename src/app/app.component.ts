import { Component } from '@angular/core';
import { Platform, Events, MenuController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ListService } from "./services/list.service";
import { AppService } from "./services/app.service";
import { ListPage } from '../pages/list/list';
import { AddList } from '../pages/modals/add-list/modal-add-list';
import { StorageService } from './services/storage.service';

@Component({
  templateUrl: 'app.html'
})
export class MyShoppingList {

  rootPage: any = ListPage;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    appService: AppService,
    private listService: ListService,
    private event: Events,
    private menu: MenuController,
    private modalCtrl: ModalController,
    private storage: StorageService) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      // initialisation de la 1ere liste si premier lancement de l'application
      appService.isFirstRun()
        .then(isFirstRun => {
          if (isFirstRun) {
            listService.setFirstList();
          } else {
            appService.setInit();
          }
        });
    });
  }

  refreshList() {
    this.event.publish("list:refresh");
    this.menu.close();
  }

  editList() {
    const modal = this.modalCtrl.create(AddList);
    modal.onDidDismiss(retour => {
      if (retour && retour.list) {
        this.storage.setList(retour.list)
          .then(list => {
            this.listService.currentListId = list.id;
            this.event.publish("list:new", list.id);
            this.menu.close();
          });
      }
    });
    modal.present();
  }
}
