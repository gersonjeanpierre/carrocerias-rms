import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { FooterComponent } from './layout/footer/footer';
import { SliderComponent } from './layout/slider/slider';
import { FontLoaderService } from './core/services/font-loader-service';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, FooterComponent, SliderComponent],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('Carrocerias RMS');
  private readonly fontLoaderService = inject(FontLoaderService);

  constructor() {
    // Inicializar la carga de fuentes
    this.fontLoaderService.initFontLoader();
  }
}
