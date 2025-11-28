import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-equipos-medida',
  imports: [NgOptimizedImage],
  templateUrl: './equipos-medida.html',
  styleUrls: ['./equipos-medida.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EquiposMedidaComponent {
  readonly features = signal<Feature[]>([
    {
      id: 'seguridad',
      icon: 'icon-[fluent--shield-task-32-regular]',
      title: 'Seguridad',
      description:
        'Materiales A1, maquinaria de punta y personal capacitado que permiten fabricar carrocerías 100% seguras.'
    },
    {
      id: 'garantia',
      icon: 'icon-[fluent--clock-24-regular]',
      title: 'Garantía',
      description: '24 meses de garantía en todos los productos y seguimiento post-venta escribenos'
    },
    {
      id: 'puntualidad',
      icon: 'icon-[fluent--vehicle-truck-profile-32-regular]',
      title: 'Puntualidad',
      description:
        'Amplia planta de fabricación y personal dedicado que nos permite fabricar en tiempo récord.'
    }
  ]);
}
