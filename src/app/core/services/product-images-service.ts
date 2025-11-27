import { Injectable, signal, computed } from '@angular/core';
import type { ProductCategory, ProductImage } from '../models/product-image.models';

/**
 * Servicio centralizado para gestionar rutas de imágenes de productos
 *
 * Proporciona acceso a todas las categorías de productos y sus imágenes,
 * con métodos helper para construir rutas completas y buscar datos específicos.
 *
 * @example
 * ```typescript
 * export class ProductList {
 *   private readonly productImages = inject(ProductImagesService);
 *
 *   readonly categories = this.productImages.allCategories;
 *   readonly images = this.productImages.allImages;
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ProductImagesService {
  private readonly basePath = '/images/products';

  /**
   * Catálogo completo de productos con sus imágenes
   */
  private readonly categories = signal<readonly ProductCategory[]>([
    // 1. Brazos de Izaje (con subcategorías)
    {
      id: '1-brazos-de-izaje',
      name: 'Brazos de Izaje',
      path: '1-brazos-de-izaje',
      subcategories: [
        {
          id: 'brazo-de-izaje-carga-pesada-14-20tn',
          name: 'Brazo de Izaje Carga Pesada (14-20tn)',
          path: 'brazo-de-izaje-carga-pesada-14-20tn',
          images: [
            {
              path: 'brazo-de-izaje-1.jpg',
              alt: 'Brazo de Izaje Carga Pesada - Vista 1',
              categoryId: '1-brazos-de-izaje',
              subcategoryId: 'brazo-de-izaje-carga-pesada-14-20tn'
            },
            {
              path: 'brazo-de-izaje-2.jpg',
              alt: 'Brazo de Izaje Carga Pesada - Vista 2',
              categoryId: '1-brazos-de-izaje',
              subcategoryId: 'brazo-de-izaje-carga-pesada-14-20tn'
            },
            {
              path: 'brazo-de-izaje-3.jpg',
              alt: 'Brazo de Izaje Carga Pesada - Vista 3',
              categoryId: '1-brazos-de-izaje',
              subcategoryId: 'brazo-de-izaje-carga-pesada-14-20tn'
            },
            {
              path: 'brazo-de-izaje-4.jpg',
              alt: 'Brazo de Izaje Carga Pesada - Vista 4',
              categoryId: '1-brazos-de-izaje',
              subcategoryId: 'brazo-de-izaje-carga-pesada-14-20tn'
            },
            {
              path: 'brazo-de-izaje-5.jpg',
              alt: 'Brazo de Izaje Carga Pesada - Vista 5',
              categoryId: '1-brazos-de-izaje',
              subcategoryId: 'brazo-de-izaje-carga-pesada-14-20tn'
            },
            {
              path: 'brazo-de-izaje-6.jpg',
              alt: 'Brazo de Izaje Carga Pesada - Vista 6',
              categoryId: '1-brazos-de-izaje',
              subcategoryId: 'brazo-de-izaje-carga-pesada-14-20tn'
            }
          ]
        },
        {
          id: 'brazo-de-izaje-carga-intermedia-7-12tn',
          name: 'Brazo de Izaje Carga Intermedia (7-12tn)',
          path: 'brazo-de-izaje-carga-intermedia-7-12tn',
          images: []
        },
        {
          id: 'brazo-de-izaje-carga-liviana-3-5tn',
          name: 'Brazo de Izaje Carga Liviana (3-5tn)',
          path: 'brazo-de-izaje-carga-liviana-3-5tn',
          images: []
        }
      ]
    },

    // 2. Contenedores (imágenes directas)
    {
      id: '2-contenedores',
      name: 'Contenedores',
      path: '2-contenedores',
      images: [
        { path: 'contenedor-1.jpg', alt: 'Contenedor - Vista 1', categoryId: '2-contenedores' },
        { path: 'contenedor-2.jpg', alt: 'Contenedor - Vista 2', categoryId: '2-contenedores' },
        { path: 'contenedor-3.jpg', alt: 'Contenedor - Vista 3', categoryId: '2-contenedores' },
        { path: 'contenedor-4.jpg', alt: 'Contenedor - Vista 4', categoryId: '2-contenedores' },
        { path: 'contenedor-5.jpg', alt: 'Contenedor - Vista 5', categoryId: '2-contenedores' }
      ]
    },

    // 3. Tanques Cisternas de Vacío
    {
      id: '3-tanques-cisternas-de-vacio',
      name: 'Tanques Cisternas de Vacío',
      path: '3-tanques-cisternas-de-vacio',
      images: [
        {
          path: 'cisterna-de-vacio-1.jpg',
          alt: 'Cisterna de Vacío - Vista 1',
          categoryId: '3-tanques-cisternas-de-vacio'
        },
        {
          path: 'cisterna-de-vacio-2.jpg',
          alt: 'Cisterna de Vacío - Vista 2',
          categoryId: '3-tanques-cisternas-de-vacio'
        },
        {
          path: 'cisterna-de-vacio-3.jpg',
          alt: 'Cisterna de Vacío - Vista 3',
          categoryId: '3-tanques-cisternas-de-vacio'
        },
        {
          path: 'cisterna-de-vacio-4.jpg',
          alt: 'Cisterna de Vacío - Vista 4',
          categoryId: '3-tanques-cisternas-de-vacio'
        },
        {
          path: 'cisterna-de-vacio-5.jpg',
          alt: 'Cisterna de Vacío - Vista 5',
          categoryId: '3-tanques-cisternas-de-vacio'
        },
        {
          path: 'cisterna-de-vacio-6.jpg',
          alt: 'Cisterna de Vacío - Vista 6',
          categoryId: '3-tanques-cisternas-de-vacio'
        },
        {
          path: 'cisterna-de-vacio-7.jpg',
          alt: 'Cisterna de Vacío - Vista 7',
          categoryId: '3-tanques-cisternas-de-vacio'
        }
      ]
    },

    // 4. Semirremolque Plataforma
    {
      id: '4-semirremolque-plataforma',
      name: 'Semirremolque Plataforma',
      path: '4-semirremolque-plataforma',
      images: [
        {
          path: 'semirremolque-plataforma-1.jpg',
          alt: 'Semirremolque Plataforma - Vista 1',
          categoryId: '4-semirremolque-plataforma'
        },
        {
          path: 'semirremolque-plataforma-2.jpg',
          alt: 'Semirremolque Plataforma - Vista 2',
          categoryId: '4-semirremolque-plataforma'
        },
        {
          path: 'semirremolque-plataforma-3.jpg',
          alt: 'Semirremolque Plataforma - Vista 3',
          categoryId: '4-semirremolque-plataforma'
        },
        {
          path: 'semirremolque-plataforma-4.jpg',
          alt: 'Semirremolque Plataforma - Vista 4',
          categoryId: '4-semirremolque-plataforma'
        },
        {
          path: 'semirremolque-plataforma-5.jpg',
          alt: 'Semirremolque Plataforma - Vista 5',
          categoryId: '4-semirremolque-plataforma'
        }
      ]
    },

    // 5. Volquete Roquero/Semirroquero
    {
      id: '5-volquete-roquero-semirroquero',
      name: 'Volquete Roquero/Semirroquero',
      path: '5-volquete-roquero-semirroquero',
      images: [
        {
          path: 'roquera-1.jpg',
          alt: 'Volquete Roquero - Vista 1',
          categoryId: '5-volquete-roquero-semirroquero'
        },
        {
          path: 'roquera-2.jpg',
          alt: 'Volquete Roquero - Vista 2',
          categoryId: '5-volquete-roquero-semirroquero'
        },
        {
          path: 'semirroquera-1.jpg',
          alt: 'Volquete Semirroquero - Vista 1',
          categoryId: '5-volquete-roquero-semirroquero'
        },
        {
          path: 'semirroquera-2.jpg',
          alt: 'Volquete Semirroquero - Vista 2',
          categoryId: '5-volquete-roquero-semirroquero'
        }
      ]
    },

    // 6. Semirremolque Cama Baja (Lowboy)
    {
      id: '6-semirremolque-cama-baja-lowboy',
      name: 'Semirremolque Cama Baja (Lowboy)',
      path: '6-semirremolque-cama-baja-lowboy',
      images: [
        {
          path: 'cama-baja-1.jpg',
          alt: 'Semirremolque Cama Baja - Vista 1',
          categoryId: '6-semirremolque-cama-baja-lowboy'
        },
        {
          path: 'cama-baja-5.jpg',
          alt: 'Semirremolque Cama Baja - Vista 5',
          categoryId: '6-semirremolque-cama-baja-lowboy'
        },
        {
          path: 'cama-baja-6.jpg',
          alt: 'Semirremolque Cama Baja - Vista 6',
          categoryId: '6-semirremolque-cama-baja-lowboy'
        }
      ]
    },

    // 7. Semirremolque Volquete (sin imágenes aún)
    {
      id: '7-semirremolque-volquete',
      name: 'Semirremolque Volquete',
      path: '7-semirremolque-volquete',
      images: []
    },

    // 8. Semirremolque Cisterna (sin imágenes aún)
    {
      id: '8-semirremolque-cisterna',
      name: 'Semirremolque Cisterna',
      path: '8-semirremolque-cisterna',
      images: []
    },

    // 9. Cisterna (sin imágenes aún)
    {
      id: '9-cisterna',
      name: 'Cisterna',
      path: '9-cisterna',
      images: []
    },

    // 10. Furgones
    {
      id: '10-furgones',
      name: 'Furgones',
      path: '10-furgones',
      images: [
        { path: 'furgon-1.jpg', alt: 'Furgón - Vista 1', categoryId: '10-furgones' },
        { path: 'furgon-3.jpg', alt: 'Furgón - Vista 3', categoryId: '10-furgones' },
        { path: 'furgon-4.jpg', alt: 'Furgón - Vista 4', categoryId: '10-furgones' },
        { path: 'furgon-5.jpg', alt: 'Furgón - Vista 5', categoryId: '10-furgones' },
        { path: 'furgon-7.jpg', alt: 'Furgón - Vista 7', categoryId: '10-furgones' },
        { path: 'furgon-8.jpg', alt: 'Furgón - Vista 8', categoryId: '10-furgones' },
        { path: 'furgon-9.jpg', alt: 'Furgón - Vista 9', categoryId: '10-furgones' },
        { path: 'furgon-10.jpg', alt: 'Furgón - Vista 10', categoryId: '10-furgones' },
        { path: 'furgon-11.jpg', alt: 'Furgón - Vista 11', categoryId: '10-furgones' },
        { path: 'furgon-12.jpg', alt: 'Furgón - Vista 12', categoryId: '10-furgones' },
        { path: 'furgon-13.jpg', alt: 'Furgón - Vista 13', categoryId: '10-furgones' },
        { path: 'furgon-14.jpg', alt: 'Furgón - Vista 14', categoryId: '10-furgones' },
        { path: 'furgon-15.jpg', alt: 'Furgón - Vista 15', categoryId: '10-furgones' }
      ]
    },

    // 11. Baranda (con subcategorías)
    {
      id: '11-baranda',
      name: 'Baranda',
      path: '11-baranda',
      subcategories: [
        {
          id: '1-baranda-telera',
          name: 'Baranda Telera',
          path: '1-baranda-telera',
          images: []
        },
        {
          id: '2-baranda-rebatible',
          name: 'Baranda Rebatible',
          path: '2-baranda-rebatible',
          images: [
            {
              path: 'rebatible-1.jpg',
              alt: 'Baranda Rebatible - Vista 1',
              categoryId: '11-baranda',
              subcategoryId: '2-baranda-rebatible'
            },
            {
              path: 'rebatible-2.jpg',
              alt: 'Baranda Rebatible - Vista 2',
              categoryId: '11-baranda',
              subcategoryId: '2-baranda-rebatible'
            }
          ]
        }
      ]
    },

    // 12. Grúa con Contenedor para Chatarra
    {
      id: '12-grua-con-contenedor-para-chatarra',
      name: 'Grúa con Contenedor para Chatarra',
      path: '12-grua-con-contenedor-para-chatarra',
      images: [
        {
          path: 'grua-con-contenedor-para-chatarra-1.jpg',
          alt: 'Grúa con Contenedor - Vista 1',
          categoryId: '12-grua-con-contenedor-para-chatarra'
        },
        {
          path: 'grua-con-contenedor-para-chatarra-2.jpg',
          alt: 'Grúa con Contenedor - Vista 2',
          categoryId: '12-grua-con-contenedor-para-chatarra'
        },
        {
          path: 'grua-con-contenedor-para-chatarra-3.jpg',
          alt: 'Grúa con Contenedor - Vista 3',
          categoryId: '12-grua-con-contenedor-para-chatarra'
        },
        {
          path: 'grua-con-contenedor-para-chatarra-4.jpg',
          alt: 'Grúa con Contenedor - Vista 4',
          categoryId: '12-grua-con-contenedor-para-chatarra'
        },
        {
          path: 'grua-con-contenedor-para-chatarra-5.jpg',
          alt: 'Grúa con Contenedor - Vista 5',
          categoryId: '12-grua-con-contenedor-para-chatarra'
        }
      ]
    }
  ]);

  /**
   * Signal computado con todas las categorías
   */
  readonly allCategories = computed(() => this.categories());

  /**
   * Signal computado con todas las imágenes con sus rutas completas
   */
  readonly allImages = computed(() => {
    const images: Array<ProductImage & { fullPath: string }> = [];

    for (const category of this.categories()) {
      // Procesar subcategorías si existen
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          for (const image of subcategory.images) {
            images.push({
              ...image,
              fullPath: this.getImagePath(category.path, image.path, subcategory.path)
            });
          }
        }
      }
      // Procesar imágenes directas si existen
      else if (category.images) {
        for (const image of category.images) {
          images.push({
            ...image,
            fullPath: this.getImagePath(category.path, image.path)
          });
        }
      }
    }

    return images;
  });

  /**
   * Construye la ruta completa de una imagen
   *
   * @param categoryPath - Ruta de la categoría
   * @param imageName - Nombre del archivo de imagen
   * @param subcategoryPath - Ruta de la subcategoría (opcional)
   * @returns Ruta completa desde assets
   *
   * @example
   * ```typescript
   * // Con subcategoría
   * getImagePath('1-brazos-de-izaje', 'brazo-de-izaje-1.jpg', 'brazo-de-izaje-carga-pesada-14-20tn')
   * // => 'assets/images/products/1-brazos-de-izaje/brazo-de-izaje-carga-pesada-14-20tn/brazo-de-izaje-1.jpg'
   *
   * // Sin subcategoría
   * getImagePath('2-contenedores', 'contenedor-1.jpg')
   * // => 'assets/images/products/2-contenedores/contenedor-1.jpg'
   * ```
   */
  getImagePath(categoryPath: string, imageName: string, subcategoryPath?: string): string {
    if (subcategoryPath) {
      return `${this.basePath}/${categoryPath}/${subcategoryPath}/${imageName}`;
    }
    return `${this.basePath}/${categoryPath}/${imageName}`;
  }

  /**
   * Obtiene todas las categorías
   */
  getCategories(): readonly ProductCategory[] {
    return this.categories();
  }

  /**
   * Busca una categoría por su ID
   *
   * @param categoryId - ID de la categoría
   * @returns La categoría encontrada o undefined
   */
  getCategoryById(categoryId: string): ProductCategory | undefined {
    return this.categories().find((cat) => cat.id === categoryId);
  }

  /**
   * Busca una subcategoría específica
   *
   * @param categoryId - ID de la categoría padre
   * @param subcategoryId - ID de la subcategoría
   * @returns La subcategoría encontrada o undefined
   */
  getSubcategory(categoryId: string, subcategoryId: string) {
    const category = this.getCategoryById(categoryId);
    return category?.subcategories?.find((sub) => sub.id === subcategoryId);
  }

  /**
   * Obtiene todas las imágenes de una categoría (incluyendo subcategorías)
   *
   * @param categoryId - ID de la categoría
   * @returns Array de imágenes
   */
  getCategoryImages(categoryId: string): readonly ProductImage[] {
    const category = this.getCategoryById(categoryId);
    if (!category) return [];

    const images: ProductImage[] = [];

    // Si tiene subcategorías, recopilar todas sus imágenes
    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        images.push(...subcategory.images);
      }
    }
    // Si tiene imágenes directas
    else if (category.images) {
      images.push(...category.images);
    }

    return images;
  }

  /**
   * Obtiene todas las imágenes con sus rutas completas
   *
   * @returns Array de imágenes con propiedad fullPath agregada
   */
  getAllImagesWithPaths(): ReadonlyArray<ProductImage & { fullPath: string }> {
    return this.allImages();
  }
}
