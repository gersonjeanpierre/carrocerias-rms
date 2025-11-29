import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  protected readonly navItems = [
    { label: 'Inicio', link: '/landing' },
    { label: 'Descubrenos', link: '/descubrenos' },
    { label: 'Productos', link: '/productos' },
    { label: 'Contactanos', link: '/contactanos' },
    { label: 'Blog', link: '/blog' }
  ];
}
