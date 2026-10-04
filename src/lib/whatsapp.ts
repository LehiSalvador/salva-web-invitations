import { whatsapp } from "@/data/site";

const INTERNATIONAL_NUMBER = /^[1-9]\d{9,14}$/;

export function buildWhatsAppUrl(number: string, message: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (!INTERNATIONAL_NUMBER.test(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const whatsAppUrl = buildWhatsAppUrl(whatsapp.number, whatsapp.message);
