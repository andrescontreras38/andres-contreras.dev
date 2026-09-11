/**
 * Canal donde vive la conversación de la comunidad.
 *
 * Mientras `url` sea null, el sitio no muestra ninguna invitación a unirse: es
 * preferible no ofrecer nada a mandar a la gente a un grupo vacío. En cuanto
 * elijas plataforma, pon la URL aquí y las llamadas aparecen solas.
 */
export const community = {
  url: null as string | null,
  // "WhatsApp" | "Discord" | "Telegram"... se usa en los textos de los botones.
  platform: "la comunidad",
  // Qué se promete al entrar. Concreto, sin humo.
  promise: "Recursos nuevos, avances de lo que construyo y dudas resueltas entre todos.",
};

export const hasCommunity = () => Boolean(community.url);
