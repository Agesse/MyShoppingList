import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyShoppingList } from './app.component';

import { ListService } from "./services/list.service";
import { AppService } from "./services/app.service";
import { NotificationService } from "./services/notification.service";

import { ListPage } from '../pages/list/list';
import { AddItem } from '../pages/modals/add-item/modal-add-item';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UpdateItem } from '../pages/modals/update-item/modal-update-item';
import { StorageService } from './services/storage.service';
import { AddList } from '../pages/modals/add-list/modal-add-list';

@NgModule({
  declarations: [
    MyShoppingList,
    ListPage,
    AddItem,
    AddList,
    UpdateItem
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
    AddItem,
    AddList,
    UpdateItem
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NotificationService,
    Vibration,
    ListService,
    StorageService,
    AppService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
