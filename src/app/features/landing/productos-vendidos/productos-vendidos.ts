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
  ElementRef
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosVendidosComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly productService = inject(ProductImagesService);
  private readonly elementRef = inject(ElementRef);

  private intervalId?: number;
  private intersectionObserver?: IntersectionObserver;
  private isVisible = signal(false);

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

  // Computed: índice máximo antes de reset (para loop infinito)
  readonly maxIndex = computed(() => {
    const total = this.totalProducts();
    const visible = this.visibleProducts();
    return total - visible;
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateVisibleProducts();
      window.addEventListener('resize', this.onResize.bind(this));

      // Iniciar auto-scroll solo cuando el componente sea visible
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.isVisible()) {
              this.isVisible.set(true);
              this.startAutoScroll();
            } else if (!entry.isIntersecting && this.isVisible()) {
              this.isVisible.set(false);
              this.stopAutoScroll();
            }
          });
        },
        { threshold: 0.1 } // Iniciar cuando 10% sea visible
      );

      this.intersectionObserver.observe(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize.bind(this));
      this.intersectionObserver?.disconnect();
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

    // Breakpoints consistentes:
    // sm: 640px, md: 768px, lg: 1024px, xl: 1280px
    if (width < 640) {
      this.visibleProducts.set(1); // Mobile: 1 producto
    } else if (width < 1024) {
      this.visibleProducts.set(2); // Tablet: 2 productos
    } else {
      this.visibleProducts.set(4); // Desktop: 4 productos
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
      const maxIndex = this.maxIndex();
      const newIndex = current + 1;

      // Reset a 0 cuando alcanzamos el final (loop infinito)
      if (newIndex > maxIndex) {
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
      const maxIndex = this.maxIndex();

      // Si estamos en 0, ir al final
      if (current === 0) {
        return maxIndex;
      }

      return current - 1;
    });
    this.startAutoScroll(); // Reiniciar auto-scroll
  }
}
