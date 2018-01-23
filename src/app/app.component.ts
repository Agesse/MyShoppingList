import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { AppService } from "./services/app.service";
import { ListPage } from '../pages/list/list';
import { StorageService } from './services/storage.service';

@Component({
  templateUrl: 'app.html'
})
export class MyShoppingList {

  rootPage: any = ListPage; // page principale de l'application

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private app: AppService,
    private event: Events,
    private storage: StorageService,
    private translate: TranslateService) {

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
                  .then(() => this.event.publish("list:change"));
              } else {
                this.event.publish("list:change");
              }
            });
        });
    });
  }
}
