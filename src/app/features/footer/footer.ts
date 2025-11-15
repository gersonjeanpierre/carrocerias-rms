import { Component } from '@angular/core';

interface FooterLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class FooterComponent {
  links: FooterLink[] = [
    { label: 'Inicio', href: '#' },
    { label: 'Productos', href: '#productos' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Contáctanos', href: '#contacto' },
  ];

  currentYear = new Date().getFullYear();
}
