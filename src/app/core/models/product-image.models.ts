/**
 * Modelos de datos para el sistema de imágenes de productos
 * @module ProductImageModels
 */

/**
 * Representa una imagen individual de producto
 */
export interface ProductImage {
  /** Nombre del archivo de imagen (ej: 'brazo-de-izaje-1.jpg') */
  readonly path: string;
  /** Texto alternativo descriptivo para accesibilidad */
  readonly alt: string;
  /** ID de la categoría a la que pertenece */
  readonly categoryId: string;
  /** ID de la subcategoría (opcional, solo si la categoría tiene subcategorías) */
  readonly subcategoryId?: string;
}

/**
 * Representa una subcategoría de producto
 */
export interface ProductSubcategory {
  /** Identificador único en formato kebab-case */
  readonly id: string;
  /** Nombre legible para mostrar en UI */
  readonly name: string;
  /** Ruta relativa de la subcategoría */
  readonly path: string;
  /** Imágenes pertenecientes a esta subcategoría */
  readonly images: readonly ProductImage[];
}

/**
 * Representa una categoría principal de producto
 */
export interface ProductCategory {
  /** Identificador único en formato kebab-case (ej: '1-brazos-de-izaje') */
  readonly id: string;
  /** Nombre legible para mostrar en UI */
  readonly name: string;
  /** Ruta relativa de la categoría */
  readonly path: string;
  /** Subcategorías (si aplica) */
  readonly subcategories?: readonly ProductSubcategory[];
  /** Imágenes directas (si la categoría no tiene subcategorías) */
  readonly images?: readonly ProductImage[];
}
