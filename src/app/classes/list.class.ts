import { Colors, COLOR_BASICS } from "@ng-agesse/core";

export class List {
  id: number;
  label: string;
  itemOrder: number[];
  color: Colors;

  constructor(label: string) {
    this.label = label;
    this.itemOrder = [];
    this.color = COLOR_BASICS[0];
  }
}