import { Component, signal, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './proyectos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectosComponent implements OnInit, OnDestroy {
  proyectos = signal([
    {
      img: '/vanilla/Productos/barandas.JPG',
      fecha: '12 / Noviembre / 2025',
      title: 'Fabricación de Barandas',
    },
    {
      img: '/vanilla/Productos/Contenedor.jpg',
      fecha: '03 / Octubre / 2025',
      title: 'Contenedores',
    },
    {
      img: '/vanilla/Productos/furgones.jpg',
      fecha: '22 / Agosto / 2025',
      title: 'Brazo de Izaje Carga Pesada',
    },
  ]);

  currentIndex = signal(0);
  private intervalId: any;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.zone.run(() => {
        this.currentIndex.update((i) => (i + 1) % (this.proyectos().length - 2)); // showing 3, max index 1
      });
    }, 3000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
