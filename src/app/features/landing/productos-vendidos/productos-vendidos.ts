import {
  Component,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

interface Product {
  img: string;
  title: string;
  category: string;
}

@Component({
  selector: 'app-productos-vendidos',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './productos-vendidos.html',
  styleUrls: ['./productos-vendidos.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()',
  },
})
export class ProductosVendidosComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  readonly products = signal<Product[]>([
    // Brazo de Izaje (2 imágenes)
    {
      img: '/watermark/watermark-brazo-izaje/bzi-1.jpg',
      title: 'Brazo de Izaje',
      category: 'Carga Pesada',
    },
    {
      img: '/watermark/watermark-brazo-izaje/bzi-2.jpg',
      title: 'Brazo de Izaje',
      category: 'Carga Pesada',
    },

    // Cama Baja (2 imágenes)
    {
      img: '/watermark/watermark-cama-baja/cb-1.jpg',
      title: 'Cama Baja',
      category: 'Transporte Especializado',
    },
    {
      img: '/watermark/watermark-cama-baja/cb-2.jpg',
      title: 'Cama Baja',
      category: 'Transporte Especializado',
    },

    // Cisterna Vacío (2 imágenes)
    {
      img: '/watermark/watermark-cisterna-vacio/cv-1.jpg',
      title: 'Cisterna Vacío',
      category: 'Transporte de Líquidos',
    },
    {
      img: '/watermark/watermark-cisterna-vacio/cv-2.jpg',
      title: 'Cisterna Vacío',
      category: 'Transporte de Líquidos',
    },

    // Contenedores (2 imágenes)
    {
      img: '/watermark/watermark-contenedores/cont-1.jpg',
      title: 'Contenedores',
      category: 'Carga General',
    },
    {
      img: '/watermark/watermark-contenedores/cont-2.jpg',
      title: 'Contenedores',
      category: 'Carga General',
    },

    // Furgón (2 imágenes)
    { img: '/watermark/watermark-furgon/furg-1.jpg', title: 'Furgón', category: 'Carga Seca' },
    { img: '/watermark/watermark-furgon/furg-2.jpg', title: 'Furgón', category: 'Carga Seca' },

    // Grúa Contenedor Chatarra (2 imágenes)
    {
      img: '/watermark/watermark-grua-contenedor-chatarra/gcc-1.jpg',
      title: 'Grúa Contenedor',
      category: 'Manejo de Chatarra',
    },
    {
      img: '/watermark/watermark-grua-contenedor-chatarra/gcc-2.jpg',
      title: 'Grúa Contenedor',
      category: 'Manejo de Chatarra',
    },

    // Roquera Semirroquera (2 imágenes)
    {
      img: '/watermark/watermark-roquera-semirroquera/roq-1.jpg',
      title: 'Roquera',
      category: 'Materiales de Construcción',
    },
    {
      img: '/watermark/watermark-roquera-semirroquera/roq-2.jpg',
      title: 'Roquera',
      category: 'Materiales de Construcción',
    },

    // Semirremolque Plataforma (2 imágenes)
    {
      img: '/watermark/watermark-semirremolque-plataforma/sp-1.jpg',
      title: 'Semirremolque Plataforma',
      category: 'Carga Plana',
    },
    {
      img: '/watermark/watermark-semirremolque-plataforma/sp-2.jpg',
      title: 'Semirremolque Plataforma',
      category: 'Carga Plana',
    },
  ]);

  readonly currentIndex = signal(0);
  readonly totalProducts = computed(() => this.products().length);

  // Responsive: número de productos visibles según el ancho de pantalla
  readonly visibleProducts = signal(4); // Default: desktop (lg)

  // Computed: máximo índice basado en productos visibles
  readonly maxIndex = computed(() => Math.max(0, this.totalProducts() - this.visibleProducts()));

  // Computed: ancho de desplazamiento en porcentaje
  readonly slideWidth = computed(() => {
    const visible = this.visibleProducts();
    return 100 / visible;
  });

  private intervalId?: number;

  ngOnInit(): void {
    this.updateVisibleProducts();
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  onResize(): void {
    this.updateVisibleProducts();
  }

  private updateVisibleProducts(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const width = window.innerWidth;

    // Breakpoints de Tailwind:
    // sm: 640px, md: 768px, lg: 1024px
    if (width < 640) {
      this.visibleProducts.set(1); // Mobile: 1 producto
    } else if (width < 768) {
      this.visibleProducts.set(2); // Small: 2 productos
    } else if (width < 1024) {
      this.visibleProducts.set(2); // Medium: 2 productos
    } else {
      this.visibleProducts.set(4); // Large+: 4 productos
    }

    // Resetear índice si excede el máximo
    if (this.currentIndex() > this.maxIndex()) {
      this.currentIndex.set(0);
    }
  }

  private startAutoScroll(): void {
    this.intervalId = window.setInterval(() => {
      this.zone.run(() => {
        this.nextSlide();
      });
    }, 3000);
  }

  private stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private nextSlide(): void {
    this.currentIndex.update((current) => {
      const max = this.maxIndex();
      return current >= max ? 0 : current + 1;
    });
  }
}
