import {
  Component,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
  NgZone,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { ProductImagesService } from '@core/services/product-images.service';

interface Proyecto {
  img: string;
  title: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-proyectos',
  imports: [NgOptimizedImage],
  templateUrl: './proyectos.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProyectosComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly productService = inject(ProductImagesService);

  // Mapa de descripciones por categoría
  private readonly categoryDescriptions: Record<string, string> = {
    '1-brazos-de-izaje': 'Sistemas especializados para carga y descarga de contenedores pesados',
    '2-contenedores': 'Soluciones versátiles para transporte de carga general',
    '3-tanques-cisternas-de-vacio':
      'Equipos especializados para transporte de líquidos y residuos industriales',
    '4-semirremolque-plataforma': 'Plataformas robustas para carga sobredimensionada',
    '5-volquete-roquero-semirroquero':
      'Equipos para transporte de materiales de construcción y minería',
    '6-semirremolque-cama-baja-lowboy': 'Soluciones para transporte de maquinaria pesada',
    '10-furgones': 'Unidades cerradas para protección de carga seca',
    '11-baranda': 'Sistemas modulares para transporte de carga general',
    '12-grua-con-contenedor-para-chatarra':
      'Equipos especializados para manejo de materiales reciclables'
  };

  readonly proyectos = computed<Proyecto[]>(() => {
    const categories = this.productService.categories();
    const proyectos: Proyecto[] = [];

    for (const category of categories) {
      // Obtener el primer modelo de la categoría
      let firstModel = null;
      let subcategoryPath: string | undefined = undefined;

      if (category.subcategories && category.subcategories.length > 0) {
        // Buscar en subcategorías
        for (const subcategory of category.subcategories) {
          if (subcategory.models.length > 0) {
            firstModel = subcategory.models[0];
            subcategoryPath = subcategory.path;
            break;
          }
        }
      } else if (category.models && category.models.length > 0) {
        // Modelos directos
        firstModel = category.models[0];
      }

      // Si encontramos un modelo con al menos una imagen
      if (firstModel && firstModel.images.length > 0) {
        const firstImage = firstModel.images[0];
        const imagePath = this.productService.getImagePath(
          category.path,
          firstModel.folderName,
          firstImage.fileName,
          subcategoryPath
        );

        proyectos.push({
          img: imagePath,
          title: firstModel.name,
          category: category.name,
          description:
            this.categoryDescriptions[category.id] || 'Soluciones industriales especializadas'
        });
      }
    }

    return proyectos;
  });

  // Slide continuo y suave
  readonly translateX = signal(0);
  readonly totalProyectos = computed(() => this.proyectos().length);

  // Responsive: número de proyectos visibles según el ancho de pantalla
  readonly visibleProyectos = signal(3); // Default: desktop (lg)

  readonly currentIndex = signal(0);
  readonly totalProducts = computed(() => this.proyectos().length);

  // Responsive: número de productos visibles según el ancho de pantalla
  readonly visibleProducts = signal(4); // Default: desktop (lg)

  // Computed: ancho de desplazamiento en porcentaje
  readonly slideWidth = computed(() => {
    const visible = this.visibleProducts();
    return 100 / visible;
  });

  private intervalId?: number;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateVisibleProyectos();
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }

  onResize(): void {
    this.updateVisibleProyectos();
  }

  private updateVisibleProyectos(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const width = window.innerWidth;

    // Breakpoints de Tailwind:
    // sm: 640px, md: 768px, lg: 1024px
    if (width < 640) {
      this.visibleProyectos.set(1); // Mobile: 1 proyecto
    } else if (width < 1024) {
      this.visibleProyectos.set(2); // Small/Medium: 2 proyectos
    } else {
      this.visibleProyectos.set(3); // Large+: 3 proyectos
    }
  }

  private startAutoScroll(): void {
    this.stopAutoScroll();
    this.intervalId = window.setInterval(() => {
      this.zone.run(() => {
        this.nextSlide();
      });
    }, 1650);
  }

  private stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  // Método público para navegación manual
  nextSlide(): void {
    this.stopAutoScroll(); // Detener auto-scroll al navegar manualmente
    this.currentIndex.update((current) => {
      const itemWidth = this.slideWidth();
      const maxOffset = itemWidth * this.totalProducts();
      const newIndex = current + 1;

      // Reset a 0 cuando alcanzamos el final del primer conjunto (loop infinito)
      if (newIndex * itemWidth >= maxOffset) {
        return 0;
      }

      return newIndex;
    });
  }

  // Método público para navegación manual
  prevSlide(): void {
    this.stopAutoScroll(); // Detener auto-scroll al navegar manualmente
    this.currentIndex.update((current) => {
      const itemWidth = this.slideWidth();
      const maxOffset = itemWidth * this.totalProducts();

      // Si estamos en 0, ir al final del primer conjunto
      if (current === 0) {
        return Math.floor(maxOffset / itemWidth) - 1;
      }

      return current - 1;
    });
  }
}
