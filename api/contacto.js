import nodemailer from "nodemailer";

/**
 * Envio del formulario de contacto por SMTP propio.
 *
 * AHORA MISMO EL FORMULARIO NO PASA POR AQUI. Envia desde el navegador del
 * visitante a FormSubmit, que no exige cuenta ni credenciales. El relevo desde
 * esta funcion no es viable: FormSubmit esta detras de Cloudflare y responde un
 * desafio "Just a moment..." a todo lo que sale de un centro de datos.
 *
 * Esta via sigue aqui porque es la buena cuando se quiera dejar de depender de
 * terceros: el mensaje va directo del servidor a la bandeja y nadie mas lo ve.
 * Para activarla hacen falta dos cosas:
 *
 *   1. Definir en el entorno del despliegue:
 *        SMTP_USUARIO  la direccion de Gmail
 *        SMTP_CLAVE    contrasena de aplicacion (no la del correo)
 *        DESTINO       opcional, a donde llegan los mensajes
 *   2. Devolver el action del formulario a "/api/contacto".
 */

const LIMITES = { nombre: 100, correo: 200, mensaje: 5000 };
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Las cabeceras no pueden llevar saltos de linea: es la via de inyeccion. */
const unaLinea = (v, max) =>
  String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

/** Un nombre con comillas rompe el <nombre> <correo> de la cabecera. */
const sinComillas = (v) => v.replace(/["\\]/g, "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: "false", message: "Metodo no permitido" });
  }

  const cuerpo = req.body ?? {};

  // Trampa para robots: el campo va oculto, una persona no lo rellena. Se
  // responde como si todo hubiera ido bien para no darles pistas.
  if (unaLinea(cuerpo._honey ?? cuerpo.website, 100)) {
    return res.status(200).json({ success: "true", message: "Mensaje enviado" });
  }

  const nombre = unaLinea(cuerpo.name, LIMITES.nombre);
  const correo = unaLinea(cuerpo.email, LIMITES.correo);
  const mensaje = String(cuerpo.message ?? "").trim().slice(0, LIMITES.mensaje);

  if (!nombre) {
    return res.status(400).json({ success: "false", message: "Falta el nombre" });
  }
  if (!CORREO_VALIDO.test(correo)) {
    return res.status(400).json({ success: "false", message: "El correo no es valido" });
  }

  const usuario = process.env.SMTP_USUARIO?.trim();
  // Google enseña la contraseña de aplicacion en grupos de cuatro ("abcd efgh
  // ijkl mnop") y se copia con los espacios puestos. Gmail la rechaza asi, y el
  // error que devuelve es de credenciales, que despista. Se quitan aqui.
  const clave = process.env.SMTP_CLAVE?.replace(/\s+/g, "");
  if (!usuario || !clave) {
    console.error("[contacto] faltan SMTP_USUARIO o SMTP_CLAVE en el entorno");
    return res.status(500).json({ success: "false", message: "El envio no esta configurado" });
  }

  const transporte = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: usuario, pass: clave },
  });

  try {
    await transporte.sendMail({
      // Gmail rechaza un remitente que no sea la cuenta autenticada, asi que el
      // visitante va en replyTo: asi responder desde la bandeja le escribe a el.
      from: `"Formulario andres-contreras.dev" <${usuario}>`,
      to: process.env.DESTINO || usuario,
      replyTo: `"${sinComillas(nombre)}" <${correo}>`,
      subject: `Nuevo mensaje de ${nombre}`,
      text: [`Nombre: ${nombre}`, `Correo: ${correo}`, "", mensaje || "(sin mensaje)"].join("\n"),
    });
    return res.status(200).json({ success: "true", message: "Mensaje enviado" });
  } catch (error) {
    console.error("[contacto] fallo el envio:", error?.message);
    return res.status(502).json({ success: "false", message: "No se pudo enviar el mensaje" });
  }
}
