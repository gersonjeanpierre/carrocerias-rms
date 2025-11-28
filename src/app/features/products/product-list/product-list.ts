import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductImagesService } from '@core/services/product-images.service';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductList {
  // Servicios
  private readonly productImagesService = inject(ProductImagesService);

  // Estado reactivo
  protected readonly searchQuery = signal('');
  protected readonly selectedCategoryId = signal<string | null>(null);

  // Datos de productos
  protected readonly allCategories = this.productImagesService.allCategories;

  // Categorías filtradas por búsqueda
  protected readonly filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const selectedId = this.selectedCategoryId();
    const categories = this.allCategories();

    if (!query && !selectedId) {
      return categories;
    }

    return categories.filter((category) => {
      // Filtrar por categoría seleccionada
      if (selectedId && category.id !== selectedId) {
        return false;
      }

      // Filtrar por búsqueda
      if (query) {
        return category.name.toLowerCase().includes(query);
      }

      return true;
    });
  });

  // Productos (modelos) para mostrar en el grid
  protected readonly displayProducts = computed(() => {
    const categories = this.filteredCategories();
    const products: {
      id: string;
      name: string;
      categoryId: string;
      subcategoryId?: string;
      imagePath: string;
      imageAlt: string;
    }[] = [];

    for (const category of categories) {
      // Si tiene subcategorías, crear un producto por cada MODELO
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          for (const model of subcategory.models) {
            // Usar la primera imagen del modelo para el preview
            const firstImage = model.images[0];
            if (firstImage) {
              products.push({
                id: `${category.id}/${subcategory.id}/${model.id}`,
                name: model.name,
                categoryId: category.id,
                subcategoryId: subcategory.id,
                imagePath: this.productImagesService.getImagePath(
                  category.path,
                  model.folderName,
                  firstImage.fileName,
                  subcategory.path
                ),
                imageAlt: firstImage.alt
              });
            }
          }
        }
      }
      // Si tiene modelos directos, crear un producto por cada MODELO
      else if (category.models && category.models.length > 0) {
        for (const model of category.models) {
          const firstImage = model.images[0];
          if (firstImage) {
            products.push({
              id: `${category.id}/${model.id}`,
              name: model.name,
              categoryId: category.id,
              imagePath: this.productImagesService.getImagePath(
                category.path,
                model.folderName,
                firstImage.fileName
              ),
              imageAlt: firstImage.alt
            });
          }
        }
      }
    }

    return products;
  });

  // Métodos de interacción
  protected onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  protected selectCategory(categoryId: string | null): void {
    this.selectedCategoryId.set(categoryId);
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategoryId.set(null);
  }

  protected getCategoryName(categoryId: string): string {
    const category = this.allCategories().find((c) => c.id === categoryId);
    return category?.name ?? '';
  }
}
