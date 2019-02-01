import { Component } from '@angular/core';
import { Platform, Events, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { ListService } from "./services/list.service";
import { ListPage } from '../pages/list/list';
import { MessageService } from './services/messages.service';
import { List } from './classes/list.class';

@Component({
  templateUrl: 'app.html'
})
export class MyShoppingList {

  rootPage: any = ListPage; // page principale de l'application

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public listService: ListService,
    private alertCtrl: AlertController,
    private event: Events,
    private messageService: MessageService,
    private translate: TranslateService,
    private menu: MenuController) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      // recuperation des traductions
      if (this.translate.getBrowserLang()) {
        this.translate.setDefaultLang(this.translate.getBrowserLang());
      } else {
        this.translate.setDefaultLang("en");
      }
      this.translate.get(this.messageService.messagesKeys)
        .subscribe(messages => {
          this.messageService.messages = messages;

          this.listService.getAll()
            .then(lists => {
              if (lists.length > 0) {
                this.changeList(lists[0]);
              } else {
                this.addList();
              }
            });
        });
    });
  }

  changeList(list: List) {
    this.listService.currentList = list;
    this.event.publish("list:change");
    this.menu.close();
  }

  addList() {
    let alert = this.alertCtrl.create({
      title: this.messageService.messages["NEW_LIST"],
      inputs: [
        {
          name: "name",
          placeholder: this.messageService.messages["NAME_LABEL"]
        }
      ],
      buttons: [
        {
          text: this.messageService.messages["CANCEL"],
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: this.messageService.messages["SUBMIT"],
          handler: data => {
            this.listService.setList(new List(data.name))
              .then(list => {
                this.changeList(list);
              });
          }
        }
      ]
    });
    alert.present();
  }
}
