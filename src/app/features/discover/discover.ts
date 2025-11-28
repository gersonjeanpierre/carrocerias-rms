import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SliderComponent } from '../../layout/slider/slider';

interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface MissionCard {
  id: number;
  icon: string;
  title: string;
  content?: string;
  values?: string[];
}

@Component({
  selector: 'app-discover',
  imports: [NgOptimizedImage],
  templateUrl: './discover.html',
  styleUrl: './discover.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Discover {
  protected readonly features = signal<Feature[]>([
    {
      id: 1,
      icon: 'icon-[ion--construct] h-12 w-12 text-bluerms',
      title: 'Un proceso industrial totalmente controlado',
      description:
        'Nuestras instalaciones de 30.000 m² reúnen todas nuestras competencias y conocimientos: diseño, sistema hidráulica, calderería, mecánica, líneas de pintura y montaje y logística. Somos fabricantes, ¡y estamos orgullosos de ello!'
    },
    {
      id: 2,
      icon: 'icon-[lucide--construction] h-12 w-12 text-bluerms',
      title: 'Un centro de pruebas integrado',
      description:
        'Contamos con nuestro propio equipo interno de I+D, formado por 18 ingenieros cualificados, todos ellos especialistas en su ámbito. Trabajan en estrecha colaboración con nuestros socios distribuidores para adaptar las soluciones MARREL a las configuraciones requeridas.'
    },
    {
      id: 3,
      icon: 'icon-[streamline--star-badge-remix] h-12 w-12 text-bluerms',
      title: 'Normas de calidad de referencia',
      description:
        'Porque la calidad de nuestros equipos es nuestra prioridad, somos muy exigentes en todas las etapas de nuestras operaciones. Nuestra fábrica cuenta con la doble certificación ISO9001 e ISO14001, y nuestro centro de montaje, con la certificación UTAC CERAM.'
    }
  ]);

  protected readonly missionCards = signal<MissionCard[]>([
    {
      id: 1,
      icon: 'icon-[material-symbols--visibility] h-12 w-12 text-bluerms',
      title: 'Visión',
      content:
        'Aspiramos a ser una empresa líder en el mercado a nivel nacional, gracias a la alta calidad de la materia prima utilizada para la elaboración de los diferentes tipos de carrocerías y estructuras metálicas en general. Buscamos generar un fuerte compromiso con nuestro personal y con la comunidad en su conjunto a desarrollar buenas prácticas productivas y de servicios.'
    },
    {
      id: 2,
      icon: 'icon-[ion--earth] h-12 w-12 text-bluerms',
      title: 'Misión',
      content:
        'La misión de CARROCERIAS RMS S.A.C., es diseñar y fabricar carrocerías para: Transporte de carga, carrocerias tales como (Barandas, Furgones, Volquetes, Cisternas, Cámaras Frigoríficas, Semirremolques y Remolques, Isajes , plataforma); bajo la política de suplir las necesidades de los clientes, ofreciéndoles la mayor calidad posible en la fabricación y reparación de estas; basados en los requerimientos y necesidades de nuestros clientes en aras de satisfacer las necesidades de estos.'
    },
    {
      id: 3,
      icon: 'icon-[mingcute--diamond-2-line] h-12 w-12 text-bluerms',
      title: 'Valores',
      values: [
        'Compromiso',
        'Innovación',
        'Responsabilidad',
        'Calidad',
        'Trabajo en equipo',
        'Mejora continua'
      ]
    }
  ]);
}
