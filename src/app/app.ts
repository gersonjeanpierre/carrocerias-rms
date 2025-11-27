import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './features/header/header';
import { FooterComponent } from './features/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, FooterComponent],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('Carrocerias RMS');
}
