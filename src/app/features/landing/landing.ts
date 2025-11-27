import { Component } from '@angular/core';
import { SliderComponent } from './slider/slider';
import { CatalogCtaComponent } from './catalog-cta/catalog-cta';
import { BrandsCarouselComponent } from './brands-carousel/brands-carousel';
import { VideoComponent } from './video/video';
import { EquiposMedidaComponent } from './equipos-medida/equipos-medida';
import { ProductosVendidosComponent } from './productos-vendidos/productos-vendidos';
import { ProyectosComponent } from './proyectos/proyectos';

@Component({
  selector: 'app-landing',
  imports: [
    SliderComponent,
    EquiposMedidaComponent,
    ProductosVendidosComponent,
    ProyectosComponent,
    CatalogCtaComponent,
    VideoComponent,
    BrandsCarouselComponent
  ],
  templateUrl: './landing.html'
})
export default class LandingComponent {}
