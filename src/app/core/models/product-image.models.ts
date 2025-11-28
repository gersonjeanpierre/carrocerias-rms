/**
 * Modelos de datos para el sistema de imágenes de productos
 * @module ProductImageModels
 */

/**
 * Representa una imagen individual de producto
 */
export interface ProductImage {
  /** Nombre del archivo de imagen (ej: 'vista-frontal.jpg', 'detalle-1.jpg') */
  readonly fileName: string;
  /** Texto alternativo descriptivo para accesibilidad */
  readonly alt: string;
}

/**
 * Especificación técnica de un producto
 */
export interface ProductSpecification {
  /** Nombre de la especificación (ej: 'Capacidad', 'Material', 'Soldadura') */
  readonly label: string;
  /** Valor de la especificación (ej: '10 m³ a 40 m³', 'Acero ASTM A36') */
  readonly value: string;
  /** Categoría de la especificación para agrupar (opcional) */
  readonly category?: string;
}

/**
 * Representa un modelo/producto específico con sus imágenes
 */
export interface ProductModel {
  /** ID único del modelo (ej: 'brazo-de-izaje-1', 'furgon-3') */
  readonly id: string;
  /** Nombre del modelo para mostrar en UI */
  readonly name: string;
  /** Nombre de la carpeta del modelo */
  readonly folderName: string;
  /** Array de imágenes del modelo */
  readonly images: readonly ProductImage[];
}

/**
 * Representa una subcategoría de producto con sus modelos
 */
export interface ProductSubcategory {
  /** Identificador único en formato kebab-case */
  readonly id: string;
  /** Nombre legible para mostrar en UI */
  readonly name: string;
  /** Ruta relativa de la subcategoría */
  readonly path: string;
  /** Descripción de la subcategoría (opcional) */
  readonly description?: string;
  /** Especificaciones técnicas de la subcategoría (opcional) */
  readonly specifications?: readonly ProductSpecification[];
  /** Modelos/productos pertenecientes a esta subcategoría */
  readonly models: readonly ProductModel[];
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
  /** Descripción de la categoría */
  readonly description?: string;
  /** Especificaciones técnicas de la categoría */
  readonly specifications?: readonly ProductSpecification[];
  /** Subcategorías (si aplica) */
  readonly subcategories?: readonly ProductSubcategory[];
  /** Modelos directos (si la categoría no tiene subcategorías) */
  readonly models?: readonly ProductModel[];
}
