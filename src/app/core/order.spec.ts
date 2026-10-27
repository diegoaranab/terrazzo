import { describe, expect, it, vi } from 'vitest';
import { buildWhatsAppMessage, checkoutUrl, formatCurrency, generateOrderCode } from './order';

const items = [
  { id: 'burger', name: 'Burger', price: 85, img: 'assets/burger.png', qty: 2 },
  { id: 'wings', name: 'Alitas', price: 105, img: 'assets/wings.png', qty: 1 }
];
describe('WhatsApp order', () => {
  it('preserves the complete legacy message, totals and transfer wording', () => {
    expect(buildWhatsAppMessage(items, 'TER-1234')).toBe([
      'Hola, quiero hacer un pedido en Terrazzo.', '', 'Código de pedido: TER-1234', '', 'Pedido:',
      '• 2 × Burger — MX$ 85 c/u = MX$ 170', '• 1 × Alitas — MX$ 105 c/u = MX$ 105', '',
      'Total estimado: MX$ 275', 'Forma de pago: Transferencia', '',
      'Entiendo que el total final se confirma por WhatsApp y que el pedido inicia cuando se confirme la transferencia.', '',
      'Envío este pedido desde el sitio web de Terrazzo.'
    ].join('\n'));
  });
  it('keeps MXN formatting', () => {
    expect(formatCurrency(1234.5)).toBe('MX$ 1,234.5');
    expect(formatCurrency(0)).toBe('MX$ 0');
  });
  it('generates four-digit TER codes at both random bounds', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(generateOrderCode()).toBe('TER-1000');
    random.mockReturnValue(0.999999);
    expect(generateOrderCode()).toBe('TER-9999');
    random.mockRestore();
  });
  it('encodes the order for the existing WhatsApp number', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    const url = new URL(checkoutUrl(items));
    expect(url.origin + url.pathname).toBe('https://wa.me/522381897602');
    expect(url.searchParams.get('text')).toBe(buildWhatsAppMessage(items, 'TER-1000'));
    random.mockRestore();
  });
});
