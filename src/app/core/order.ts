import { CartItem } from './models';

export const PHONE_WA = '522381897602';
export function formatCurrency(value: number): string {
  return 'MX$ ' + (Number(value) || 0).toLocaleString('es-MX');
}
export function generateOrderCode(): string {
  return `TER-${Math.floor(1000 + Math.random() * 9000)}`;
}
export function buildWhatsAppMessage(items: readonly CartItem[], orderCode: string): string {
  const total = items.reduce((sum, item) => sum + item.qty * (Number(item.price) || 0), 0);
  const lines = items.map(item => {
    const price = Number(item.price) || 0;
    return `• ${item.qty} × ${item.name} — ${formatCurrency(price)} c/u = ${formatCurrency(item.qty * price)}`;
  }).join('\n');
  return [
    'Hola, quiero hacer un pedido en Terrazzo.', '', `Código de pedido: ${orderCode}`, '',
    'Pedido:', lines, '', `Total estimado: ${formatCurrency(total)}`, 'Forma de pago: Transferencia', '',
    'Entiendo que el total final se confirma por WhatsApp y que el pedido inicia cuando se confirme la transferencia.', '',
    'Envío este pedido desde el sitio web de Terrazzo.'
  ].join('\n');
}
export function checkoutUrl(items: readonly CartItem[]): string {
  return `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(buildWhatsAppMessage(items, generateOrderCode()))}`;
}
