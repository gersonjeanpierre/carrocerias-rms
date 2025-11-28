import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { FooterComponent } from './layout/footer/footer';
import { SliderComponent } from './layout/slider/slider';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, FooterComponent, SliderComponent],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('Carrocerias RMS');
}
