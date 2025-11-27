import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductImagesService } from '@core/services/product-images-service';
import type { ProductImage } from '@core/models/product-image.models';

interface ProductDetailModel {
  readonly id: string;
  readonly name: string;
  readonly categoryId: string;
  readonly subcategoryId?: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly images: readonly ProductImage[];
}

interface QuoteForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  protected readonly productImagesService = inject(ProductImagesService);

  // Obtener el ID del producto desde la ruta
  protected readonly productId = toSignal(this.route.paramMap, { initialValue: null });

  // Estado del formulario de cotización
  protected readonly quoteForm = signal<QuoteForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  // Estado de la imagen seleccionada
  protected readonly selectedImageIndex = signal(0);

  // Producto actual
  protected readonly product = computed<ProductDetailModel | null>(() => {
    const id = this.productId()?.get('id');
    if (!id) return null;

    const categories = this.productImagesService.allCategories();

    // Buscar en categorías con subcategorías (formato: categoryId/subcategoryId)
    if (id.includes('/')) {
      const [categoryId, subcategoryId] = id.split('/');
      const category = categories.find((c) => c.id === categoryId);
      const subcategory = category?.subcategories?.find((s) => s.id === subcategoryId);

      if (subcategory && category) {
        return {
          id,
          name: subcategory.name,
          categoryId: category.id,
          subcategoryId: subcategory.id,
          description: `${subcategory.name} de alta calidad fabricado con los mejores materiales.`,
          features: [
            'Fabricado con materiales de alta resistencia',
            'Tratamiento anticorrosivo de los metales',
            '24 meses de garantía frente a defectos de fabricación',
            'Cumple con estándares de seguridad internacionales'
          ],
          images: subcategory.images
        };
      }
    }

    // Buscar en categorías directas
    const category = categories.find((c) => c.id === id);
    if (category?.images) {
      return {
        id,
        name: category.name,
        categoryId: category.id,
        description: `${category.name} de alta calidad fabricado con los mejores materiales.`,
        features: [
          'Fabricado con materiales de alta resistencia',
          'Tratamiento anticorrosivo de los metales',
          '24 meses de garantía frente a defectos de fabricación',
          'Cumple con estándares de seguridad internacionales'
        ],
        images: category.images
      };
    }

    return null;
  });

  // Imagen seleccionada
  protected readonly selectedImage = computed(() => {
    const product = this.product();
    if (!product) return null;

    const index = this.selectedImageIndex();
    const image = product.images[index];
    if (!image) return null;

    const categoryPath = this.productImagesService
      .allCategories()
      .find((c) => c.id === product.categoryId)?.path;

    if (!categoryPath) return null;

    const subcategoryPath = product.subcategoryId
      ? this.productImagesService
          .allCategories()
          .find((c) => c.id === product.categoryId)
          ?.subcategories?.find((s) => s.id === product.subcategoryId)?.path
      : undefined;

    return {
      path: this.productImagesService.getImagePath(categoryPath, image.path, subcategoryPath),
      alt: image.alt
    };
  });

  // Productos similares (3 productos de la misma categoría)
  protected readonly similarProducts = computed(() => {
    const currentProduct = this.product();
    if (!currentProduct) return [];

    const categories = this.productImagesService.allCategories();
    const currentCategory = categories.find((c) => c.id === currentProduct.categoryId);
    if (!currentCategory) return [];

    const products: Array<{
      id: string;
      name: string;
      imagePath: string;
      imageAlt: string;
    }> = [];

    // Obtener productos de subcategorías
    if (currentCategory.subcategories) {
      for (const subcategory of currentCategory.subcategories) {
        // Excluir el producto actual
        if (subcategory.id === currentProduct.subcategoryId) continue;

        const firstImage = subcategory.images[0];
        if (firstImage) {
          products.push({
            id: `${currentCategory.id}/${subcategory.id}`,
            name: subcategory.name,
            imagePath: this.productImagesService.getImagePath(
              currentCategory.path,
              firstImage.path,
              subcategory.path
            ),
            imageAlt: firstImage.alt
          });
        }

        // Limitar a 3 productos
        if (products.length >= 3) break;
      }
    }

    // Si no hay suficientes, buscar en otras categorías
    if (products.length < 3) {
      for (const category of categories) {
        if (category.id === currentCategory.id) continue;

        if (category.subcategories) {
          for (const subcategory of category.subcategories) {
            const firstImage = subcategory.images[0];
            if (firstImage) {
              products.push({
                id: `${category.id}/${subcategory.id}`,
                name: subcategory.name,
                imagePath: this.productImagesService.getImagePath(
                  category.path,
                  firstImage.path,
                  subcategory.path
                ),
                imageAlt: firstImage.alt
              });
            }

            if (products.length >= 3) break;
          }
        } else if (category.images && category.images.length > 0) {
          const firstImage = category.images[0];
          products.push({
            id: category.id,
            name: category.name,
            imagePath: this.productImagesService.getImagePath(category.path, firstImage.path),
            imageAlt: firstImage.alt
          });
        }

        if (products.length >= 3) break;
      }
    }

    return products.slice(0, 3);
  });

  // Métodos de interacción
  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  protected updateFormField<K extends keyof QuoteForm>(field: K, value: QuoteForm[K]): void {
    this.quoteForm.update((form) => ({
      ...form,
      [field]: value
    }));
  }

  protected submitQuote(): void {
    const form = this.quoteForm();
    const product = this.product();

    // Validación básica
    if (!form.name || !form.email || !form.phone) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    console.log('Cotización enviada:', {
      product: product?.name,
      ...form
    });

    // TODO: Integrar con backend o servicio de email
    alert('¡Cotización enviada exitosamente! Nos pondremos en contacto pronto.');

    // Limpiar formulario
    this.quoteForm.set({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    });
  }
}
