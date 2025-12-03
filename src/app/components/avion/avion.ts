import { Component } from '@angular/core';
import {MatFormFieldModule, MatLabel, MatHint} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-avion',
  imports: [MatFormFieldModule, MatIcon, MatLabel, MatHint],
  templateUrl: './avion.html',
  styleUrl: './avion.css',
})
export class Avion {

}
