import { Injectable } from "@angular/core";
import { ToastController } from 'ionic-angular';

@Injectable()
export class NotificationService {

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
