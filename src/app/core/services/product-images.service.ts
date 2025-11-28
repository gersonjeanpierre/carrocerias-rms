import { Injectable, signal, computed } from '@angular/core';
import type {
  ProductCategory,
  ProductModel,
  ProductSubcategory,
  ProductSpecification
} from '../models/product-image.models';

/**
 * Servicio centralizado para gestionar productos y sus imágenes
 *
 * Nueva estructura:
 * - Cada MODELO es un producto (ej: brazo-de-izaje-1, furgon-3)
 * - Cada modelo puede tener MÚLTIPLES imágenes
 * - Ruta física: /category/[subcategory]/model-folder/image.webp
 *
 * @example
 * ```typescript
 * export class ProductList {
 *   private readonly productService = inject(ProductImagesService);
 *
 *   readonly categories = this.productService.allCategories;
 *   readonly allModels = this.productService.getAllModels();
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ProductImagesService {
  private readonly basePath = '/images/products';

  /**
   * Catálogo completo de productos organizados por categorías
   */
  readonly categories = signal<readonly ProductCategory[]>([
    // 1. Brazos de Izaje (con subcategorías y modelos)
    {
      id: '1-brazos-de-izaje',
      name: 'Brazos de Izaje',
      path: '1-brazos-de-izaje',
      description:
        'Dispositivos mecánicos para la carga y descarga de contenedores y otros equipos, adaptables a diferentes chasis. Disponibles en versiones para carga pesada, intermedia y liviana.',
      subcategories: [
        {
          id: 'brazo-de-izaje-carga-pesada-14-20tn',
          name: 'Brazo de Izaje Carga Pesada (14-20tn)',
          path: 'brazo-de-izaje-carga-pesada-14-20tn',
          description:
            'Brazos de izaje diseñados para operaciones de carga pesada con capacidad de 14 a 20 toneladas.',
          specifications: [
            { label: 'Capacidad', value: '14 - 20 TN' },
            { label: 'Material', value: 'Acero de alta resistencia y alto límite elástico' },
            { label: 'Componentes', value: 'Fundición en zonas de gran esfuerzo' },
            { label: 'Fijación', value: 'Piezas para diferentes tipos de chasis' },
            { label: 'Bloqueo', value: 'Hidráulico posterior' },
            { label: 'Adaptabilidad de Contenedor', value: '3700 mm - 6800 mm' },
            { label: 'Sistema', value: 'Rodillo Posterior, Sistema hidráulico' }
          ],
          models: [
            {
              id: 'brazo-de-izaje-1',
              name: 'Brazo de Izaje Modelo 1',
              folderName: 'brazo-de-izaje-1',
              images: [
                { fileName: 'brazo-de-izaje-1.webp', alt: 'Brazo de Izaje 1 - Vista Principal' }
              ]
            },
            {
              id: 'brazo-de-izaje-2',
              name: 'Brazo de Izaje Modelo 2',
              folderName: 'brazo-de-izaje-2',
              images: [
                { fileName: 'brazo-de-izaje-2.webp', alt: 'Brazo de Izaje 2 - Vista Principal' }
              ]
            },
            {
              id: 'brazo-de-izaje-3',
              name: 'Brazo de Izaje Modelo 3',
              folderName: 'brazo-de-izaje-3',
              images: [
                { fileName: 'brazo-de-izaje-3.webp', alt: 'Brazo de Izaje 3 - Vista Principal' }
              ]
            },
            {
              id: 'brazo-de-izaje-4',
              name: 'Brazo de Izaje Modelo 4',
              folderName: 'brazo-de-izaje-4',
              images: [
                { fileName: 'brazo-de-izaje-4.webp', alt: 'Brazo de Izaje 4 - Vista Principal' }
              ]
            },
            {
              id: 'brazo-de-izaje-5',
              name: 'Brazo de Izaje Modelo 5',
              folderName: 'brazo-de-izaje-5',
              images: [
                { fileName: 'brazo-de-izaje-5.webp', alt: 'Brazo de Izaje 5 - Vista Principal' }
              ]
            },
            {
              id: 'brazo-de-izaje-6',
              name: 'Brazo de Izaje Modelo 6',
              folderName: 'brazo-de-izaje-6',
              images: [
                { fileName: 'brazo-de-izaje-6.webp', alt: 'Brazo de Izaje 6 - Vista Principal' }
              ]
            }
          ]
        },
        {
          id: 'brazo-de-izaje-carga-intermedia-7-12tn',
          name: 'Brazo de Izaje Carga Intermedia (7-12tn)',
          path: 'brazo-de-izaje-carga-intermedia-7-12tn',
          description:
            'Brazos de izaje para operaciones de carga intermedia con capacidad de 7 a 12 toneladas.',
          specifications: [
            { label: 'Capacidad', value: '7 - 12 TN' },
            { label: 'Material', value: 'Acero de alta resistencia y alto límite elástico' },
            { label: 'Componentes', value: 'Fundición en zonas de gran esfuerzo' },
            { label: 'Fijación', value: 'Piezas para diferentes tipos de chasis' },
            { label: 'Bloqueo', value: 'Hidráulico posterior' },
            { label: 'Adaptabilidad de Contenedor', value: '2700 mm - 5800 mm' },
            { label: 'Sistema', value: 'Rodillo Posterior, Sistema hidráulico' }
          ],
          models: []
        },
        {
          id: 'brazo-de-izaje-carga-liviana-3-5tn',
          name: 'Brazo de Izaje Carga Liviana (3-5tn)',
          path: 'brazo-de-izaje-carga-liviana-3-5tn',
          description:
            'Brazos de izaje articulados para operaciones livianas en entornos urbanos con capacidad de 3 a 5 toneladas.',
          specifications: [
            { label: 'Capacidad', value: '3 - 5 TN' },
            { label: 'Aplicación', value: 'Entornos urbanos' },
            { label: 'Seguridad', value: 'Integrada para limitar movimientos incorrectos' },
            { label: 'Material', value: 'Acero de alta resistencia' },
            { label: 'Peso', value: 'Optimizado para máxima carga útil' },
            { label: 'Fijación', value: 'Piezas para diferentes tipos de chasis' },
            { label: 'Altura de Gancho', value: '920 mm - 1570 mm' },
            { label: 'Adaptabilidad de Contenedor', value: '2300 mm - 4900 mm' },
            { label: 'Sistema', value: 'Rodillo Posterior, Sistema hidráulico' }
          ],
          models: []
        }
      ]
    },

    // 2. Contenedores (modelos directos)
    {
      id: '2-contenedores',
      name: 'Contenedores',
      path: '2-contenedores',
      description:
        'Fabricados en planchas de acero de alta resistencia para reducir peso y aumentar carga útil. Modelos herméticos disponibles para lodos.',
      specifications: [
        { label: 'Capacidad', value: '10 m³ a 40 m³' },
        { label: 'Soldadura', value: 'AWS D1.1 GMAW' },
        {
          label: 'Puertas',
          value: 'Traseras de doble hoja, bisagras soldadas y puntos de lubricación'
        },
        { label: 'Movilidad', value: 'Rodillos metálicos con lubricación interna' },
        { label: 'Acceso', value: 'Escalera lateral y/o frontal' }
      ],
      models: [
        {
          id: 'contenedor-1',
          name: 'Contenedor Modelo 1',
          folderName: 'contenedor-1',
          images: [{ fileName: 'contenedor-1.webp', alt: 'Contenedor 1 - Vista Principal' }]
        },
        {
          id: 'contenedor-2',
          name: 'Contenedor Modelo 2',
          folderName: 'contenedor-2',
          images: [{ fileName: 'contenedor-2.webp', alt: 'Contenedor 2 - Vista Principal' }]
        },
        {
          id: 'contenedor-3',
          name: 'Contenedor Modelo 3',
          folderName: 'contenedor-3',
          images: [{ fileName: 'contenedor-3.webp', alt: 'Contenedor 3 - Vista Principal' }]
        },
        {
          id: 'contenedor-4',
          name: 'Contenedor Modelo 4',
          folderName: 'contenedor-4',
          images: [{ fileName: 'contenedor-4.webp', alt: 'Contenedor 4 - Vista Principal' }]
        },
        {
          id: 'contenedor-5',
          name: 'Contenedor Modelo 5',
          folderName: 'contenedor-5',
          images: [{ fileName: 'contenedor-5.webp', alt: 'Contenedor 5 - Vista Principal' }]
        }
      ]
    },

    // 3. Tanques Cisternas de Vacío
    {
      id: '3-tanques-cisternas-de-vacio',
      name: 'Tanques Cisternas de Vacío',
      path: '3-tanques-cisternas-de-vacio',
      description:
        'Adaptados para transporte y succión de residuos líquidos, lodos, grasas, arenas y aguas residuales.',
      specifications: [
        { label: 'Compactos', value: '0.5 m³, 1 m³, 2 m³' },
        { label: 'Medianos', value: '3 m³ a 10 m³' },
        { label: 'Industriales', value: '12 m³, 15 m³, 20 m³, hasta 30 m³' },
        { label: 'Bomba', value: 'Bomba de vacío italiana' }
      ],
      models: [
        {
          id: 'cisterna-de-vacio-1',
          name: 'Cisterna de Vacío Modelo 1',
          folderName: 'cisterna-de-vacio-1',
          images: [
            { fileName: 'cisterna-de-vacio-1.webp', alt: 'Cisterna de Vacío 1 - Vista Principal' }
          ]
        },
        {
          id: 'cisterna-de-vacio-2',
          name: 'Cisterna de Vacío Modelo 2',
          folderName: 'cisterna-de-vacio-2',
          images: [
            { fileName: 'cisterna-de-vacio-2.webp', alt: 'Cisterna de Vacío 2 - Vista Principal' }
          ]
        },
        {
          id: 'cisterna-de-vacio-3',
          name: 'Cisterna de Vacío Modelo 3',
          folderName: 'cisterna-de-vacio-3',
          images: [
            { fileName: 'cisterna-de-vacio-3.webp', alt: 'Cisterna de Vacío 3 - Vista Principal' }
          ]
        },
        {
          id: 'cisterna-de-vacio-4',
          name: 'Cisterna de Vacío Modelo 4',
          folderName: 'cisterna-de-vacio-4',
          images: [
            { fileName: 'cisterna-de-vacio-4.webp', alt: 'Cisterna de Vacío 4 - Vista Principal' }
          ]
        },
        {
          id: 'cisterna-de-vacio-5',
          name: 'Cisterna de Vacío Modelo 5',
          folderName: 'cisterna-de-vacio-5',
          images: [
            { fileName: 'cisterna-de-vacio-5.webp', alt: 'Cisterna de Vacío 5 - Vista Principal' }
          ]
        },
        {
          id: 'cisterna-de-vacio-6',
          name: 'Cisterna de Vacío Modelo 6',
          folderName: 'cisterna-de-vacio-6',
          images: [
            { fileName: 'cisterna-de-vacio-6.webp', alt: 'Cisterna de Vacío 6 - Vista Principal' }
          ]
        },
        {
          id: 'cisterna-de-vacio-7',
          name: 'Cisterna de Vacío Modelo 7',
          folderName: 'cisterna-de-vacio-7',
          images: [
            { fileName: 'cisterna-de-vacio-7.webp', alt: 'Cisterna de Vacío 7 - Vista Principal' }
          ]
        }
      ]
    },

    // 4. Semirremolque Plataforma
    {
      id: '4-semirremolque-plataforma',
      name: 'Semirremolque Plataforma',
      path: '4-semirremolque-plataforma',
      description:
        'Plataforma recta o extendible para transporte de carga general, contenedores y maquinaria pesada.',
      specifications: [
        { label: 'Largo', value: 'Hasta 14.5 m' },
        { label: 'Capacidad', value: '40 TN' },
        { label: 'Material', value: 'Acero estructural ASTM A36 / ASTM A-572 Grado 50' }
      ],
      models: [
        {
          id: 'semirremolque-plataforma-1',
          name: 'Semirremolque Plataforma Modelo 1',
          folderName: 'semirremolque-plataforma-1',
          images: [
            {
              fileName: 'semirremolque-plataforma-1.webp',
              alt: 'Semirremolque Plataforma 1 - Vista Principal'
            }
          ]
        },
        {
          id: 'semirremolque-plataforma-2',
          name: 'Semirremolque Plataforma Modelo 2',
          folderName: 'semirremolque-plataforma-2',
          images: [
            {
              fileName: 'semirremolque-plataforma-2.webp',
              alt: 'Semirremolque Plataforma 2 - Vista Principal'
            }
          ]
        },
        {
          id: 'semirremolque-plataforma-3',
          name: 'Semirremolque Plataforma Modelo 3',
          folderName: 'semirremolque-plataforma-3',
          images: [
            {
              fileName: 'semirremolque-plataforma-3.webp',
              alt: 'Semirremolque Plataforma 3 - Vista Principal'
            }
          ]
        },
        {
          id: 'semirremolque-plataforma-4',
          name: 'Semirremolque Plataforma Modelo 4',
          folderName: 'semirremolque-plataforma-4',
          images: [
            {
              fileName: 'semirremolque-plataforma-4.webp',
              alt: 'Semirremolque Plataforma 4 - Vista Principal'
            }
          ]
        },
        {
          id: 'semirremolque-plataforma-5',
          name: 'Semirremolque Plataforma Modelo 5',
          folderName: 'semirremolque-plataforma-5',
          images: [
            {
              fileName: 'semirremolque-plataforma-5.webp',
              alt: 'Semirremolque Plataforma 5 - Vista Principal'
            }
          ]
        }
      ]
    },

    // 5. Volquete Roquero/Semirroquero
    {
      id: '5-volquete-roquero-semirroquero',
      name: 'Volquete Roquero/Semirroquero',
      path: '5-volquete-roquero-semirroquero',
      description:
        'Fabricados en acero de alta resistencia para reducir peso y aumentar carga útil. Tipos constructora, roquera o semirroquera.',
      specifications: [
        { label: 'Capacidad', value: '15 m³ a 26 m³' },
        { label: 'Compuertas', value: 'Batiente, basculante, doble hoja, hidráulica' },
        { label: 'Cajón', value: 'Rectangular o half-round' },
        { label: 'Intercambiabilidad', value: 'Compatible con diferentes tracto camiones' },
        { label: 'Tratamiento superficial', value: 'Arenado SSPC-SP6' },
        { label: 'Acabado', value: 'Pintura epóxica' },
        { label: 'Sistema', value: 'Sistema hidráulico importado' },
        { label: 'Certificado', value: 'Certificado estructural (opcional)' }
      ],
      models: [
        {
          id: 'roquera-1',
          name: 'Volquete Roquero Modelo 1',
          folderName: 'roquera-1',
          images: [{ fileName: 'roquera-1.webp', alt: 'Volquete Roquero 1 - Vista Principal' }]
        },
        {
          id: 'roquera-2',
          name: 'Volquete Roquero Modelo 2',
          folderName: 'roquera-2',
          images: [{ fileName: 'roquera-2.webp', alt: 'Volquete Roquero 2 - Vista Principal' }]
        },
        {
          id: 'semirroquera-1',
          name: 'Volquete Semirroquero Modelo 1',
          folderName: 'semirroquera-1',
          images: [
            { fileName: 'semirroquera-1.webp', alt: 'Volquete Semirroquero 1 - Vista Principal' }
          ]
        },
        {
          id: 'semirroquera-2',
          name: 'Volquete Semirroquero Modelo 2',
          folderName: 'semirroquera-2',
          images: [
            { fileName: 'semirroquera-2.webp', alt: 'Volquete Semirroquero 2 - Vista Principal' }
          ]
        }
      ]
    },

    // 6. Semirremolque Cama Baja (Lowboy)
    {
      id: '6-semirremolque-cama-baja-lowboy',
      name: 'Semirremolque Cama Baja (Lowboy)',
      path: '6-semirremolque-cama-baja-lowboy',
      description: 'Diseñados para transporte de cargas diversas hasta 60 TN.',
      specifications: [
        { label: 'Chasis', value: 'Acero estructural ASTM A-572 Grado 50 / ASTM A36' },
        { label: 'Largo', value: 'Hasta 14.5 m' },
        { label: 'Piso', value: 'Plancha estriada o madera' },
        { label: 'Suspensión', value: 'Mecánica multibrazo o neumática' },
        {
          label: 'Frenos',
          value: 'Neumáticos, válvula de relevo rápido, cámara de freno con resorte de emergencia'
        },
        { label: 'Kingpin', value: '2" estándar o 3.5" opcional' },
        { label: 'Iluminación', value: 'LED' },
        { label: 'Certificado', value: 'Certificado minero/vial (opcional)' }
      ],
      models: [
        {
          id: 'cama-baja-1',
          name: 'Semirremolque Cama Baja Modelo 1',
          folderName: 'cama-baja-1',
          images: [{ fileName: 'cama-baja-1.webp', alt: 'Cama Baja 1 - Vista Principal' }]
        },
        {
          id: 'cama-baja-5',
          name: 'Semirremolque Cama Baja Modelo 5',
          folderName: 'cama-baja-5',
          images: [{ fileName: 'cama-baja-5.webp', alt: 'Cama Baja 5 - Vista Principal' }]
        },
        {
          id: 'cama-baja-6',
          name: 'Semirremolque Cama Baja Modelo 6',
          folderName: 'cama-baja-6',
          images: [{ fileName: 'cama-baja-6.webp', alt: 'Cama Baja 6 - Vista Principal' }]
        }
      ]
    },

    // 7-9. Categorías sin modelos aún
    {
      id: '7-semirremolque-volquete',
      name: 'Semirremolque Volquete',
      path: '7-semirremolque-volquete',
      description: 'Tolva semirroquera con descarga trasera y sistema hidráulico importado.',
      specifications: [
        { label: 'Volumen útil', value: '25 m³ / 30 m³ / 35 m³' },
        { label: 'Carga útil', value: 'Hasta 35 TN' },
        { label: 'Material de piso', value: 'Acero antidesgaste HARDOX 450' },
        { label: 'Laterales', value: 'Acero estructural ASTM A-572 Grado 50' },
        { label: 'Descarga', value: 'Actuador hidráulico telescópico 4-5 etapas, ángulo 45°' },
        { label: 'Puerta trasera', value: 'Basculante, apertura automática o manual' },
        { label: 'Certificado', value: 'Certificado minero/vial (opcional)' }
      ],
      models: []
    },
    {
      id: '8-semirremolque-cisterna',
      name: 'Semirremolque Cisterna',
      path: '8-semirremolque-cisterna',
      description:
        'Para agua, combustible y otros líquidos, cumpliendo normativa técnica nacional.',
      specifications: [
        { label: 'Capacidad agua', value: 'Hasta 10500 GL' },
        { label: 'Combustible', value: 'Certificado de hermeticidad y cubicaje, válvula API' },
        { label: 'Soldadura', value: 'AWS D1.1 GMAW' }
      ],
      models: []
    },
    {
      id: '9-cisterna',
      name: 'Cisterna',
      path: '9-cisterna',
      description: 'Para agua y combustible, diseño según norma MTC y OSINERGMIN.',
      specifications: [
        { label: 'Agua', value: '1000 GL – 8000 GL' },
        { label: 'Combustible', value: 'Sistema de despacho simple, dual y triple' },
        { label: 'Certificado', value: 'Certificado de hermeticidad y cubicaje' }
      ],
      models: []
    },

    // 10. Furgones
    {
      id: '10-furgones',
      name: 'Furgones',
      path: '10-furgones',
      description: 'Estructura reforzada y hermética, para transporte seguro de mercancías.',
      specifications: [
        { label: 'Soldadura', value: 'AWS D1.1 GMAW' },
        { label: 'Tratamiento superficial', value: 'Arenado SSPC-SP6' },
        { label: 'Acabado', value: 'Pintura epóxica' },
        { label: 'Iluminación', value: 'LED' },
        { label: 'Forro', value: 'Techo y laterales en acero galvanizado' }
      ],
      models: [
        {
          id: 'furgon-1',
          name: 'Furgón Modelo 1',
          folderName: 'furgon-1',
          images: [{ fileName: 'furgon-1.webp', alt: 'Furgón 1 - Vista Principal' }]
        },
        {
          id: 'furgon-3',
          name: 'Furgón Modelo 3',
          folderName: 'furgon-3',
          images: [{ fileName: 'furgon-3.webp', alt: 'Furgón 3 - Vista Principal' }]
        },
        {
          id: 'furgon-4',
          name: 'Furgón Modelo 4',
          folderName: 'furgon-4',
          images: [{ fileName: 'furgon-4.webp', alt: 'Furgón 4 - Vista Principal' }]
        },
        {
          id: 'furgon-5',
          name: 'Furgón Modelo 5',
          folderName: 'furgon-5',
          images: [{ fileName: 'furgon-5.webp', alt: 'Furgón 5 - Vista Principal' }]
        },
        {
          id: 'furgon-7',
          name: 'Furgón Modelo 7',
          folderName: 'furgon-7',
          images: [{ fileName: 'furgon-7.webp', alt: 'Furgón 7 - Vista Principal' }]
        },
        {
          id: 'furgon-8',
          name: 'Furgón Modelo 8',
          folderName: 'furgon-8',
          images: [{ fileName: 'furgon-8.webp', alt: 'Furgón 8 - Vista Principal' }]
        },
        {
          id: 'furgon-9',
          name: 'Furgón Modelo 9',
          folderName: 'furgon-9',
          images: [{ fileName: 'furgon-9.webp', alt: 'Furgón 9 - Vista Principal' }]
        },
        {
          id: 'furgon-10',
          name: 'Furgón Modelo 10',
          folderName: 'furgon-10',
          images: [{ fileName: 'furgon-10.webp', alt: 'Furgón 10 - Vista Principal' }]
        },
        {
          id: 'furgon-11',
          name: 'Furgón Modelo 11',
          folderName: 'furgon-11',
          images: [{ fileName: 'furgon-11.webp', alt: 'Furgón 11 - Vista Principal' }]
        },
        {
          id: 'furgon-12',
          name: 'Furgón Modelo 12',
          folderName: 'furgon-12',
          images: [{ fileName: 'furgon-12.webp', alt: 'Furgón 12 - Vista Principal' }]
        },
        {
          id: 'furgon-13',
          name: 'Furgón Modelo 13',
          folderName: 'furgon-13',
          images: [{ fileName: 'furgon-13.webp', alt: 'Furgón 13 - Vista Principal' }]
        },
        {
          id: 'furgon-14',
          name: 'Furgón Modelo 14',
          folderName: 'furgon-14',
          images: [{ fileName: 'furgon-14.webp', alt: 'Furgón 14 - Vista Principal' }]
        },
        {
          id: 'furgon-15',
          name: 'Furgón Modelo 15',
          folderName: 'furgon-15',
          images: [{ fileName: 'furgon-15.webp', alt: 'Furgón 15 - Vista Principal' }]
        }
      ]
    },

    // 11. Baranda (con subcategorías)
    {
      id: '11-baranda',
      name: 'Baranda',
      path: '11-baranda',
      description:
        'Configuración según necesidad de carga, con paneles removibles y pórticos opcionales.',
      specifications: [
        { label: 'Piso', value: 'Plancha estriada' },
        { label: 'Acabado', value: 'Pintura epóxica' },
        { label: 'Estructura', value: 'Puentes estabilizadores' },
        { label: 'Capacidades', value: '6 a 30 TN' },
        { label: 'Barandas', value: 'Puertas abatibles, paneles removibles' },
        { label: 'Garantía', value: '12 meses' }
      ],
      subcategories: [
        {
          id: '1-baranda-telera',
          name: 'Baranda Telera',
          path: '1-baranda-telera',
          models: []
        },
        {
          id: '2-baranda-rebatible',
          name: 'Baranda Rebatible',
          path: '2-baranda-rebatible',
          models: [
            {
              id: 'rebatible-1',
              name: 'Baranda Rebatible Modelo 1',
              folderName: 'rebatible-1',
              images: [
                { fileName: 'rebatible-1.webp', alt: 'Baranda Rebatible 1 - Vista Principal' }
              ]
            },
            {
              id: 'rebatible-2',
              name: 'Baranda Rebatible Modelo 2',
              folderName: 'rebatible-2',
              images: [
                { fileName: 'rebatible-2.webp', alt: 'Baranda Rebatible 2 - Vista Principal' }
              ]
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
      description:
        'Grúa para chatarra metálica con brazo hidráulico extensible y contenedor, garra hidráulica para chatarra.',
      specifications: [
        { label: 'Grúa - Carga útil', value: '11 TN' },
        { label: 'Grúa - Presión de trabajo', value: '250 bar' },
        { label: 'Grúa - Giro', value: 'Infinito' },
        { label: 'Grúa - Control', value: '2 joysticks electrónicos' },
        { label: 'Garra - Capacidad', value: '0.5 m³ a 1 m³' },
        { label: 'Garra - Presión máxima', value: '270 bar' }
      ],
      models: [
        {
          id: 'grua-con-contenedor-para-chatarra-1',
          name: 'Grúa con Contenedor Modelo 1',
          folderName: 'grua-con-contenedor-para-chatarra-1',
          images: [
            {
              fileName: 'grua-con-contenedor-para-chatarra-1.webp',
              alt: 'Grúa con Contenedor 1 - Vista Principal'
            }
          ]
        },
        {
          id: 'grua-con-contenedor-para-chatarra-2',
          name: 'Grúa con Contenedor Modelo 2',
          folderName: 'grua-con-contenedor-para-chatarra-2',
          images: [
            {
              fileName: 'grua-con-contenedor-para-chatarra-2.webp',
              alt: 'Grúa con Contenedor 2 - Vista Principal'
            }
          ]
        },
        {
          id: 'grua-con-contenedor-para-chatarra-3',
          name: 'Grúa con Contenedor Modelo 3',
          folderName: 'grua-con-contenedor-para-chatarra-3',
          images: [
            {
              fileName: 'grua-con-contenedor-para-chatarra-3.webp',
              alt: 'Grúa con Contenedor 3 - Vista Principal'
            }
          ]
        },
        {
          id: 'grua-con-contenedor-para-chatarra-4',
          name: 'Grúa con Contenedor Modelo 4',
          folderName: 'grua-con-contenedor-para-chatarra-4',
          images: [
            {
              fileName: 'grua-con-contenedor-para-chatarra-4.webp',
              alt: 'Grúa con Contenedor 4 - Vista Principal'
            }
          ]
        },
        {
          id: 'grua-con-contenedor-para-chatarra-5',
          name: 'Grúa con Contenedor Modelo 5',
          folderName: 'grua-con-contenedor-para-chatarra-5',
          images: [
            {
              fileName: 'grua-con-contenedor-para-chatarra-5.webp',
              alt: 'Grúa con Contenedor 5 - Vista Principal'
            }
          ]
        }
      ]
    }
  ]);

  /**
   * Signal computado con todas las categorías
   */
  readonly allCategories = computed(() => this.categories());

  /**
   * Construye la ruta completa de una imagen
   *
   * @param categoryPath - Ruta de la categoría
   * @param modelFolderName - Nombre de la carpeta del modelo
   * @param imageFileName - Nombre del archivo de imagen
   * @param subcategoryPath - Ruta de la subcategoría (opcional)
   * @returns Ruta completa desde /images/products
   *
   * @example
   * ```typescript
   * // Con subcategoría
   * getImagePath('1-brazos-de-izaje', 'brazo-de-izaje-1', 'vista-frontal.webp', 'brazo-de-izaje-carga-pesada-14-20tn')
   * // => '/images/products/1-brazos-de-izaje/brazo-de-izaje-carga-pesada-14-20tn/brazo-de-izaje-1/vista-frontal.webp'
   *
   * // Sin subcategoría
   * getImagePath('10-furgones', 'furgon-1', 'furgon-1.webp')
   * // => '/images/products/10-furgones/furgon-1/furgon-1.webp'
   * ```
   */
  getImagePath(
    categoryPath: string,
    modelFolderName: string,
    imageFileName: string,
    subcategoryPath?: string
  ): string {
    if (subcategoryPath) {
      return `${this.basePath}/${categoryPath}/${subcategoryPath}/${modelFolderName}/${imageFileName}`;
    }
    return `${this.basePath}/${categoryPath}/${modelFolderName}/${imageFileName}`;
  }

  /**
   * Obtiene todas las categorías
   */
  getCategories(): readonly ProductCategory[] {
    return this.categories();
  }

  /**
   * Busca una categoría por su ID
   */
  getCategoryById(categoryId: string): ProductCategory | undefined {
    return this.categories().find((cat) => cat.id === categoryId);
  }

  /**
   * Busca una subcategoría específica
   */
  getSubcategory(categoryId: string, subcategoryId: string): ProductSubcategory | undefined {
    const category = this.getCategoryById(categoryId);
    return category?.subcategories?.find((sub) => sub.id === subcategoryId);
  }

  /**
   * Busca un modelo específico por ID
   */
  getModelById(modelId: string): ProductModel | null {
    for (const category of this.categories()) {
      // Buscar en subcategorías
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          const model = subcategory.models.find((m) => m.id === modelId);
          if (model) return model;
        }
      }
      // Buscar en modelos directos
      else if (category.models) {
        const model = category.models.find((m) => m.id === modelId);
        if (model) return model;
      }
    }
    return null;
  }

  /**
   * Obtiene todos los modelos de todas las categorías
   */
  getAllModels(): ProductModel[] {
    const models: ProductModel[] = [];

    for (const category of this.categories()) {
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          models.push(...subcategory.models);
        }
      } else if (category.models) {
        models.push(...category.models);
      }
    }

    return models;
  }

  /**
   * Obtiene todos los modelos de una categoría (incluyendo subcategorías)
   */
  getCategoryModels(categoryId: string): ProductModel[] {
    const category = this.getCategoryById(categoryId);
    if (!category) return [];

    const models: ProductModel[] = [];

    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        models.push(...subcategory.models);
      }
    } else if (category.models) {
      models.push(...category.models);
    }

    return models;
  }
}
