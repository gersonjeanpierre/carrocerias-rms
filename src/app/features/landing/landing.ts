import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrandsCarouselComponent } from './brands-carousel/brands-carousel';
import { VideoComponent } from './video/video';
import { EquiposMedidaComponent } from './equipos-medida/equipos-medida';
import { ProductosVendidosComponent } from './productos-vendidos/productos-vendidos';
import { ProyectosComponent } from './proyectos/proyectos';

@Component({
  selector: 'app-landing',
  imports: [
    EquiposMedidaComponent,
    ProductosVendidosComponent,
    ProyectosComponent,
    VideoComponent,
    BrandsCarouselComponent
  ],
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LandingComponent {}
