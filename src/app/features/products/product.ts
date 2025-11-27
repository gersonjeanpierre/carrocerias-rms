import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [RouterOutlet],
  templateUrl: './product.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Product {}
