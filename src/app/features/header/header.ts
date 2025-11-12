import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  navItems = [
    { label: 'Inicio', link: '/' },
    { label: 'Descubrenos', link: '/descubrenos' },
    {
      label: 'Productos',
      link: '/productos',
      children: [
        { label: 'Producto 1', link: '/productos/producto-1' },
        { label: 'Producto 2', link: '/productos/producto-2' },
      ],
    },
    { label: 'Servicios', link: '/servicios' },
    { label: 'Blog', link: '/blog' },
  ];
}
