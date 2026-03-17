export function buildWhatsAppUrl(phoneE164: string, message: string) {
  return `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`;
}
