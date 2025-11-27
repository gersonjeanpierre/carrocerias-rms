import {
  Component,
  signal,
  computed,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  inject
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ProductImagesService } from '@core/services/product-images.service';
import type { ProductImage } from '@core/models/product-image.models';

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
  private readonly autoPlayInterval = 5000; // 5 seconds
  private intervalId?: number;
  private readonly productService = inject(ProductImagesService);

  @ViewChild('container', { static: true }) container!: ElementRef;

  slides = computed<SlideImage[]>(() => {
    const allCategories = this.productService.categories();
    const slides: SlideImage[] = [];

    // Para cada categoría, tomar los primeros 2 modelos con sus primeras 2 imágenes
    for (const category of allCategories) {
      if (category.subcategories) {
        // Categoría con subcategorías
        for (const subcategory of category.subcategories) {
          const selectedModels = subcategory.models.slice(0, 2); // Primeros 2 modelos

          for (const model of selectedModels) {
            const firstImages = model.images.slice(0, 2); // Primeras 2 imágenes

            for (const image of firstImages) {
              const imagePath = this.productService.getImagePath(
                category.path,
                model.folderName,
                image.fileName,
                subcategory.path
              );

              slides.push({
                url: imagePath,
                title: category.name,
                width: 1600,
                height: 1200
              });
            }
          }
        }
      } else if (category.models) {
        // Categoría sin subcategorías
        const selectedModels = category.models.slice(0, 2); // Primeros 2 modelos

        for (const model of selectedModels) {
          const firstImages = model.images.slice(0, 2); // Primeras 2 imágenes

          for (const image of firstImages) {
            const imagePath = this.productService.getImagePath(
              category.path,
              model.folderName,
              image.fileName
            );

            slides.push({
              url: imagePath,
              title: category.name,
              width: 1600,
              height: 1200
            });
          }
        }
      }
    }

    return slides;
  });

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
    }, this.autoPlayInterval);
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
