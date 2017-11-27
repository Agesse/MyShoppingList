import { Component } from '@angular/core';
import { COLORS } from "../../constants/colors.constants";

@Component({
  selector: 'color-select',
  templateUrl: 'color-select.html'
})
export class ColorSelect {
  colors = COLORS;

  constructor() {
  }

}