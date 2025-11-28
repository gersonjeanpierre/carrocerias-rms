---
applyTo: '**'
description: Guía para implementar un carousel infinito con botones de navegación usando Angular Signals, CSS Transitions y Tailwind CSS
---

# Infinite Carousel - Workflow

## Conceptos Clave

Un carousel infinito permite navegar entre elementos de forma continua sin llegar a un "final". Se logra duplicando el contenido y reseteando la posición cuando se alcanza el conjunto duplicado.

## Características Implementadas

- ✅ **Loop infinito**: Duplicación de elementos para navegación continua
- ✅ **Botones de navegación lateral**: Prev/Next con iconos SVG
- ✅ **Auto-avance**: Cambio automático cada 4 segundos
- ✅ **Responsive**: Adapta el número de elementos visibles según el breakpoint
- ✅ **CSS puro**: Usa `transition: transform 0.5s ease-in-out` en lugar de Angular animations
- ✅ **Tailwind CSS**: Todo el diseño usa clases de utilidad
- ✅ **Pausa al interactuar**: Auto-scroll se detiene al usar botones y se reinicia

## Estructura del Componente

### 1. Template HTML (productos-vendidos.html)

```html
<section class="w-full py-8 md:py-12 lg:py-16 bg-base-100">
  <div class="w-full px-3 md:px-6 lg:px-8 max-w-7xl mx-auto">
    <h3
      class="mb-6 md:mb-8 lg:mb-12 text-center font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-neutral"
    >
      NUESTROS PRODUCTOS MÁS VENDIDOS
    </h3>

    <div class="relative">
      <!-- Botón Anterior -->
      <button
        (click)="prevSlide()"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-bluerms/90 hover:bg-bluerms text-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 -ml-4 md:-ml-6"
        aria-label="Anterior"
      >
        <svg><!-- SVG chevron left --></svg>
      </button>

      <!-- Botón Siguiente -->
      <button
        (click)="nextSlide()"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-bluerms/90 hover:bg-bluerms text-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 -mr-4 md:-mr-6"
        aria-label="Siguiente"
      >
        <svg><!-- SVG chevron right --></svg>
      </button>

      <!-- Contenedor del carousel -->
      <div class="overflow-hidden w-full">
        <div
          class="flex gap-2 md:gap-3 lg:gap-4"
          [style.transform]="'translateX(-' + currentIndex() * slideWidth() + '%)'"
          style="transition: transform 0.5s ease-in-out"
        >
          <!-- Primera copia de items -->
          @for (item of items(); track item.id + '-1') {
          <div class="shrink-0 w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(25%-0.75rem)]">
            <!-- Contenido del item -->
          </div>
          }

          <!-- Segunda copia para loop infinito -->
          @for (item of items(); track item.id + '-2') {
          <div class="shrink-0 w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(25%-0.75rem)]">
            <!-- Contenido del item (mismo que arriba) -->
          </div>
          }
        </div>
      </div>
    </div>
  </div>
</section>
```

### 2. Lógica TypeScript (productos-vendidos.ts)

```typescript
export class InfiniteCarouselComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  // Datos del carousel
  readonly items = signal<Item[]>([...]);
  readonly currentIndex = signal(0);
  readonly totalItems = computed(() => this.items().length);

  // Responsive
  readonly visibleItems = signal(4); // Desktop default
  readonly slideWidth = computed(() => 100 / this.visibleItems());

  private intervalId?: number;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateVisibleItems();
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

  private updateVisibleItems(): void {
    const width = window.innerWidth;
    if (width < 640) {
      this.visibleItems.set(1); // Mobile
    } else if (width < 1024) {
      this.visibleItems.set(2); // Tablet
    } else {
      this.visibleItems.set(4); // Desktop
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

  nextSlide(): void {
    this.stopAutoScroll();
    this.currentIndex.update((current) => {
      const itemWidth = this.slideWidth();
      const maxOffset = itemWidth * this.totalItems();
      const newIndex = current + 1;

      // Reset a 0 cuando alcanzamos el final del primer conjunto
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
      const maxOffset = itemWidth * this.totalItems();

      // Si estamos en 0, ir al final del primer conjunto
      if (current === 0) {
        return Math.floor(maxOffset / itemWidth) - 1;
      }

      return current - 1;
    });
    this.startAutoScroll();
  }

  onResize(): void {
    this.updateVisibleItems();
  }
}
```

## Puntos Clave de Implementación

### 1. Loop Infinito

- Duplica el array de elementos en el template usando `@for` con diferentes `track` keys (`item.id + '-1'` y `item.id + '-2'`).
- Cuando el índice alcanza el final del primer conjunto, resetea a 0.
- La transición CSS hace que el salto sea imperceptible.

### 2. CSS Transitions (NO usar Angular Animations)

- Aplica `style="transition: transform 0.5s ease-in-out"` directamente en el contenedor flex.
- Usa `[style.transform]="'translateX(-' + currentIndex() * slideWidth() + '%)'"` para el desplazamiento.
- Tailwind se encarga del resto del diseño.

### 3. Botones de Navegación

- Posicionados con `absolute` y `top-1/2 -translate-y-1/2` para centrarlos verticalmente.
- Clases: `z-20`, `rounded-full`, `shadow-lg`, `hover:scale-110`.
- Llamadas a métodos públicos `nextSlide()` y `prevSlide()`.

### 4. Auto-Scroll con Pausa

- `startAutoScroll()`: Inicia un `setInterval` que llama a `nextSlide()` cada N segundos.
- `stopAutoScroll()`: Limpia el intervalo.
- Al hacer clic en los botones, se detiene y reinicia el auto-scroll.

### 5. Responsive

- Usa `visibleItems` signal para controlar cuántos elementos se muestran.
- `slideWidth = 100 / visibleItems` para calcular el desplazamiento.
- Los anchos de los items usan `calc()` de Tailwind para restar gaps correctamente.

### 6. Efecto Hover en Items

- `group` en el contenedor del item.
- `group-hover:scale-100` para reducir escala al hacer hover.
- `group-hover:opacity-100` para mostrar overlay y texto.

## Checklist de Implementación

- [ ] Duplicar items en el template con diferentes track keys
- [ ] Aplicar `transition: transform 0.5s ease-in-out` en el contenedor flex
- [ ] Implementar `nextSlide()` y `prevSlide()` con lógica de loop infinito
- [ ] Agregar botones de navegación con posicionamiento absoluto
- [ ] Configurar auto-scroll con `setInterval` y `NgZone.run()`
- [ ] Implementar lógica responsive con `visibleItems` signal
- [ ] Añadir limpieza en `ngOnDestroy()` (clearInterval, removeEventListener)
- [ ] Usar `isPlatformBrowser()` para evitar errores en SSR
- [ ] Aplicar estilos hover con `group` y `group-hover:`

## Mejores Prácticas

1. **No uses `@HostListener` para resize**: Usa `addEventListener` en `ngOnInit` y limpia en `ngOnDestroy`.
2. **Usa `NgZone.run()`**: Asegura que los cambios dentro de `setInterval` se detecten correctamente.
3. **Evita `setTimeout` o `setInterval` sin cleanup**: Siempre limpia en `ngOnDestroy`.
4. **Usa `isPlatformBrowser()`**: Protege código que depende del navegador para SSR.
5. **Prefiere CSS transitions sobre Angular animations**: Más ligero y mejor performance.
6. **Usa `computed()` para valores derivados**: `slideWidth`, `totalItems`, etc.
7. **Usa `aspect-ratio` de Tailwind**: `aspect-[3/4]` para mantener proporciones sin `height` fijo.
8. **Usa `loading="lazy"` en imágenes**: Mejora performance inicial.

## Referencias

- [Angular Signals](https://angular.dev/guide/signals)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)
- [DaisyUI Components](https://daisyui.com/components/)
