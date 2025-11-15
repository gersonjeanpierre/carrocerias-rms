import { Component, signal } from '@angular/core';

interface ProjectImage {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-projects-carousel',
  templateUrl: './projects-carousel.html',
  styleUrls: ['./projects-carousel.css'],
})
export class ProjectsCarouselComponent {
  currentIndex = signal(0);
  projects = signal<ProjectImage[]>([
    { url: '/images/slider/498117bc-f8f7-4a65-83b8-5018505b96ab.JPG', alt: 'Proyecto 1' },
    { url: '/images/slider/49e91765-4a6c-4893-aa78-38d0442ddd03.JPG', alt: 'Proyecto 2' },
    { url: '/images/slider/IMG-20250716-WA0037.jpg', alt: 'Proyecto 3' },
    { url: '/images/slider/IMG-20250925-WA0005.jpg', alt: 'Proyecto 4' },
    { url: '/images/slider/IMG-20250926-WA0035.jpg', alt: 'Proyecto 5' },
  ]);
  visibleSlides = signal(3);
  private intervalId?: number;
  private readonly intervalMs = 40; // velocidad lenta

  get totalSlides(): number {
    return this.projects().length;
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
