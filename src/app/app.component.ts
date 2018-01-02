import { Component } from '@angular/core';
import { Platform, Events, MenuController, ModalController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { AppService } from "./services/app.service";
import { ListPage } from '../pages/list/list';
import { AddList } from '../pages/modals/add-list/modal-add-list';
import { StorageService } from './services/storage.service';
import { EditList } from '../pages/modals/edit-list/modal-edit-list';

@Component({
  templateUrl: 'app.html'
})
export class MyShoppingList {

  rootPage: any = ListPage;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private app: AppService,
    private event: Events,
    private menu: MenuController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private storage: StorageService,
    private translate: TranslateService) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      translate.setDefaultLang("fr");

      // initialisation de la 1ere liste si premier lancement de l'application
      app.isFirstRun()
        .then(isFirstRun => {
          if (isFirstRun) {
            storage.setFirstList()
              .then(() => this.event.publish("list:change"));
          } else {
            this.event.publish("list:change");
          }
        });
    });
  }

  addList() {
    const modal = this.modalCtrl.create(AddList);
    modal.onDidDismiss(retour => {
      if (retour && retour.list) {
        this.storage.setList(retour.list)
          .then(list => {
            this.app.currentListId = list.id;
            this.event.publish("list:change");
            this.menu.close();
          });
      }
    });
    modal.present();
  }

  delList() {
    let confirm = this.alertCtrl.create({
      title: 'Suppression liste',
      message: 'Etes-vous surs de vouloir supprimer la liste ?',
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: 'Valider',
          handler: () => {
            this.storage.getList(this.app.currentListId)
              .then(list => {
                this.storage.delList(list)
                  .then(notMainList => {
                    if (notMainList) {
                      this.app.previousList();
                      this.app.listsIds.splice(this.app.listsIds.findIndex(id => id === list.id), 1);
                      this.event.publish("list:change");
                    }
                    this.menu.close();
                  });
              });
          }
        }
      ]
    });
    confirm.present();
  }

  editList() {
    this.storage.getList(this.app.currentListId)
      .then((list) => {
        const modal = this.modalCtrl.create(EditList, {
          'list': list
        });
        modal.onDidDismiss(retour => {
          if (retour && retour.list) {
            this.storage.setList(retour.list, true)
              .then(list => {
                this.event.publish("list:change");
                this.menu.close();
              });
          }
        });
        modal.present();
      })
  }
}
