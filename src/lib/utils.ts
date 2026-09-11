import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Las fechas se guardan en ISO (2026-09-11) para que el structured data sea
 * válido; esto es solo para mostrarlas. Si llega algo que no es ISO, se
 * devuelve tal cual en vez de imprimir "Invalid Date".
 */
export function formatBlogDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return value;

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Texto plano a partir del HTML del post, para meta descripciones. */
export function excerptFromHtml(html: string, maxLength = 155): string {
  const text = (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, text.lastIndexOf(" ", maxLength))}…`;
}
