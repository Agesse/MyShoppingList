import { Colors } from "@agesse/core";
import { COLOR_BASICS } from "../constants/color.constants";

export class List {
  id: number;
  label: string;
  itemOrder: number[];
  color: Colors;

  constructor(label: string) {
    this.label = label;
    this.itemOrder = [];
    this.color = COLOR_BASICS.find(valeur => valeur.label === "light-blue");
  }
}
