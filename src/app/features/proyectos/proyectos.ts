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

interface Proyecto {
  img: string;
  fecha: string;
  title: string;
  category: string;
}

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './proyectos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()',
  },
})
export class ProyectosComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  readonly proyectos = signal<Proyecto[]>([
    // Brazo de Izaje
    {
      img: '/watermark/watermark-brazo-izaje/bzi-3.jpg',
      fecha: '15 / Noviembre / 2024',
      title: 'Brazo de Izaje Industrial',
      category: 'Carga Pesada',
    },
    {
      img: '/watermark/watermark-brazo-izaje/bzi-4.jpg',
      fecha: '10 / Noviembre / 2024',
      title: 'Sistema de Izaje Especializado',
      category: 'Carga Pesada',
    },

    // Cama Baja
    {
      img: '/watermark/watermark-cama-baja/cb-3.jpg',
      fecha: '05 / Noviembre / 2024',
      title: 'Cama Baja para Transporte',
      category: 'Transporte Especializado',
    },

    // Cisterna Vacío
    {
      img: '/watermark/watermark-cisterna-vacio/cv-3.jpg',
      fecha: '28 / Octubre / 2024',
      title: 'Cisterna de Vacío Industrial',
      category: 'Transporte de Líquidos',
    },
    {
      img: '/watermark/watermark-cisterna-vacio/cv-4.jpg',
      fecha: '20 / Octubre / 2024',
      title: 'Sistema de Cisterna Especializado',
      category: 'Transporte de Líquidos',
    },

    // Contenedores
    {
      img: '/watermark/watermark-contenedores/cont-3.jpg',
      fecha: '15 / Octubre / 2024',
      title: 'Contenedores de Carga',
      category: 'Carga General',
    },

    // Furgón
    {
      img: '/watermark/watermark-furgon/furg-3.jpg',
      fecha: '08 / Octubre / 2024',
      title: 'Furgón de Carga Seca',
      category: 'Carga Seca',
    },
    {
      img: '/watermark/watermark-furgon/furg-4.jpg',
      fecha: '01 / Octubre / 2024',
      title: 'Furgón Refrigerado',
      category: 'Carga Seca',
    },

    // Grúa Contenedor
    {
      img: '/watermark/watermark-grua-contenedor-chatarra/gcc-3.jpg',
      fecha: '25 / Septiembre / 2024',
      title: 'Grúa para Contenedores',
      category: 'Manejo de Chatarra',
    },

    // Roquera
    {
      img: '/watermark/watermark-roquera-semirroquera/roq-1.jpg',
      fecha: '18 / Septiembre / 2024',
      title: 'Roquera para Materiales',
      category: 'Materiales de Construcción',
    },

    // Semirremolque Plataforma
    {
      img: '/watermark/watermark-semirremolque-plataforma/sp-3.jpg',
      fecha: '10 / Septiembre / 2024',
      title: 'Semirremolque Plataforma',
      category: 'Carga Plana',
    },
    {
      img: '/watermark/watermark-semirremolque-plataforma/sp-4.jpg',
      fecha: '05 / Septiembre / 2024',
      title: 'Plataforma de Carga Extendida',
      category: 'Carga Plana',
    },
  ]);

  readonly currentIndex = signal(0);
  readonly totalProyectos = computed(() => this.proyectos().length);

  // Responsive: número de proyectos visibles según el ancho de pantalla
  readonly visibleProyectos = signal(3); // Default: desktop (lg)

  // Computed: máximo índice basado en proyectos visibles
  readonly maxIndex = computed(() => Math.max(0, this.totalProyectos() - this.visibleProyectos()));

  // Computed: ancho de desplazamiento en porcentaje
  readonly slideWidth = computed(() => {
    const visible = this.visibleProyectos();
    return 100 / visible;
  });

  private intervalId?: number;

  ngOnInit(): void {
    this.updateVisibleProyectos();
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  onResize(): void {
    this.updateVisibleProyectos();
  }

  private updateVisibleProyectos(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const width = window.innerWidth;

    // Breakpoints de Tailwind:
    // sm: 640px, md: 768px, lg: 1024px
    if (width < 640) {
      this.visibleProyectos.set(1); // Mobile: 1 proyecto
    } else if (width < 1024) {
      this.visibleProyectos.set(2); // Small/Medium: 2 proyectos
    } else {
      this.visibleProyectos.set(3); // Large+: 3 proyectos
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
