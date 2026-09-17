import nodemailer from "nodemailer";
import https from "node:https";

/**
 * Envio del formulario de contacto.
 *
 * Funciona sin configurar nada, y mejor si se configura:
 *
 *   1. Si existen SMTP_USUARIO y SMTP_CLAVE, sale por el SMTP de esa cuenta.
 *      Es el camino bueno: el mensaje no pasa por manos de nadie.
 *   2. Si no existen, se releva por FormSubmit, que no pide cuenta ni clave.
 *      Solo hay que pulsar una vez el enlace de activacion que ellos mandan al
 *      primer envio. A cambio, sus servidores ven el contenido del mensaje.
 *
 * El relevo se hace aqui y no desde el navegador a proposito: asi la direccion
 * de destino no viaja en el HTML para que la recojan los robots, el CSP se
 * queda como esta, y la validacion y la trampa antispam siguen aplicandose
 * aunque cambie el proveedor de abajo.
 */

const DESTINO_POR_DEFECTO = "contreraslopezandresdavid@gmail.com";

const LIMITES = { nombre: 100, correo: 200, mensaje: 5000 };
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Las cabeceras no pueden llevar saltos de linea: es la via de inyeccion. */
const unaLinea = (v, max) =>
  String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

/** Un nombre con comillas rompe el <nombre> <correo> de la cabecera. */
const sinComillas = (v) => v.replace(/["\\]/g, "");

/** Camino 1: SMTP propio. */
async function porSmtp({ usuario, clave, destino, nombre, correo, mensaje }) {
  const transporte = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: usuario, pass: clave },
  });

  await transporte.sendMail({
    // Gmail rechaza un remitente que no sea la cuenta autenticada, asi que el
    // visitante va en replyTo: asi responder desde la bandeja le escribe a el.
    from: `"Formulario andres-contreras.dev" <${usuario}>`,
    to: destino,
    replyTo: `"${sinComillas(nombre)}" <${correo}>`,
    subject: `Nuevo mensaje de ${nombre}`,
    text: [`Nombre: ${nombre}`, `Correo: ${correo}`, "", mensaje || "(sin mensaje)"].join("\n"),
  });

  return { ok: true };
}

/**
 * POST de toda la vida.
 *
 * No se usa fetch a proposito: la especificacion marca Referer y Origin como
 * cabeceras prohibidas y el cliente las descarta en silencio, sin avisar. Como
 * FormSubmit rechaza cualquier peticion que no venga referida por una pagina,
 * el envio fallaba sin motivo aparente. El cliente de Node las manda tal cual.
 */
function postear(url, cuerpo, cabeceras) {
  return new Promise((resolve, reject) => {
    const datos = Buffer.from(JSON.stringify(cuerpo), "utf8");
    const peticion = https.request(
      url,
      {
        method: "POST",
        headers: { ...cabeceras, "Content-Length": datos.length },
        timeout: 10000,
      },
      (respuesta) => {
        let texto = "";
        respuesta.setEncoding("utf8");
        respuesta.on("data", (trozo) => (texto += trozo));
        respuesta.on("end", () => resolve(texto));
      }
    );
    peticion.on("timeout", () => peticion.destroy(new Error("se agoto el tiempo")));
    peticion.on("error", reject);
    peticion.end(datos);
  });
}

/** Camino 2: FormSubmit, sin cuenta. */
async function porFormSubmit({ destino, nombre, correo, mensaje, origen }) {
  const texto = await postear(
    `https://formsubmit.co/ajax/${encodeURIComponent(destino)}`,
    {
      name: nombre,
      email: correo,
      message: mensaje || "(sin mensaje)",
      _subject: `Nuevo mensaje de ${nombre}`,
      _template: "table",
      _captcha: "false",
    },
    {
      "Content-Type": "application/json",
      Accept: "application/json",
      // Sin una pagina que lo refiera, FormSubmit rechaza la peticion.
      Referer: origen,
      Origin: origen.replace(/\/$/, ""),
    }
  );

  // Responden siempre 200; lo que importa es el cuerpo.
  let datos = {};
  try {
    datos = JSON.parse(texto);
  } catch {
    console.error("[contacto] FormSubmit no devolvio JSON:", texto.slice(0, 200));
  }
  if (String(datos.success) === "true") return { ok: true };

  // El primer envio de todos dispara el correo de activacion. No es un fallo
  // del sitio, pero el visitante no puede hacer nada al respecto: se le da un
  // aviso neutro y el detalle queda en el registro para el dueño.
  const aviso = String(datos.message ?? "");
  if (/activ/i.test(aviso)) {
    console.error(
      "[contacto] FormSubmit pide activacion. Revisa la bandeja de " +
        destino +
        " y pulsa 'Activate Form'. Hasta entonces no se entrega nada."
    );
    return { ok: false, pendienteDeActivacion: true };
  }

  console.error("[contacto] FormSubmit rechazo el envio:", aviso);
  return { ok: false, detalle: aviso };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: "false", message: "Metodo no permitido" });
  }

  const cuerpo = req.body ?? {};

  // Trampa para robots: el campo va oculto, una persona no lo rellena. Se
  // responde como si todo hubiera ido bien para no darles pistas.
  if (unaLinea(cuerpo.website, 100)) {
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

  const destino = (process.env.DESTINO || DESTINO_POR_DEFECTO).trim();
  const usuario = process.env.SMTP_USUARIO?.trim();
  // Google enseña la contraseña de aplicacion en grupos de cuatro ("abcd efgh
  // ijkl mnop") y se copia con los espacios puestos. Gmail la rechaza asi, y el
  // error que devuelve es de credenciales, que despista. Se quitan aqui.
  const clave = process.env.SMTP_CLAVE?.replace(/\s+/g, "");

  const anfitrion = req.headers["x-forwarded-host"] || req.headers.host || "andres-contreras.dev";
  const origen = `https://${String(anfitrion).split(",")[0].trim()}/`;

  try {
    const resultado =
      usuario && clave
        ? await porSmtp({ usuario, clave, destino, nombre, correo, mensaje })
        : await porFormSubmit({ destino, nombre, correo, mensaje, origen });

    if (resultado.ok) {
      return res.status(200).json({ success: "true", message: "Mensaje enviado" });
    }
    // TEMPORAL: detalle del proveedor para diagnosticar. Quitar al terminar.
    return res.status(502).json({
      success: "false",
      message: "No se pudo enviar el mensaje",
      detalle: resultado.detalle ?? (resultado.pendienteDeActivacion ? "pendiente de activacion" : "sin detalle"),
      origen,
    });
  } catch (error) {
    console.error("[contacto] fallo el envio:", error?.message);
    return res.status(502).json({ success: "false", message: "No se pudo enviar el mensaje" });
  }
}
