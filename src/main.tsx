import { createRoot } from "react-dom/client";
import PaginaIsak from "./pagina-isak";

/**
 * Punto de entrada.
 *
 * No hay hoja de estilos propia ni enrutador: todo el aspecto viene de las
 * hojas de la plantilla ISAK, que index.html carga desde /isak/assets/css, y
 * la plantilla es de una sola pagina.
 */
createRoot(document.getElementById("root")!).render(<PaginaIsak />);
