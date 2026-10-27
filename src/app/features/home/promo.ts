import { Component } from '@angular/core';

@Component({
  selector: 'tz-promo',
  template: `
    <div class="ticker"><div class="ticker-track">
      @for (copy of [0, 1]; track copy) {
        @for (promotion of promotions; track promotion) {
          <span class="ticker-item" [attr.aria-hidden]="copy === 1 ? true : null">{{ promotion }}</span>
        }
      }
    </div></div>`
})
export class Promo {
  readonly promotions = [
    '🍔 Burgers, alitas, jochos y nachos',
    '🍸 Drinks y mixología',
    '⚽ Partidos y deportes',
    '🎶 Música y noches especiales',
    '📲 Reserva o pedidos por WhatsApp',
    '✨ #Vivelaexperiencia'
  ];
}
