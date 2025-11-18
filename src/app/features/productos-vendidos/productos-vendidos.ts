import { Component, signal, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-productos-vendidos',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './productos-vendidos.html',
  styleUrls: ['./productos-vendidos.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosVendidosComponent implements OnInit, OnDestroy {
  products = signal([
    { img: '/vanilla/Productos/1.jpeg', title: 'Brazo de Izaje Carga Pesada' },
    { img: '/vanilla/Productos/2.jpeg', title: 'Brazo de Izaje Carga Pesada' },
    { img: '/vanilla/Productos/3.jpeg', title: 'Brazo de Izaje Carga Pesada' },
    { img: '/vanilla/Productos/4.jpeg', title: 'Brazo de Izaje Carga Pesada' },
    { img: '/vanilla/Productos/5.jpeg', title: 'Brazo de Izaje Carga Pesada' },
    { img: '/vanilla/Productos/6.jpeg', title: 'Brazo de Izaje Carga Pesada' },
  ]);

  currentIndex = signal(0);
  private intervalId: any;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.zone.run(() => {
        this.currentIndex.update((i) => (i + 1) % (this.products().length - 3));
      });
    }, 3000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
