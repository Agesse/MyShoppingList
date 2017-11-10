export class List {
  id: number;
  label: string;
  itemOrder: number[];

  constructor(label: string) {
    this.label = label;
    this.itemOrder = [];
  }
}