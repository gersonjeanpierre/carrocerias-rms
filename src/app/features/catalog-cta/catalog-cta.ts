import { Component } from '@angular/core';

@Component({
  selector: 'app-catalog-cta',
  templateUrl: './catalog-cta.html',
  styleUrls: ['./catalog-cta.css'],
})
export class CatalogCtaComponent {
  handleCatalogClick(): void {
    console.log('Abriendo catálogo');
  }
}
