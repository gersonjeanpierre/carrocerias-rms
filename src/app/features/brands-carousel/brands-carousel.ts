import { Component, signal } from '@angular/core';

interface Brand {
  name: string;
  logo: string;
}

@Component({
  selector: 'app-brands-carousel',
  templateUrl: './brands-carousel.html',
  styleUrls: ['./brands-carousel.css'],
})
export class BrandsCarouselComponent {
  currentIndex = signal(0);
  brands = signal<Brand[]>([
    { name: 'Mercedes-Benz', logo: '/images/slider/marcas/mercedes-benz.png' },
    { name: 'Volvo', logo: '/images/slider/marcas/volvo.png' },
    { name: 'Volkswagen', logo: '/images/slider/marcas/volkswagen.png' },
    { name: 'Iveco', logo: '/images/slider/marcas/iveco.png' },
    { name: 'Isuzu', logo: '/images/slider/marcas/isuzu.png' },
    { name: 'JMC', logo: '/images/slider/marcas/jmc_motor.png' },
    { name: 'Toyota', logo: '/images/slider/marcas/toyota.png' },
  ]);
  visibleSlides = signal(5);
  private intervalId?: number;

  get totalSlides(): number {
    return this.brands().length;
  }

  get maxIndex(): number {
    return Math.max(0, this.totalSlides - this.visibleSlides());
  }

  ngOnInit(): void {
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  startAutoScroll(): void {
    this.intervalId = window.setInterval(() => {
      this.nextSlide();
    }, 3000); // cada 3 segundos
  }

  stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide(): void {
    const current = this.currentIndex();
    if (current < this.maxIndex) {
      this.currentIndex.set(current + 1);
    } else {
      this.currentIndex.set(0); // loop infinito
    }
  }

  previousSlide(): void {
    const current = this.currentIndex();
    if (current > 0) {
      this.currentIndex.set(current - 1);
    } else {
      this.currentIndex.set(this.maxIndex); // loop infinito
    }
  }

  get canGoPrevious(): boolean {
    return true;
  }

  get canGoNext(): boolean {
    return true;
  }
}
