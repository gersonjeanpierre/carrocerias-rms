import {
  Component,
  signal,
  computed,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

interface SlideImage {
  url: string;
  title: string;
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class SliderComponent implements OnDestroy {
  private readonly autoPlayInterval = 5000; // 5 seconds
  private intervalId?: number;

  @ViewChild('container', { static: true }) container!: ElementRef;

  slides = signal<SlideImage[]>([
    {
      url: '/watermark/watermark-brazo-izaje/bzi-1.jpg',
      title: 'Brazo de Izaje',
    },
    {
      url: '/watermark/watermark-cama-baja/cb-1.jpg',
      title: 'Cama Baja',
    },
    {
      url: '/watermark/watermark-cisterna-vacio/cv-1.jpg',
      title: 'Cisterna Vacio',
    },
    {
      url: '/watermark/watermark-contenedores/cont-1.jpg',
      title: 'Contenedor',
    },
    {
      url: '/watermark/watermark-furgon/furg-1.jpg',
      title: 'Furgoneta',
    },
    {
      url: '/watermark/watermark-grua-contenedor-chatarra/gcc-2.jpg',
      title: 'Grua Contenedor Chatarra',
    },
    {
      url: '/watermark/watermark-roquera-semirroquera/roq-1.jpg',
      title: 'Roquera',
    },
    {
      url: '/watermark/watermark-semirremolque-plataforma/sp-2.jpg',
      title: 'Semirremolque Plataforma',
    },
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
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  onImageLoad(event: Event): void {
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
    this.intervalId = window.setInterval(() => {
      this.nextSlide();
    }, this.autoPlayInterval);
  }

  private stopAutoPlay(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }

  pauseAutoPlay(): void {
    this.stopAutoPlay();
  }

  resumeAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
