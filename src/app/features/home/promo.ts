import { Component } from '@angular/core';

@Component({
  selector: 'tz-promo',
  template: `
    <div class="ticker"><div class="ticker-track">
      @for (copy of [0, 1]; track copy) {
        @for (promotion of promotions; track promotion) {
          <span class="ticker-item">{{ promotion }}</span>
        }
      }
    </div></div>`
})
export class Promo {
  readonly promotions = [
    '🍻 Lunes chelas de media 2×$40',
    '🍔 Martes de Burgers $70 c/u',
    '🌭 Miércoles Jocho o Nachos + Tarro Monster $110',
    '🍗 Jueves de Alitas $7 c/u',
    '🍸 Jueves de mixología: Gina / Mojito / Carajillo $50',
    '🥃 Viernes 3 mezcales $50'
  ];
}
