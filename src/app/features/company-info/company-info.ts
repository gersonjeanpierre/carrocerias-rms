import { Component } from '@angular/core';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.html',
  styleUrls: ['./company-info.css'],
})
export class CompanyInfoComponent {
  handleNosotrosClick(): void {
    console.log('Navegando a Nosotros');
  }
}
