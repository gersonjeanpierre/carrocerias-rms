import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  imports: [FormsModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
})
export class HeroComponent {
  selectedSector = signal('');
  selectedEquipo = signal('');

  sectores = signal(['Construcción', 'Transporte', 'Minería', 'Agricultura', 'Industrial']);

  equipos = signal(['Camiones', 'Grúas', 'Plataformas', 'Volquetes', 'Cisternas']);

  handleSearch(): void {
    console.log('Buscando:', {
      sector: this.selectedSector(),
      equipo: this.selectedEquipo(),
    });
  }
}
