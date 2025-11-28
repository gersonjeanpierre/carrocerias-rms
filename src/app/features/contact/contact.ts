import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface ContactInfo {
  icon: string;
  text: string;
}

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Contact {
  readonly contactInfo = signal<ContactInfo[]>([
    {
      icon: 'icon-[material-symbols--location-on]',
      text: 'Otr. Sub Parcela Nro. 4 Asc. Huerta Granja el Ayllu (Zona D)'
    },
    {
      icon: 'icon-[material-symbols--mail]',
      text: 'ventas@rmscarrocerias.com.pe'
    },
    {
      icon: 'icon-[material-symbols--mail]',
      text: 'ventas01@rmscarrocerias.com.pe'
    },
    {
      icon: 'icon-[material-symbols--phone-enabled-sharp]',
      text: '+51 962 304 464'
    },
    {
      icon: 'icon-[material-symbols--phone-enabled-sharp]',
      text: '+51 993 056 995'
    }
  ]);
}
