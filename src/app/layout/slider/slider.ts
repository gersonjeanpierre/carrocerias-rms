import {
  Component,
  signal,
  computed,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

interface SlideImage {
  url: string;
  title: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage]
})
export class SliderComponent implements OnDestroy {
  private readonly autoPlayInterval = signal<number>(2900);
  private intervalId?: number;

  @ViewChild('container', { static: true }) container!: ElementRef;

  slides = signal<SlideImage[]>([
    {
      url: '/images/portada/cisterna-6.webp',
      title: 'Cisterna de Vacío',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/cisterna-de-vacio-1.webp',
      title: 'Cisterna de Vacío',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/cisterna-de-vacio-2.webp',
      title: 'Cisterna de Vacío',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/cisterna-de-vacio-3.webp',
      title: 'Cisterna de Vacío',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/cisterna-de-vacio-4-b.webp',
      title: 'Cisterna de Vacío',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/cisterna-de-vacio-4.webp',
      title: 'Cisterna de Vacío',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/cisterna-de-vacio-5.webp',
      title: 'Cisterna de Vacío',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/contenedor-1.webp',
      title: 'Contenedor',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/contenedor-2.webp',
      title: 'Contenedor',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/contenedor-3.webp',
      title: 'Contenedor',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/contenedor-4.webp',
      title: 'Contenedor',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/contenedor-5.webp',
      title: 'Contenedor',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/semirremolque-plataforma-1.webp',
      title: 'Semirremolque Plataforma',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/semirremolque-plataforma-2.webp',
      title: 'Semirremolque Plataforma',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/semirremolque-plataforma-3.webp',
      title: 'Semirremolque Plataforma',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/semirremolque-plataforma-4.webp',
      title: 'Semirremolque Plataforma',
      width: 1600,
      height: 1200
    },
    {
      url: '/images/portada/semirremolque-plataforma-5.webp',
      title: 'Semirremolque Plataforma',
      width: 1600,
      height: 1200
    }
  ]);

  currentIndex = signal(0);

  currentSlide = computed(() => {
    const index = this.currentIndex();
    const slidesList = this.slides();
    return slidesList[index] || slidesList[0];
  });

  totalSlides = computed(() => this.slides().length);

  imageLeft = signal(0);
  imageRight = signal(0);

  constructor() {
    if (typeof window !== 'undefined') {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    this.intervalId = undefined;
  }

  onImageLoad(event: Event): void {
    // Optimizado: solo calcula si container existe
    if (!this.container?.nativeElement) return;
    const img = event.target as HTMLImageElement;
    const containerRect = this.container.nativeElement.getBoundingClientRect();
    const aspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = containerRect.width / containerRect.height;
    let displayedWidth: number;
    if (aspect > containerAspect) {
      displayedWidth = containerRect.width;
    } else {
      displayedWidth = containerRect.height * aspect;
    }
    const left = (containerRect.width - displayedWidth) / 2 + containerRect.left;
    const right = left + displayedWidth;
    this.imageLeft.set(left);
    this.imageRight.set(right);
  }

  nextSlide(): void {
    const current = this.currentIndex();
    const total = this.totalSlides();
    this.currentIndex.set((current + 1) % total);
  }

  previousSlide(): void {
    const current = this.currentIndex();
    const total = this.totalSlides();
    this.currentIndex.set((current - 1 + total) % total);
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.totalSlides()) {
      this.currentIndex.set(index);
    }
  }

  private startAutoPlay(): void {
    this.stopAutoPlay();
    this.intervalId = window.setInterval(() => {
      this.nextSlide();
    }, this.autoPlayInterval());
  }

  private stopAutoPlay(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  pauseAutoPlay(): void {
    this.stopAutoPlay();
  }

  resumeAutoPlay(): void {
    if (typeof window !== 'undefined') {
      this.startAutoPlay();
    }
  }
}
