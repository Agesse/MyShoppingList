import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Item } from '../../app/classes/item.class';
import { Rayon } from '../../app/classes/rayon.class';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  // VARIABLES
  listName: string;
  itemList: Item[];
  rayonList: Rayon[];

  constructor(public navCtrl: NavController) {
    this.listName = "Liste de courses";
  }

} 
