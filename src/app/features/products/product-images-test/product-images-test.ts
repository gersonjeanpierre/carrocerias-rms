import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ProductImagesService } from '@core/services/product-images.service';

/**
 * Componente de prueba para verificar el servicio de imágenes de productos
 */
@Component({
  selector: 'app-product-images-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Product Images Service Test</h2>

      <div class="stats stats-vertical lg:stats-horizontal shadow mb-4">
        <div class="stat">
          <div class="stat-title">Total Categories</div>
          <div class="stat-value">{{ categories().length }}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Total Models</div>
          <div class="stat-value">{{ totalModels() }}</div>
        </div>
      </div>

      <div class="space-y-4">
        @for (category of categories(); track category.id) {
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">{{ category.name }}</h3>
              <p class="text-sm opacity-70">ID: {{ category.id }}</p>

              @if (category.subcategories) {
                <div class="ml-4 mt-2">
                  <p class="font-semibold">Subcategorías:</p>
                  @for (sub of category.subcategories; track sub.id) {
                    <div class="ml-4 mt-1">
                      <p class="text-sm">{{ sub.name }} ({{ sub.models.length }} modelos)</p>
                    </div>
                  }
                </div>
              }

              @if (category.models) {
                <p class="text-sm">Modelos: {{ category.models.length }}</p>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export default class ProductImagesTest {
  private readonly productImagesService = inject(ProductImagesService);

  protected readonly categories = this.productImagesService.categories;

  protected readonly totalModels = () => {
    let count = 0;
    for (const category of this.categories()) {
      if (category.subcategories) {
        for (const sub of category.subcategories) {
          count += sub.models.length;
        }
      } else if (category.models) {
        count += category.models.length;
      }
    }
    return count;
  };
}
