import { Injectable } from "@angular/core";
import { ToastController } from 'ionic-angular';

@Injectable()
export class NotificationService {

  constructor(private toastCtrl: ToastController) {
  }

  /**
   * @desc Cree une notification avec un texte custom
   * @param {string} text - Texte a afficher
   * @param {boolean} error - Vrai si on affiche une erreur
   */
  notify(text: string, error?: boolean): void {
    var config = {
      message: text,
      duration: 2000,
      position: "bottom",
      cssClass: ""
    };
    if (error) {
      config.cssClass = "alert-error";
    }
    const toast = this.toastCtrl.create(config);
    toast.present();
  }
}