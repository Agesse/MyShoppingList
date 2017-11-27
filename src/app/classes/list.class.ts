export class List {
  id: number;
  label: string;
  itemOrder: number[];
  color: string;

  constructor(label: string) {
    this.label = label;
    this.itemOrder = [];
    this.color = "blue";
  }
}