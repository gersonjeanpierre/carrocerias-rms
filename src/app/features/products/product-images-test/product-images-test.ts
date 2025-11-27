import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { ProductImagesService } from '@core/services/product-images-service';

/**
 * Componente de prueba para verificar el servicio de imágenes de productos
 */
@Component({
  selector: 'app-product-images-test',
  standalone: true,
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
          <div class="stat-title">Total Images</div>
          <div class="stat-value">{{ allImages().length }}</div>
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
                      <p class="text-sm">{{ sub.name }} ({{ sub.images.length }} imágenes)</p>
                    </div>
                  }
                </div>
              }

              @if (category.images) {
                <p class="text-sm">Imágenes directas: {{ category.images.length }}</p>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductImagesTest implements OnInit {
  private readonly productImagesService = inject(ProductImagesService);

  protected readonly categories = this.productImagesService.allCategories;
  protected readonly allImages = this.productImagesService.allImages;

  ngOnInit(): void {
    console.log('=== Product Images Service Test ===');
    console.log('Total categories:', this.categories().length);
    console.log('Total images:', this.allImages().length);
    console.log('All categories:', this.categories());
    console.log('All images with paths:', this.allImages());

    // Test specific methods
    const category1 = this.productImagesService.getCategoryById('1-brazos-de-izaje');
    console.log('Category 1:', category1);

    const subcategory = this.productImagesService.getSubcategory(
      '1-brazos-de-izaje',
      'brazo-de-izaje-carga-pesada-14-20tn'
    );
    console.log('Subcategory:', subcategory);

    const categoryImages = this.productImagesService.getCategoryImages('2-contenedores');
    console.log('Contenedores images:', categoryImages);

    // Test path generation
    const testPath1 = this.productImagesService.getImagePath(
      '1-brazos-de-izaje',
      'brazo-de-izaje-1.jpg',
      'brazo-de-izaje-carga-pesada-14-20tn'
    );
    console.log('Test path with subcategory:', testPath1);

    const testPath2 = this.productImagesService.getImagePath('2-contenedores', 'contenedor-1.jpg');
    console.log('Test path without subcategory:', testPath2);
  }
}
