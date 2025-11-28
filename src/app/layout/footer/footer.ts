import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

interface FooterLink {
  label: string;
  href?: string;
  icon: string; // clase bi o span
  isSpan?: boolean; // si es span en vez de icono
}

@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  menuLinks: FooterLink[] = [
    {
      label: 'Inicio',
      href: '#',
      icon: 'icon-[material-symbols--arrow-right-rounded]'
    },
    {
      label: 'Productos',
      href: '/productos',
      icon: 'icon-[material-symbols--arrow-right-rounded]'
    },
    { label: 'Descúbrenos', href: '#', icon: 'icon-[material-symbols--arrow-right-rounded]' },
    { label: 'Servicios', href: '#', icon: 'icon-[material-symbols--arrow-right-rounded]' },
    { label: 'Blog', href: '#', icon: 'icon-[material-symbols--arrow-right-rounded]' },
    { label: 'Contáctanos', href: '#', icon: 'icon-[material-symbols--arrow-right-rounded]' }
  ];

  productLinks: FooterLink[] = [
    { label: 'Brazos de Izaje', href: '#', icon: 'icon-[material-symbols--arrow-right-rounded]' },
    { label: 'Remolques', href: '#', icon: 'icon-[material-symbols--arrow-right-rounded]' },
    {
      label: 'Tanques Cisterna de Vacío',
      href: '#',
      icon: 'icon-[material-symbols--arrow-right-rounded]'
    },
    {
      label: 'Unidades Especiales',
      href: '#',
      icon: 'icon-[material-symbols--arrow-right-rounded]'
    },
    { label: 'Contenedores', href: '#', icon: 'icon-[material-symbols--arrow-right-rounded]' },
    { label: 'Ver Más', href: '#', icon: 'icon-[material-symbols--arrow-right-rounded]' }
  ];

  contactLinks: FooterLink[] = [
    {
      label: '962 304 464',
      href: 'tel:+51962304464',
      icon: 'icon-[material-symbols--phone-enabled-sharp]'
    },
    {
      label: '993 056 995',
      href: 'tel:+51993056995',
      icon: 'icon-[material-symbols--phone-enabled-sharp]'
    },
    {
      label: 'Asc. Huerta Granja en Ayllu, Lima',
      icon: 'icon-[material-symbols--location-on]',
      isSpan: true
    },
    {
      label: 'ventas@rmscarrocerias.com.pe',
      href: 'mailto:ventas@rmscarrocerias.com.pe',
      icon: 'icon-[material-symbols--mail]'
    },
    {
      label: 'ventas01@rmscarrocerias.com.pe',
      href: 'mailto:ventas01@rmscarrocerias.com.pe',
      icon: 'icon-[material-symbols--mail]'
    }
  ];

  currentYear = new Date().getFullYear();
}
