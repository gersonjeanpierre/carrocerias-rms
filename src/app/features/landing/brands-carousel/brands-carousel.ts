import {
  Component,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

interface Brand {
  name: string;
  logo: string;
}

@Component({
  selector: 'app-brands-carousel',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './brands-carousel.html',
  styleUrls: ['./brands-carousel.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandsCarouselComponent implements OnInit, OnDestroy {
  readonly currentIndex = signal(0);
  readonly brands = signal<Brand[]>([
    { name: 'Mercedes-Benz', logo: '/images/slider/marcas/mercedes-benz.png' },
    { name: 'Volvo', logo: '/images/slider/marcas/volvo.png' },
    { name: 'Volkswagen', logo: '/images/slider/marcas/volkswagen.png' },
    { name: 'Iveco', logo: '/images/slider/marcas/iveco.png' },
    { name: 'Isuzu', logo: '/images/slider/marcas/isuzu.png' },
    { name: 'JMC', logo: '/images/slider/marcas/jmc_motor.png' },
    { name: 'Toyota', logo: '/images/slider/marcas/toyota.png' },
  ]);

  // Computed signals for derived state
  readonly totalSlides = computed(() => this.brands().length);
  readonly duplicatedBrands = computed(() => [...this.brands(), ...this.brands()]);

  private intervalId?: number;

  ngOnInit(): void {
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  private startAutoScroll(): void {
    this.intervalId = window.setInterval(() => {
      this.nextSlide();
    }, 3000); // cada 3 segundos
  }

  private stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private nextSlide(): void {
    const current = this.currentIndex();
    const total = this.totalSlides();

    if (current >= total - 1) {
      this.currentIndex.set(0); // loop infinito
    } else {
      this.currentIndex.set(current + 1);
    }
  }
}
