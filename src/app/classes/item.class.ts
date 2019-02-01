export class Item {
  id: number;
  label: string;
  qty: number;

  constructor(label: string) {
    this.label = label;
    this.qty = 1;
  }
}
