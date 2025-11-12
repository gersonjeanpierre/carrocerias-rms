import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './features/header/header';
import { Model3d } from './features/model3d/model3d';

@Component({
  selector: 'app-root',
  imports: [Header, Model3d],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('carrocerias-rms');
}
