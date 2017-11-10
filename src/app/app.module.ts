import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyShoppingList } from './app.component';

import { ListService } from "./services/list.service";
import { AppService } from "./services/app.service";
import { NotificationService } from "./services/notification.service";

import { ListPage } from '../pages/list/list';
import { TabsPage } from '../pages/tabs/tabs';
import { AddItem } from '../pages/modals/add-item/modal-add-item';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyShoppingList,
    ListPage,
    TabsPage,
    AddItem
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyShoppingList),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyShoppingList,
    ListPage,
    TabsPage,
    AddItem
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NotificationService,
    ListService,
    AppService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
