import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductImagesService } from '@core/services/product-images.service';
import type { ProductImage, ProductSpecification } from '@core/models/product-image.models';

import { Model3d } from '../../../shared/model3d/model3d';

interface ProductDetailModel {
  readonly id: string;
  readonly modelId: string;
  readonly name: string;
  readonly categoryId: string;
  readonly categoryPath: string;
  readonly subcategoryId?: string;
  readonly subcategoryPath?: string;
  readonly modelFolderName: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly specifications: readonly ProductSpecification[];
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
  imports: [RouterLink, Model3d],
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

  // Determinar si mostrar modelo 3D (solo para brazos de izaje)
  protected readonly shouldShow3DModel = computed(() => {
    const product = this.product();
    return product?.categoryId === '1-brazos-de-izaje';
  });

  // Obtener el nombre del modelo 3D basado en el producto
  protected readonly model3DName = computed(() => {
    const product = this.product();
    if (!product || product.categoryId !== '1-brazos-de-izaje') return '';

    /**
     * MAPEO DE MODELOS 3D
     * ---------------------
     * Para agregar más modelos 3D:
     * 1. Coloca el archivo .glb en: src/assets/models/3d/nombre-modelo.glb
     * 2. Agrega el mapeo aquí según subcategoryId o modelId
     *
     * Ejemplo:
     * if (product.subcategoryId === 'brazo-de-izaje-carga-pesada-14-20tn') {
     *   return 'brazo-pesado-model';
     * }
     * if (product.subcategoryId === 'brazo-de-izaje-carga-liviana-3-5tn') {
     *   return 'brazo-liviano-model';
     * }
     */

    // Modelo por defecto para brazos de izaje
    return 'bi-model-3d';
  });

  // Producto actual basado en modelo
  protected readonly product = computed<ProductDetailModel | null>(() => {
    const id = this.productId()?.get('id');
    if (!id) return null;

    const parts = id.split('/');

    // Formato: categoryId/subcategoryId/modelId
    if (parts.length === 3) {
      const [categoryId, subcategoryId, modelId] = parts;
      const category = this.productImagesService.categories().find((c) => c.id === categoryId);
      const subcategory = category?.subcategories?.find((s) => s.id === subcategoryId);
      const model = subcategory?.models.find((m) => m.id === modelId);

      if (!model || !category || !subcategory) return null;

      return {
        id,
        modelId: model.id,
        name: model.name,
        categoryId,
        categoryPath: category.path,
        subcategoryId,
        subcategoryPath: subcategory.path,
        modelFolderName: model.folderName,
        description:
          subcategory.description ||
          category.description ||
          `Producto de alta calidad fabricado según las especificaciones más exigentes del mercado. 
        Este ${model.name} combina durabilidad y rendimiento excepcional, diseñado para satisfacer 
        las necesidades de operaciones industriales y comerciales de gran escala.`,
        features: [
          'Fabricación con materiales de primera calidad',
          'Diseño robusto y duradero',
          'Cumple con normativas internacionales',
          'Mantenimiento simplificado',
          'Garantía extendida disponible'
        ],
        specifications: subcategory.specifications || category.specifications || [],
        images: model.images
      };
    }

    // Formato: categoryId/modelId
    if (parts.length === 2) {
      const [categoryId, modelId] = parts;
      const category = this.productImagesService.categories().find((c) => c.id === categoryId);
      const model = category?.models?.find((m) => m.id === modelId);

      if (!model || !category) return null;

      return {
        id,
        modelId: model.id,
        name: model.name,
        categoryId,
        categoryPath: category.path,
        modelFolderName: model.folderName,
        description:
          category.description ||
          `Producto de alta calidad fabricado según las especificaciones más exigentes del mercado. 
        Este ${model.name} combina durabilidad y rendimiento excepcional, diseñado para satisfacer 
        las necesidades de operaciones industriales y comerciales de gran escala.`,
        features: [
          'Fabricación con materiales de primera calidad',
          'Diseño robusto y duradero',
          'Cumple con normativas internacionales',
          'Mantenimiento simplificado',
          'Garantía extendida disponible'
        ],
        specifications: category.specifications || [],
        images: model.images
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

    return {
      path: this.productImagesService.getImagePath(
        product.categoryPath,
        product.modelFolderName,
        image.fileName,
        product.subcategoryPath
      ),
      alt: image.alt
    };
  });

  // Productos similares (3 productos de la misma categoría)
  protected readonly similarProducts = computed(() => {
    const currentProduct = this.product();
    if (!currentProduct) return [];

    const currentCategory = this.productImagesService
      .categories()
      .find((c) => c.id === currentProduct.categoryId);
    if (!currentCategory) return [];

    const products: {
      id: string;
      name: string;
      imagePath: string;
      imageAlt: string;
    }[] = [];

    // Obtener otros modelos de la misma categoría
    if (currentCategory.subcategories) {
      for (const subcategory of currentCategory.subcategories) {
        // Si es la misma subcategoría, agregar otros modelos (excepto el actual)
        if (subcategory.id === currentProduct.subcategoryId) {
          for (const model of subcategory.models) {
            const modelProductId = `${currentCategory.id}/${subcategory.id}/${model.id}`;
            if (modelProductId !== currentProduct.id && model.images.length > 0) {
              products.push({
                id: modelProductId,
                name: model.name,
                imagePath: this.productImagesService.getImagePath(
                  currentCategory.path,
                  model.folderName,
                  model.images[0].fileName,
                  subcategory.path
                ),
                imageAlt: model.images[0].alt
              });
            }
            if (products.length >= 3) break;
          }
        } else {
          // Agregar modelos de otras subcategorías
          for (const model of subcategory.models) {
            if (model.images.length > 0) {
              products.push({
                id: `${currentCategory.id}/${subcategory.id}/${model.id}`,
                name: model.name,
                imagePath: this.productImagesService.getImagePath(
                  currentCategory.path,
                  model.folderName,
                  model.images[0].fileName,
                  subcategory.path
                ),
                imageAlt: model.images[0].alt
              });
            }
            if (products.length >= 3) break;
          }
        }
        if (products.length >= 3) break;
      }
    } else if (currentCategory.models) {
      // Agregar otros modelos de la misma categoría
      for (const model of currentCategory.models) {
        const modelProductId = `${currentCategory.id}/${model.id}`;
        if (modelProductId !== currentProduct.id && model.images.length > 0) {
          products.push({
            id: modelProductId,
            name: model.name,
            imagePath: this.productImagesService.getImagePath(
              currentCategory.path,
              model.folderName,
              model.images[0].fileName
            ),
            imageAlt: model.images[0].alt
          });
        }
        if (products.length >= 3) break;
      }
    }

    // Si no hay suficientes, buscar en otras categorías
    if (products.length < 3) {
      for (const category of this.productImagesService.categories()) {
        if (category.id === currentCategory.id) continue;

        if (category.subcategories) {
          for (const subcategory of category.subcategories) {
            for (const model of subcategory.models) {
              if (model.images.length > 0) {
                products.push({
                  id: `${category.id}/${subcategory.id}/${model.id}`,
                  name: model.name,
                  imagePath: this.productImagesService.getImagePath(
                    category.path,
                    model.folderName,
                    model.images[0].fileName,
                    subcategory.path
                  ),
                  imageAlt: model.images[0].alt
                });
              }
              if (products.length >= 3) break;
            }
            if (products.length >= 3) break;
          }
        } else if (category.models) {
          for (const model of category.models) {
            if (model.images.length > 0) {
              products.push({
                id: `${category.id}/${model.id}`,
                name: model.name,
                imagePath: this.productImagesService.getImagePath(
                  category.path,
                  model.folderName,
                  model.images[0].fileName
                ),
                imageAlt: model.images[0].alt
              });
            }
            if (products.length >= 3) break;
          }
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

  protected getThumbnailPath(image: ProductImage): string {
    const product = this.product();
    if (!product) return '';

    return this.productImagesService.getImagePath(
      product.categoryPath,
      product.modelFolderName,
      image.fileName,
      product.subcategoryPath
    );
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
