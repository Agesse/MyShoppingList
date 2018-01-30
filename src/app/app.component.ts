import { Component } from '@angular/core';
import { Platform, Events, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { AppService } from "./services/app.service";
import { ListPage } from '../pages/list/list';
import { StorageService } from './services/storage.service';
import { List } from './classes/list.class';

@Component({
  templateUrl: 'app.html'
})
export class MyShoppingList {

  rootPage: any = ListPage; // page principale de l'application

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public app: AppService,
    private alertCtrl: AlertController,
    private event: Events,
    private storage: StorageService,
    private translate: TranslateService,
    private menu: MenuController) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      // recuperation des traductions
      if (translate.getBrowserLang()) {
        translate.setDefaultLang(translate.getBrowserLang());
      } else {
        translate.setDefaultLang("en");
      }
      translate.get(storage.messagesKeys)
        .subscribe(messages => {
          storage.messages = messages;

          // initialisation de la 1ere liste si premier lancement de l'application
          app.isFirstRun()
            .then(isFirstRun => {
              if (isFirstRun) {
                storage.setFirstList()
                  .then(() => {
                    this.storage.getList(0).then(list => {
                      this.app.currentList = list;
                      this.event.publish("list:change");
                    });
                  });
              } else {
                this.storage.getList(0).then(list => {
                  this.app.currentList = list;
                  this.event.publish("list:change");
                });
              }
            });
        });
    });
  }


  changeList(list: List) {
    this.app.currentList = list;
    this.event.publish("list:change");
    this.menu.close();
  }

  addList() {
    this.translate.get(["NEW_LIST", "NAME_LABEL", "CANCEL", "SUBMIT"]).subscribe(messages => {
      let alert = this.alertCtrl.create({
        title: messages["NEW_LIST"],
        inputs: [
          {
            name: "name",
            placeholder: messages["NAME_LABEL"]
          }
        ],
        buttons: [
          {
            text: messages["CANCEL"],
            role: 'cancel',
            handler: data => {
            }
          },
          {
            text: messages["SUBMIT"],
            handler: data => {
              this.storage.setList(new List(data.name))
                .then(list => {
                  this.app.currentList = list;
                  this.event.publish("list:change");
                });
            }
          }
        ]
      });
      alert.present();
    });
  }
}
