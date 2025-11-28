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
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';

interface Brand {
  name: string;
  logo: string;
}

@Component({
  selector: 'app-brands-carousel',
  imports: [NgOptimizedImage],
  templateUrl: './brands-carousel.html',
  styleUrls: ['./brands-carousel.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsCarouselComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);

  private intervalId?: number;
  private intersectionObserver?: IntersectionObserver;
  private isVisible = signal(false);

  readonly brands = signal<Brand[]>([
    { name: 'Mercedes-Benz', logo: '/images/slider/marcas/mercedes-benz.png' },
    { name: 'Volvo', logo: '/images/slider/marcas/volvo.png' },
    { name: 'Volkswagen', logo: '/images/slider/marcas/volkswagen.png' },
    { name: 'Iveco', logo: '/images/slider/marcas/iveco.png' },
    { name: 'Isuzu', logo: '/images/slider/marcas/isuzu.png' },
    { name: 'JMC', logo: '/images/slider/marcas/jmc_motor.png' },
    { name: 'Toyota', logo: '/images/slider/marcas/toyota.png' }
  ]);

  readonly currentIndex = signal(0);
  readonly totalBrands = computed(() => this.brands().length);
  readonly visibleBrands = signal(5); // Desktop default
  readonly slideWidth = computed(() => 100 / this.visibleBrands());

  // Duplicar marcas para loop infinito
  readonly duplicatedBrands = computed(() => [...this.brands(), ...this.brands()]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateVisibleBrands();
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
        { threshold: 0.1 }
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

  private updateVisibleBrands(): void {
    const width = window.innerWidth;
    if (width < 640) {
      this.visibleBrands.set(2); // Mobile
    } else if (width < 1024) {
      this.visibleBrands.set(3); // Tablet
    } else {
      this.visibleBrands.set(5); // Desktop
    }
  }

  private startAutoScroll(): void {
    this.stopAutoScroll();
    this.intervalId = window.setInterval(() => {
      this.zone.run(() => {
        this.nextSlide();
      });
    }, 4000); // cada 4 segundos
  }

  private stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  nextSlide(): void {
    this.stopAutoScroll();
    this.currentIndex.update((current) => {
      const itemWidth = this.slideWidth();
      const maxOffset = itemWidth * this.totalBrands();
      const newIndex = current + 1;
      if (newIndex * itemWidth >= maxOffset) {
        return 0;
      }
      return newIndex;
    });
    this.startAutoScroll();
  }

  prevSlide(): void {
    this.stopAutoScroll();
    this.currentIndex.update((current) => {
      const itemWidth = this.slideWidth();
      const maxOffset = itemWidth * this.totalBrands();
      if (current === 0) {
        return Math.floor(maxOffset / itemWidth) - 1;
      }
      return current - 1;
    });
    this.startAutoScroll();
  }

  onResize(): void {
    this.updateVisibleBrands();
  }
}
