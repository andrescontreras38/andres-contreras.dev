import { createRoot } from "react-dom/client";
import "./index.css";

const container = document.getElementById("root")!;

/**
 * La aplicación se importa de forma diferida a propósito.
 *
 * Si un módulo falla al cargarse (por ejemplo, el cliente de Supabase cuando
 * faltan sus variables de entorno), el error ocurre antes de que React exista,
 * así que ningún ErrorBoundary lo atrapa y el visitante ve una página en blanco
 * sin ninguna pista. Con el import dinámico el fallo sí es capturable y se
 * puede mostrar algo legible.
 */
import("./App.tsx")
  .then(({ default: App }) => {
    createRoot(container).render(<App />);
  })
  .catch((error: Error) => {
    console.error("No se pudo iniciar la aplicación:", error);

    // Sin React disponible, se pinta a mano.
    container.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;
                  background:#05070d;color:#fff;font-family:system-ui,sans-serif;padding:24px">
        <div style="max-width:520px">
          <h1 style="font-size:22px;margin:0 0 12px">El sitio no pudo iniciarse</h1>
          <p style="color:#9aa4b2;line-height:1.6;margin:0 0 16px">
            Hubo un error al cargar la aplicación. Si eres quien la administra,
            el detalle está abajo y también en la consola del navegador.
          </p>
          <pre style="background:#0d1424;border:1px solid #1e2b45;border-radius:10px;
                      padding:14px;color:#93c5fd;font-size:13px;white-space:pre-wrap;
                      word-break:break-word;margin:0">${
                        String(error?.message ?? error).replace(/[<>&]/g, (c) =>
                          ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!
                        )
                      }</pre>
        </div>
      </div>
    `;
  });
