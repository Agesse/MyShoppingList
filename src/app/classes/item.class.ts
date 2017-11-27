export class Item {
  id: number;
  label: string;
  qty: number;
  checked: boolean;
  isSubtitle: boolean;
  hide: boolean;

  constructor(label: string) {
    this.label = label;
    this.qty = 1;
    this.checked = false;
    this.isSubtitle = false;
    this.hide = false;
  }
}