import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-item',
  imports: [RouterLink],
  templateUrl: './product-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductItem {
  readonly productId = input.required<string>();
  readonly productName = input.required<string>();
  readonly imagePath = input.required<string>();
  readonly imageAlt = input.required<string>();
  readonly showBadge = input<boolean>(true);
}
