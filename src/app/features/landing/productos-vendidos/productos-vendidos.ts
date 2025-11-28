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

interface Product {
  img: string;
  title: string;
  category: string;
}

@Component({
  selector: 'app-productos-vendidos',
  imports: [NgOptimizedImage],
  templateUrl: './productos-vendidos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class ProductosVendidosComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly productService = inject(ProductImagesService);

  readonly products = computed<Product[]>(() => {
    const allCategories = this.productService.categories();
    const products: Product[] = [];

    // Para cada categoría, tomar el primer modelo con su primera imagen
    for (const category of allCategories) {
      if (category.subcategories) {
        // Categoría con subcategorías: tomar primer modelo de primera subcategoría
        const firstSubcategory = category.subcategories[0];
        if (firstSubcategory && firstSubcategory.models.length > 0) {
          const firstModel = firstSubcategory.models[0];
          const firstImage = firstModel.images[0];

          if (firstImage) {
            const imagePath = this.productService.getImagePath(
              category.path,
              firstModel.folderName,
              firstImage.fileName,
              firstSubcategory.path
            );

            products.push({
              img: imagePath,
              title: category.name,
              category: category.name
            });
          }
        }
      } else if (category.models && category.models.length > 0) {
        // Categoría sin subcategorías: tomar primer modelo
        const firstModel = category.models[0];
        const firstImage = firstModel.images[0];

        if (firstImage) {
          const imagePath = this.productService.getImagePath(
            category.path,
            firstModel.folderName,
            firstImage.fileName
          );

          products.push({
            img: imagePath,
            title: category.name,
            category: category.name
          });
        }
      }
    }

    return products;
  });

  readonly currentIndex = signal(0);
  readonly totalProducts = computed(() => this.products().length);

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
      this.updateVisibleProducts();
      this.startAutoScroll();
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
  }

  private startAutoScroll(): void {
    this.stopAutoScroll();
    this.intervalId = window.setInterval(() => {
      this.zone.run(() => {
        this.nextSlide();
      });
    }, 4000); // Cambio cada 4 segundos
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
    this.startAutoScroll(); // Reiniciar auto-scroll
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
    this.startAutoScroll(); // Reiniciar auto-scroll
  }
}
