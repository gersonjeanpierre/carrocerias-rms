import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-equipos-medida',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './equipos-medida.html',
  styleUrls: ['./equipos-medida.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquiposMedidaComponent {}
