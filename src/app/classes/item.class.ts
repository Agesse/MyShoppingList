export class Item {
  id: number;
  libelle: string;
  idRayon: number;
  qty: number;
  checked: boolean;

  constructor(libelle: string) {
    this.libelle = libelle;
    this.idRayon = 0;
    this.qty = 1;
    this.checked = false;
  }
}