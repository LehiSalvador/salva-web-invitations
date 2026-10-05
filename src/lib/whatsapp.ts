import { whatsapp } from "@/data/site";

const INTERNATIONAL_NUMBER = /^[1-9]\d{9,14}$/;

export function buildWhatsAppUrl(number: string, message: string): string {
  if (!INTERNATIONAL_NUMBER.test(number)) {
    throw new Error(`Número de WhatsApp inválido: "${number}". Usa formato internacional solo con dígitos.`);
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const whatsAppUrl = buildWhatsAppUrl(whatsapp.number, whatsapp.message);
