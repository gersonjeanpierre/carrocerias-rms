import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './features/header/header';
import { Model3d } from './features/model3d/model3d';
import { SliderComponent } from './features/slider/slider';
import { HeroComponent } from './features/hero/hero';
import { CompanyInfoComponent } from './features/company-info/company-info';
import { ProductsComponent } from './features/products/products';
import { CatalogCtaComponent } from './features/catalog-cta/catalog-cta';
import { ProjectsCarouselComponent } from './features/projects-carousel/projects-carousel';
import { BrandsCarouselComponent } from './features/brands-carousel/brands-carousel';
import { VideoComponent } from './features/video/video';
import { FooterComponent } from './features/footer/footer';
import { EquiposMedidaComponent } from './features/equipos-medida/equipos-medida';
import { ProductosVendidosComponent } from './features/productos-vendidos/productos-vendidos';
import { ProyectosComponent } from './features/proyectos/proyectos';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    SliderComponent,
    EquiposMedidaComponent,
    ProductosVendidosComponent,
    ProyectosComponent,
    CatalogCtaComponent,
    VideoComponent,
    BrandsCarouselComponent,
    Model3d,
    FooterComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('carrocerias-rms');
}
