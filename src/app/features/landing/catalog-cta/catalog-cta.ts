import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-catalog-cta',
  templateUrl: './catalog-cta.html',
  styleUrls: ['./catalog-cta.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogCtaComponent {
  handleCatalogClick(): void {
    console.log('Abriendo catálogo');
  }
}
