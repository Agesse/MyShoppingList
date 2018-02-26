import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyShoppingList } from './app.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ColorSelectModule } from '@agesse/core';

import { AppService } from "./services/app.service";
import { NotificationService } from "./services/notification.service";

import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StorageService } from './services/storage.service';
import { EditList } from '../pages/modals/edit-list/edit-list';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyShoppingList,
    ListPage,
    EditList
  ],
  imports: [
    BrowserModule,
    ColorSelectModule,
    IonicModule.forRoot(MyShoppingList),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyShoppingList,
    ListPage,
    EditList
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NotificationService,
    Vibration,
    StorageService,
    AppService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
