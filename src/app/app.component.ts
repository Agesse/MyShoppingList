import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ListService } from "./services/list.service";
import { AppService } from "./services/app.service";
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyShoppingList {
  rootPage: any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, appService: AppService, listService: ListService) {

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
}
