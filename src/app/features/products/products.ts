import { Component, signal } from '@angular/core';

interface Product {
  title: string;
  description: string;
  image: string;
  color: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class ProductsComponent {
  products = signal<Product[]>([
    {
      title: 'Brazo de Izaje Carga Pesada',
      description:
        'Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
      image: '/images/products/brazo_iza.png',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Brazo de Izaje Carga Pesada',
      description:
        'Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
      image: '/images/products/brazo_iza.png',
      color: 'from-yellow-600 to-yellow-700',
    },
    {
      title: 'Brazo de Izaje Carga Pesada',
      description:
        'Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
      image: '/images/products/brazo_iza.png',
      color: 'from-pink-500 to-pink-600',
    },
  ]);
}
