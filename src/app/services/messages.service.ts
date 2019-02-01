import { Injectable } from "@angular/core";
import { ToastController } from 'ionic-angular';

@Injectable()
export class MessageService {

  messagesKeys = [
    "SUBMIT",
    "CANCEL",
    "MENU_TITLE",
    "MODAL_EDIT_LIST_TITLE",
    "MODAL_EDIT_ITEM_TITLE",
    "NEW_LIST",
    "ADD_ITEM",
    "ALERT_WARNING",
    "ALERT_DEL_LIST_TITLE",
    "ALERT_DEL_ITEM_TITLE",
    "NAME_LABEL",
    "COLOR_CHOICE_LABEL",
    "QTY_LABEL",
    "NAME_PLACEHOLDER",
    "QTY_PLACEHOLDER",
    "ERROR.SET_LIST",
    "ERROR.SET_ITEM",
    "ERROR.UPDATE_LIST",
    "ERROR.UPDATE_ITEM",
    "ERROR.GET_LIST",
    "ERROR.GET_ITEMS_IN_LIST",
    "ERROR.DEL_LIST",
    "ERROR.DEL_ITEM",
    "ERROR.DEL_LAST_LIST",
    "ERROR.GET_KEYS",
    "SUCCESS.DEL_LIST"
  ];
  messages: any[] = [];

  constructor(private toastCtrl: ToastController) {
  }

  /**
   * @desc Cree une notification avec un texte custom
   * @param {string} text - Texte a afficher
   */
  notify(text: string): void {
    var config = {
      message: text,
      duration: 2000,
      position: "bottom",
      cssClass: ""
    };
    const toast = this.toastCtrl.create(config);
    toast.present();
  }
}
