/**
 * Portada, sobre la plantilla ISAK.
 *
 * El marcado y las clases son los de la plantilla, sin reinterpretar: sus
 * hojas de estilo y su JavaScript se cargan tal cual desde /public/isak, y
 * este componente solo reproduce la estructura que esos estilos esperan.
 * Por eso las clases son las suyas (tf-btn, preload, body-background) y no
 * utilidades de Tailwind.
 *
 * El contenido de demostracion se reemplaza por el real en un paso aparte.
 */
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Los scripts de la plantilla, en su orden original. Se cargan aqui y no desde
 * index.html por una razon de orden: React monta de forma asincrona, y el
 * main.js de ISAK busca elementos del DOM nada mas ejecutarse. Cargado desde
 * la cabecera correria con el <div id="root"> todavia vacio, no encontraria
 * nada y ninguna animacion arrancaria.
 */
const SCRIPTS = [
  "jquery.min.js",
  "bootstrap.min.js",
  "jquery.nice-select.min.js",
  "jquery-validate.js",
  "swiper-bundle.min.js",
  "odometer.min.js",
  "carousel.js",
  "infinityslide.js",
  "ScrollSmooth.js",
  "gsap.min.js",
  "SplitText.min.js",
  "ScrollTrigger.min.js",
  "ScrollToPlugin.min.js",
  "gsapAnimation.js",
  "countto.js",
  "animation-change-text.js",
  "main.js",
];

/** Carga en serie: cada script depende de que el anterior haya terminado. */
function cargarEnSerie(archivos: string[]): Promise<void> {
  return archivos.reduce(
    (previo, archivo) =>
      previo.then(
        () =>
          new Promise<void>((listo) => {
            const src = `/assets/js/${archivo}`;
            if (document.querySelector(`script[src="${src}"]`)) return listo();
            const el = document.createElement("script");
            el.src = src;
            el.async = false;
            el.onload = () => listo();
            el.onerror = () => {
              console.error("[isak] no se pudo cargar", src);
              listo();
            };
            document.body.appendChild(el);
          })
      ),
    Promise.resolve()
  );
}

/** Direccion real de contacto: el dominio del sitio aun no recibe correo. */
const CORREO_CONTACTO = "contreraslopezandresdavid@gmail.com";

/**
 * Certificaciones oficiales. Las imagenes salen del PDF original con la cedula
 * y el codigo de verificacion tapados: el codigo permite consultar el registro
 * del titular en el portal de la universidad, asi que no debe publicarse.
 */
const CERTIFICACIONES = [
  {
    id: "udemy-claude-code",
    titulo: "Master en Claude Code: crea apps con IA y Vibe Coding",
    emisor: "Udemy",
    detalle: "10 horas · 2026",
    imagen: "/assets/images/certificaciones/udemy-claude-code.jpg",
  },
  {
    id: "unicordoba-nube",
    titulo: "Desarrollo de Aplicaciones Orientadas a la Nube",
    emisor: "Universidad de Córdoba",
    detalle: "Diplomado · 120 horas · 2022",
    imagen: "/assets/images/certificaciones/unicordoba-nube.jpg",
  },
];

/** Lo que el visitante reconoce como problema propio, no herramientas concretas. */
const PROBLEMAS = [
  "tareas repetitivas",
  "comentarios sin responder",
  "web lenta",
  "mal SEO y GEO",
];

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const acotar = (v) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, v));

/** Visor a pantalla completa: rueda o botones para acercar, arrastre para mover. */
const VisorCertificado = ({ cert, alCerrar }) => {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const arrastre = useRef(null);

  const reencuadrar = useCallback((nuevo) => {
    setZoom(nuevo);
    if (nuevo === 1) setPos({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const alPulsar = (e) => {
      if (e.key === "Escape") alCerrar();
      if (e.key === "+" || e.key === "=") reencuadrar(acotar(zoom + 0.5));
      if (e.key === "-") reencuadrar(acotar(zoom - 0.5));
    };
    document.addEventListener("keydown", alPulsar);
    // Sin esto la pagina de detras sigue desplazandose al usar la rueda.
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = previo;
    };
  }, [alCerrar, reencuadrar, zoom]);

  const alaRueda = (e) => {
    e.preventDefault();
    reencuadrar(acotar(zoom + (e.deltaY < 0 ? 0.25 : -0.25)));
  };

  const empezarArrastre = (e) => {
    if (zoom === 1) return;
    arrastre.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };
  const moverArrastre = (e) => {
    if (!arrastre.current) return;
    setPos({ x: e.clientX - arrastre.current.x, y: e.clientY - arrastre.current.y });
  };
  const soltarArrastre = () => { arrastre.current = null; };

  return (
    <div className="visor-cert" role="dialog" aria-modal="true" aria-label={cert.titulo}>
      <div className="visor-cert__fondo" onClick={alCerrar}></div>
      <div className="visor-cert__barra">
        <p className="visor-cert__titulo">{cert.titulo}</p>
        <div className="visor-cert__acciones">
          <button type="button" onClick={() => reencuadrar(acotar(zoom - 0.5))} aria-label="Alejar" disabled={zoom <= ZOOM_MIN}>−</button>
          <span className="visor-cert__nivel">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => reencuadrar(acotar(zoom + 0.5))} aria-label="Acercar" disabled={zoom >= ZOOM_MAX}>+</button>
          <a href={cert.imagen} target="_blank" rel="noreferrer" aria-label="Abrir en una pestaña nueva">↗</a>
          <button type="button" onClick={alCerrar} aria-label="Cerrar">✕</button>
        </div>
      </div>
      <div
        className="visor-cert__lienzo"
        onWheel={alaRueda}
        onMouseDown={empezarArrastre}
        onMouseMove={moverArrastre}
        onMouseUp={soltarArrastre}
        onMouseLeave={soltarArrastre}
        onDoubleClick={() => reencuadrar(zoom === 1 ? 2 : 1)}
        style={{ cursor: zoom > 1 ? (arrastre.current ? "grabbing" : "grab") : "zoom-in" }}
      >
        <img
          src={cert.imagen}
          alt={`${cert.titulo}, ${cert.emisor}`}
          draggable={false}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})` }}
        />
      </div>
    </div>
  );
};

const PortadaIsak = () => {
  const [certAbierta, setCertAbierta] = useState(null);

  useEffect(() => {
    cargarEnSerie(SCRIPTS);
  }, []);

  return (
    <>



    {/* Preload */}
    <div className="preload preload-container bg-dark" id="preload">
        <div className="preload-logo">
            <div className="spinner"></div>
        </div>
    </div>
    {/* /Preload */}

    {/* Body Background */}
    <div className="body-background">
        <div className="bg-item">
            <img loading="lazy" width="1440" height="900" src="/assets/images/item/cloud-bg.png" alt="Image" />
        </div>
        <div className="bg-video video-dark">
            <video className="video" muted autoPlay loop playsInline>
                <source src="/assets/images/overlay-2.mp4" type="video/mp4" />
            </video>
            <div className="overlay-1"></div>
        </div>
    </div>
    {/* /Body Background */}


    {/* Menu Mobile */}
    <div className="action-open-mobile d-lg-none">
        <div className="tf-btn-icon style-2">
            <div className="btn-mobile-menu">
                <span></span>
            </div>
        </div>
        <div className="nav-mobile-list">
            <ul className="nav-mobile-item">
                <li className="nav-item">
                    <a href="#home" className="item-link scroll-link">
                        <i className="icon icon-home"></i>
                        <p className="tool-tip text-caption">Inicio</p>
                    </a>
                </li>
                <li className="br-line"></li>
                <li className="nav-item">
                    <a href="#about" className="item-link scroll-link">
                        <i className="icon icon-user-circle"></i>
                        <p className="tool-tip text-caption">Sobre mí</p>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#education" className="item-link scroll-link">
                        <i className="icon icon-edu"></i>
                        <p className="tool-tip text-caption">Formación y experiencia</p>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#work" className="item-link scroll-link">
                        <i className="icon icon-high-light"></i>
                        <p className="tool-tip text-caption">Proyectos</p>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#service" className="item-link scroll-link">
                        <i className="icon icon-service"></i>
                        <p className="tool-tip text-caption">Servicios</p>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#tech" className="item-link scroll-link">
                        <i className="icon icon-tech-stack"></i>
                        <p className="tool-tip text-caption">Tecnologías</p>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#certificaciones" className="item-link scroll-link">
                        <i className="icon icon-edu"></i>
                        <p className="tool-tip text-caption">Certificaciones</p>
                    </a>
                </li>
                <li className="br-line"></li>
                <li className="nav-item">
                    <a href="#contact" className="item-link scroll-link">
                        <i className="icon icon-send"></i>
                        <p className="tool-tip text-caption">Contacto</p>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    {/* /Menu Mobile */}

    {/* Tool Sidebar */}
    <div className="sidebar-tools pst-v1">
        <div className="nav-top">
            <div className="tf-btn-icon toggle-switch-mode">
                <i className="icon icon-light"></i>
            </div>
        </div>
        <ul className="nav-list">
            <li className="nav-item">
                <a href="#home" className="item-link scroll-link">
                    <i className="icon icon-home"></i>
                    <p className="tool-tip text-caption">Inicio</p>
                </a>
            </li>
            <li className="br-line"></li>
            <li className="nav-item">
                <a href="#about" className="item-link scroll-link">
                    <i className="icon icon-user-circle"></i>
                    <p className="tool-tip text-caption">Sobre mí</p>
                </a>
            </li>
            <li className="nav-item">
                <a href="#education" className="item-link scroll-link">
                    <i className="icon icon-edu"></i>
                    <p className="tool-tip text-caption">Formación</p>
                </a>
            </li>
            <li className="nav-item">
                <a href="#work" className="item-link scroll-link">
                    <i className="icon icon-high-light"></i>
                    <p className="tool-tip text-caption">Proyectos</p>
                </a>
            </li>
            <li className="nav-item">
                <a href="#service" className="item-link scroll-link">
                    <i className="icon icon-service"></i>
                    <p className="tool-tip text-caption">Servicios</p>
                </a>
            </li>
            <li className="nav-item">
                <a href="#tech" className="item-link scroll-link">
                    <i className="icon icon-tech-stack"></i>
                    <p className="tool-tip text-caption">Tecnologías</p>
                </a>
            </li>
            <li className="nav-item">
                <a href="#certificaciones" className="item-link scroll-link">
                    <i className="icon icon-edu"></i>
                    <p className="tool-tip text-caption">Certificaciones</p>
                </a>
            </li>
            <li className="br-line"></li>
            <li className="nav-item">
                <a href="#contact" className="item-link scroll-link">
                    <i className="icon icon-send"></i>
                    <p className="tool-tip text-caption">Contacto</p>
                </a>
            </li>
        </ul>
        <div className="nav-bottom">
            <a href="#home" className="tf-btn-icon go-top">
                <i className="icon icon-arrow-top"></i>
            </a>
        </div>
    </div>
    {/* /Tool Sidebar */}

    <div className="overlay-pop"></div>
    <main id="wrapper">

        {/* Time Local */}
        <div className="tf-header-wrap">
            <a href="index.html" className="logo-site d-lg-none">
                <img className="image-switch" data-light="assets/images/logo/logo.svg" data-dark="assets/images/logo/logo-2.svg" loading="lazy" width="40" height="40" src="/assets/images/logo/logo.svg" alt="Image" />
            </a>
            <div className="left">
                <div className="time-local text-body-3">
                    <p className="date"></p>
                    <p className="clock"></p>
                </div>

            </div>
        </div>
        {/* /Time Local */}

        {/* User Sidebar */}
        <div className="sidebar-user">
            <div className="wrap">
                <div className="user-image">
                    <div className="image">
                        <img loading="lazy" width="468" height="856" src="/assets/images/avatar/andres-sidebar.webp" alt="Andrés Contreras" />
                    </div>
                    <div className="meta-left d-none d-sm-block">
                        <div className="bg-item-svg">
                            <img className="image-switch" data-dark="assets/images/item/vector-user_dark.svg" width="32" height="227" src="/assets/images/item/vector-user.svg" alt="Image" />
                        </div>
                        <p className="avaiable-dot vertical text-body-3 text-black-72 fw-medium">
                            <span className="text-vertical">Disponible para trabajar</span>
                            <span className="dot"></span>
                        </p>
                    </div>
                </div>
                <div className="user-logo d-none d-lg-block">
                    <img className="image-switch" data-light="assets/images/logo/logo.svg" data-dark="assets/images/logo/logo-2.svg" loading="lazy" width="40" height="40" src="/assets/images/logo/logo.svg" alt="Image" />
                </div>
                <ul className="tf-social-icon-2 user-social d-grid">
                    <li><a href="#"><i className="icon icon-x"></i></a></li>
                    <li><a href="#"><i className="icon icon-linkin"></i></a></li>
                    <li><a href="#">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.72">
                                    <path opacity="0.2" d="M1.51502 11.2356L1.55752 4.87313C1.56502 3.72125 2.37065 2.73375 3.48252 2.51375L9.6269 1.29563C11.1031 1.00313 12.4738 2.15813 12.4638 3.6875L12.4213 10.0513C12.4131 11.2025 11.6075 12.1894 10.4956 12.41L4.35127 13.6281C2.87502 13.9206 1.50502 12.7656 1.51502 11.2356Z" fill="black" />
                                    <path opacity="0.5" d="M4.52563 13.7744L4.56813 7.41062C4.575 6.25999 5.38125 5.27312 6.49313 5.05249L12.6375 3.83499C14.1138 3.54249 15.4844 4.69749 15.4744 6.22687L15.4319 12.5906C15.4244 13.7419 14.6188 14.7287 13.5069 14.9494L7.3625 16.1675C5.88625 16.46 4.51563 15.305 4.52563 13.7756V13.7744Z" fill="black" />
                                    <path opacity="0.8" d="M7.53625 16.3125L7.57875 9.94875C7.58625 8.79687 8.39187 7.81062 9.50375 7.59L15.6481 6.37187C17.1244 6.07937 18.495 7.23437 18.485 8.76375L18.4425 15.1275C18.435 16.2794 17.6294 17.2662 16.5175 17.4862L10.3731 18.7044C8.89687 18.9969 7.52625 17.8419 7.53625 16.3125Z" fill="black" />
                                </g>
                            </svg>
                        </a></li>
                </ul>
                <div className="user-info">
                    <p className="avaiable-dot text-body-3 fw-medium d-sm-none">
                        <span className="dot"></span>
                        <span>Disponible para trabajar</span>
                    </p>
                    <h5 className="greeting letter-space--2 text-white animationtext clip">
                        Hola, soy
                        <span className="cd-words-wrapper">
                            <span className="item-text is-visible">Andrés</span>
                            <span className="item-text is-hidden">Full-Stack</span>
                            <span className="item-text is-hidden">Dev con IA</span>
                        </span>
                    </h5>
                    <p className="introduce text-white-56 letter-space--05 text-body-3">
                        Automatizo procesos, construyo agentes con IA y
                        desarrollo software a medida. Desde Medellín, Colombia.
                    </p>
                    <div className="br-line"></div>
                    <div className="action-group">
                        <a href="#contact" className="tf-btn-action scroll-link">
                            <span className="ic-wrap">
                                <i className="icon icon-arrow-right-top"></i>
                            </span>
                            <span className="text text-body-3 letter-space--05 fw-medium">
                                Hablemos
                            </span>
                            <span className="ic-wrap">
                                <i className="icon icon-arrow-right-top"></i>
                            </span>
                        </a>
                        <a href="#" className="action-down">
                            <i className="icon icon-download"></i>
                            <span className="text-body-3">
                                Descargar CV
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        {/* /User Sidebar */}

        <div className="main-content">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7 col-xl-8 ms-auto">
                        <div className="wrap-container">
                            {/* Intro */}
                            <div id="home" className="section-intro flat-spacing">
                                <div className="intro-author effectFade fadeUp no-div">
                                    <div className="author-image">
                                        <img loading="lazy" width="48" height="48" style={{ width: "100%", height: "100%", objectFit: "cover" }} src="/assets/images/avatar/andres-avatar.webp" alt="Andrés Contreras" />
                                    </div>
                                    <div className="author-info letter-space--05">
                                        <p className="info_name text-black">Andrés Contreras</p>
                                        <p className="info_duty text-black-50 text-body-3">Desarrollador Full-Stack · IA aplicada
                                        </p>
                                    </div>
                                </div>
                                <h1 className="intro-title letter-space--2 split-text effect-blur-fade">
                                    Construyo el{" "}
                                    <span className="">software</span><br />
                                    <span className="type-2">y los agentes</span>{" "}
                                    que tu negocio necesita
                                </h1>
                                {/* Diagrama del hero: sustituye al liston decorativo de la
                                    plantilla por lo que realmente hace: sistemas sueltos que
                                    un agente conecta y resuelve. */}
                                <div className="intro-item">
                                    <div
                                        className="flujo"
                                        role="img"
                                        aria-label="Tareas repetitivas, comentarios sin responder, web lenta y mal SEO entran a un agente que devuelve la tarea resuelta"
                                    >
                                        {/* Apaisada. El texto del SVG escala con el viewBox, asi que en
                                            movil quedaria a unos 8px: por eso hay una version aparte. */}
                                        <svg className="flujo__ancho d-none d-md-block" viewBox="0 0 708 293" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {PROBLEMAS.map((texto, i) => {
                                                const y = 40 + i * 68;
                                                return (
                                                    <g key={texto} className="flujo__origen" style={{ animationDelay: `${i * 0.35}s` }}>
                                                        <rect className="flujo__chip" x="6" y={y - 20} width="250" height="40" rx="20" />
                                                        <circle className="flujo__punto" cx="32" cy={y} r="5" />
                                                        <text className="flujo__etiqueta" x="50" y={y + 5}>{texto}</text>
                                                        <path className="flujo__linea" d={`M256 ${y} C 320 ${y}, 330 142, 368 142`} />
                                                    </g>
                                                );
                                            })}
                                            <circle className="flujo__onda" cx="420" cy="142" r="52" />
                                            <circle className="flujo__halo" cx="420" cy="142" r="52" />
                                            <g className="flujo__marca" transform="translate(394,116) scale(1.3)">
                                                <path className="flujo__marcaCuerpo" d="M27 2L40 32L33.5 32L27 17L10.6 40L0 40Z" />
                                                <path className="flujo__marcaRanura" d="M13.1 21.56L20.18 26.59L18.68 28.71L11.6 23.68Z" />
                                                <path className="flujo__marcaRanura" d="M7.31 29.71L14.39 34.74L12.89 36.86L5.81 31.83Z" />
                                            </g>
                                            <text className="flujo__pie" x="420" y="222" textAnchor="middle">agente</text>
                                            <path className="flujo__linea" d="M472 142 C 500 142, 510 142, 534 142" />
                                            <rect className="flujo__salida" x="534" y="120" width="164" height="44" rx="22" />
                                            <text className="flujo__salidaTexto" x="616" y="147" textAnchor="middle">resuelto</text>
                                        </svg>

                                        {/* Apilada, para pantallas estrechas. */}
                                        <svg className="flujo__alto d-md-none" viewBox="0 0 360 430" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {PROBLEMAS.map((texto, i) => {
                                                const y = 26 + i * 52;
                                                return (
                                                    <g key={texto} className="flujo__origen" style={{ animationDelay: `${i * 0.35}s` }}>
                                                        <rect className="flujo__chip" x="10" y={y - 18} width="340" height="36" rx="18" />
                                                        <circle className="flujo__punto" cx="34" cy={y} r="5" />
                                                        <text className="flujo__etiqueta" x="52" y={y + 5}>{texto}</text>
                                                    </g>
                                                );
                                            })}
                                            <path className="flujo__linea" d="M180 216 L180 270" />
                                            <circle className="flujo__onda" cx="180" cy="318" r="44" />
                                            <circle className="flujo__halo" cx="180" cy="318" r="44" />
                                            <g className="flujo__marca" transform="translate(158,296) scale(1.1)">
                                                <path className="flujo__marcaCuerpo" d="M27 2L40 32L33.5 32L27 17L10.6 40L0 40Z" />
                                                <path className="flujo__marcaRanura" d="M13.1 21.56L20.18 26.59L18.68 28.71L11.6 23.68Z" />
                                                <path className="flujo__marcaRanura" d="M7.31 29.71L14.39 34.74L12.89 36.86L5.81 31.83Z" />
                                            </g>
                                            <path className="flujo__linea" d="M180 362 L180 392" />
                                            <rect className="flujo__salida" x="112" y="392" width="136" height="36" rx="18" />
                                            <text className="flujo__salidaTexto" x="180" y="415" textAnchor="middle">resuelto</text>
                                        </svg>
                                    </div>
                                </div>
                                <div className="box-counter effectFade fadeUp no-div">
                                    <div className="wg-counter">
                                        <p className="counter h1 d-flex font-2 letter-space--2">
                                            <span className="number" data-speed="1000" data-to="5">0</span>
                                            +
                                        </p>
                                        <p className="text text-black-56 text-body-3">
                                            Años construyendo software
                                        </p>
                                    </div>
                                    <div className="wg-counter">
                                        <p className="counter h1 d-flex font-2 letter-space--2">
                                            <span className="number" data-speed="1000" data-to="4">0</span>
                                        </p>
                                        <p className="text text-black-56 text-body-3">
                                            Proyectos en producción
                                        </p>
                                    </div>
                                </div>

                                <p className="intro-client letter-space--05 text-body-3">
                                    <i className="icon icon-global-elip"></i>
                                    Donde he trabajado
                                </p>

                                <div className="infiniteSlide-brand">
                                    <div className="infiniteSlide" data-clone="3">
                                        {/* Clone 1 */}
                                        <div className="image-brand">
                                            <img className="image-switch" data-dark="assets/images/brand/smark7_dark.png" width="137" height="32" src="/assets/images/brand/smark7.png" alt="Smark7" />
                                        </div>
                                        <div className="image-brand">
                                            <img className="image-switch" data-dark="assets/images/brand/uniremington_dark.svg" width="119" height="32" src="/assets/images/brand/uniremington.svg" alt="Uniremington" />
                                        </div>
                                        {/* Clone 2 */}
                                        <div className="image-brand">
                                            <img className="image-switch" data-dark="assets/images/brand/smark7_dark.png" width="137" height="32" src="/assets/images/brand/smark7.png" alt="Smark7" />
                                        </div>
                                        <div className="image-brand">
                                            <img className="image-switch" data-dark="assets/images/brand/uniremington_dark.svg" width="119" height="32" src="/assets/images/brand/uniremington.svg" alt="Uniremington" />
                                        </div>
                                        {/* Clone 3 */}
                                        <div className="image-brand">
                                            <img className="image-switch" data-dark="assets/images/brand/smark7_dark.png" width="137" height="32" src="/assets/images/brand/smark7.png" alt="Smark7" />
                                        </div>
                                        <div className="image-brand">
                                            <img className="image-switch" data-dark="assets/images/brand/uniremington_dark.svg" width="119" height="32" src="/assets/images/brand/uniremington.svg" alt="Uniremington" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Intro */}

                            {/* About */}
                            <div id="about" className="section-about flat-spacing">
                                <div className="sect-tag text-caption fw-medium effectFade fadeUp no-div">
                                    <i className="icon icon-user-circle"></i>
                                    Sobre mí
                                </div>
                                <h4 className="s-title letter-space--2 text-black-72 split-text effect-blur-fade">
                                    Automatizo procesos, construyo <br className="d-none d-lg-block" />
                                    agentes con IA y desarrollo el <br className="d-none d-lg-block" />
                                    software que un negocio necesita
                                </h4>
                                <p className="s-desc text-black-56 scrolling-effect effectTop">
                                    Soy de Lorica, Córdoba, y hoy trabajo desde Medellín. Empecé haciendo<br className="d-none d-lg-block" />
                                    sitios web a mano en Barranquilla y terminé construyendo plataformas<br className="d-none d-lg-block" />
                                    completas, integraciones entre sistemas y agentes con IA. <br />
                                    <br />
                                    No llego preguntando qué tecnología quiero usar. Llego preguntando qué<br className="d-none d-lg-block" />
                                    problema hay que resolver, y después elijo con qué. Cada proyecto de<br className="d-none d-lg-block" />
                                    esta lista está en producción, con usuarios reales usándolo.
                                </p>
                                <ul className="award-list">
                                    <li className="award-item">
                                        <div className="left">
                                            <h6 className="award_name letter-space--2 text-black-72">Uniremington</h6>
                                            <p className="award_desc text-black-56">Migración de WordPress a un stack propio</p>
                                        </div>
                                        <h6 className="award_year text-black-72">
                                            Node.js
                                        </h6>
                                    </li>
                                    <li className="award-item">
                                        <div className="left">
                                            <h6 className="award_name letter-space--2 text-black-72">Scentual Bliss</h6>
                                            <p className="award_desc text-black-56">Tienda en línea con más de 150 fragancias</p>
                                        </div>
                                        <h6 className="award_year text-black-72">
                                            E-commerce
                                        </h6>
                                    </li>
                                    <li className="award-item">
                                        <div className="left">
                                            <h6 className="award_name letter-space--2 text-black-72">RemiTransfer</h6>
                                            <p className="award_desc text-black-56">Transferencia de archivos sin límite de tamaño</p>
                                        </div>
                                        <h6 className="award_year text-black-72">
                                            Interno
                                        </h6>
                                    </li>
                                    <li className="award-item">
                                        <div className="left">
                                            <h6 className="award_name letter-space--2 text-black-72">Remi</h6>
                                            <p className="award_desc text-black-56">Asistente de orientación para estudiantes</p>
                                        </div>
                                        <h6 className="award_year text-black-72">
                                            Claude API
                                        </h6>
                                    </li>
                                </ul>
                            </div>
                            {/* /About */}

                            {/* Education & Experience */}
                            <div id="education" className="section-education-experience flat-spacing">
                                <div className="sect-tag text-caption fw-medium effectFade fadeUp no-div">
                                    <i className="icon icon-edu"></i>
                                    Formación y experiencia
                                </div>
                                <div className="timeline scroll-down">
                                    <div className="timeline-line">
                                        <div className="prg-line"></div>
                                    </div>
                                    {/* Item 1 */}
                                    <div className="timeline-item effectFade fadeUp no-div">
                                        <p className="timeline-date text-black-56">2026 - Hoy</p>
                                        <div className="timeline-dot"></div>
                                        <div className="timeline-content">
                                            <div className="icon">
                                                <img loading="lazy" width="32" height="32" src="/assets/images/brand/uniremington-seal.svg" alt="Uniremington" />
                                            </div>
                                            <p className="timeline-role fw-medium text-black-72">Desarrollador Full-Stack en
                                                Uniremington</p>
                                            <p className="timeline-desc text-body-3 text-black-56">
                                                Migré el sitio de WordPress a un stack propio en Node.js sin perder
                                                contenido ni SEO, y construí herramientas internas para los equipos:
                                                transferencia de archivos y un asistente con la API de Claude.
                                            </p>
                                        </div>
                                    </div>
                                    {/* Item 2 */}
                                    <div className="timeline-item effectFade fadeUp no-div">
                                        <p className="timeline-date text-black-56">2025 - 2026</p>
                                        <div className="timeline-dot"></div>
                                        <div className="timeline-content">
                                            <div className="icon">
                                                <img className="image-switch" data-dark="assets/images/logo/logo-4.svg" loading="lazy" width="32" height="32" src="/assets/images/logo/logo-3.svg" alt="Andrés Contreras" />
                                            </div>
                                            <p className="timeline-role fw-medium text-black-72">Desarrollador independiente
                                                </p>
                                            <p className="timeline-desc text-body-3 text-black-56">
                                                Trabajé por mi cuenta para agencias de Bogotá y clientes propios:
                                                tiendas en línea a medida, integraciones y automatizaciones. De ahí
                                                salió Scentual Bliss, con más de 150 fragancias en producción.
                                            </p>
                                        </div>
                                    </div>
                                    {/* Item 3 */}
                                    <div className="timeline-item effectFade fadeUp no-div">
                                        <p className="timeline-date text-black-56">2018 - 2023</p>
                                        <div className="timeline-dot"></div>
                                        <div className="timeline-content">
                                            <div className="icon">
                                                <img className="image-switch" data-dark="assets/images/brand/unicordoba_dark.png" loading="lazy" width="116" height="32" src="/assets/images/brand/unicordoba.png" alt="Universidad de Córdoba" />
                                            </div>
                                            <p className="timeline-role fw-medium text-black-72">Ingeniería de Sistemas,
                                                Universidad de Córdoba</p>
                                            <p className="timeline-desc text-body-3 text-black-56">
                                                En paralelo hice mis primeros dos años como diseñador y desarrollador
                                                web en Barranquilla, construyendo sitios a mano, sin asistencia de IA.
                                                Ahí aprendí a resolver con lo que hubiera a la mano.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Education & Experience */}

                            {/* Work Highlight */}
                            <div id="work" className="section-work flat-spacing">
                                <div className="sect-tag text-caption fw-medium">
                                    <i className="icon icon-high-light"></i>
                                    Proyectos
                                </div>
                                <div className="work-list element-sticky">
                                    <div className="sticky-item">
                                        <div className="wg-work">
                                            <div className="work-image">
                                                <img loading="lazy" width="700" height="427" src="/assets/images/section/work-1.jpg" alt="Image" />
                                            </div>
                                            <div className="wrap">
                                                <div className="work-content">
                                                    <div className="w-image">
                                                        <img loading="lazy" width="468" height="856" src="/assets/images/section/work-1-portrait.jpg" alt="Image" />
                                                    </div>
                                                    <div className="content">
                                                        <div className="content-top">
                                                            <div className="w-logo">
                                                                <img loading="lazy" width="40" height="40" src="/assets/images/brand/uniremington-seal.svg" alt="Uniremington" />
                                                            </div>
                                                            <h4 className="w-title letter-space--2 text-white-72">
                                                                Uniremington
                                                            </h4>
                                                            <p className="w-desc text-white-56 text-body-3">
                                                                Migración del sitio de una universidad con sedes en todo
                                                                el país, de WordPress a un stack propio en Node.js, sin
                                                                perder contenido ni posicionamiento
                                                            </p>
                                                            <div className="w-highlight">
                                                                <div className="box-high">
                                                                    <p className="text-body-3 text-white-56">
                                                                        Año
                                                                    </p>
                                                                    <p className="text-body-1 text-white-72">
                                                                        2026
                                                                    </p>
                                                                </div>
                                                                <div className="box-high">
                                                                    <p className="text-body-3 text-white-56">
                                                                        Rol
                                                                    </p>
                                                                    <p className="text-body-1 text-white-72">
                                                                        Desarrollo completo
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="w-tag-list">
                                                                <div className="tag">
                                                                    <span className="text-body-3 fw-medium text-white-72">
                                                                        Migración
                                                                    </span>
                                                                </div>
                                                                <div className="tag">
                                                                    <span className="text-body-3 fw-medium text-white-72">
                                                                        Node.js
                                                                    </span>
                                                                </div>
                                                                <div className="tag">
                                                                    <span className="text-body-3 fw-medium text-white-72">
                                                                        SEO
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="content-bottom">
                                                            <div className="br-line"></div>
                                                            <div className="group-action">
                                                                <a href="#" className="tf-btn-action style-white">
                                                                    <span className="ic-wrap">
                                                                        <i className="icon icon-arrow-right-top"></i>
                                                                    </span>
                                                                    <span className="text text-body-3 letter-space--05 fw-medium">
                                                                        Ver proyecto
                                                                    </span>
                                                                    <span className="ic-wrap">
                                                                        <i className="icon icon-arrow-right-top"></i>
                                                                    </span>
                                                                </a>
                                                                <p className="text-white-40">
                                                                    <span className="text-white-72">01</span> / 03
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sticky-item">
                                        <div className="wg-work">
                                            <div className="work-image">
                                                <img loading="lazy" width="700" height="427" src="/assets/images/section/work-2.jpg" alt="Image" />
                                            </div>
                                            <div className="wrap">
                                                <div className="work-content">
                                                    <div className="w-image">
                                                        <img loading="lazy" width="468" height="856" src="/assets/images/section/work-2-portrait.png" alt="Image" />
                                                    </div>
                                                    <div className="content">
                                                        <div className="content-top">
                                                            <div className="w-logo">
                                                                <img loading="lazy" width="29" height="40" src="/assets/images/brand/scentualbliss-icon.png" alt="Scentual Bliss" />
                                                            </div>
                                                            <h4 className="w-title letter-space--2 text-white-72">
                                                                Scentual Bliss
                                                            </h4>
                                                            <p className="w-desc text-white-56 text-body-3">
                                                                Tienda en línea completa con más de 150 fragancias:
                                                                catálogo, checkout, cuentas y correos transaccionales
                                                            </p>
                                                            <div className="w-highlight">
                                                                <div className="box-high">
                                                                    <p className="text-body-3 text-white-56">
                                                                        Año
                                                                    </p>
                                                                    <p className="text-body-1 text-white-72">
                                                                        2025
                                                                    </p>
                                                                </div>
                                                                <div className="box-high">
                                                                    <p className="text-body-3 text-white-56">
                                                                        Rol
                                                                    </p>
                                                                    <p className="text-body-1 text-white-72">
                                                                        Desarrollo completo
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="w-tag-list">
                                                                <div className="tag">
                                                                    <span className="text-body-3 fw-medium text-white-72">
                                                                        E-commerce
                                                                    </span>
                                                                </div>
                                                                <div className="tag">
                                                                    <span className="text-body-3 fw-medium text-white-72">
                                                                        Checkout
                                                                    </span>
                                                                </div>
                                                                <div className="tag">
                                                                    <span className="text-body-3 fw-medium text-white-72">
                                                                        Catálogo
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="content-bottom">
                                                            <div className="br-line"></div>
                                                            <div className="group-action">
                                                                <a href="#" className="tf-btn-action style-white">
                                                                    <span className="ic-wrap">
                                                                        <i className="icon icon-arrow-right-top"></i>
                                                                    </span>
                                                                    <span className="text text-body-3 letter-space--05 fw-medium">
                                                                        Ver proyecto
                                                                    </span>
                                                                    <span className="ic-wrap">
                                                                        <i className="icon icon-arrow-right-top"></i>
                                                                    </span>
                                                                </a>
                                                                <p className="text-white-40">
                                                                    <span className="text-white-72">02</span> / 03
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sticky-item">
                                        <div className="wg-work">
                                            <div className="work-image">
                                                <img loading="lazy" width="700" height="427" src="/assets/images/section/work-3.jpg" alt="Image" />
                                            </div>
                                            <div className="wrap">
                                                <div className="work-content">
                                                    <div className="w-image">
                                                        <img loading="lazy" width="468" height="856" src="/assets/images/section/work-3.jpg" alt="Image" />
                                                    </div>
                                                    <div className="content">
                                                        <div className="content-top">
                                                            <div className="w-logo">
                                                                <img loading="lazy" width="40" height="40" src="/assets/images/brand/uniremington-seal.svg" alt="Uniremington" />
                                                            </div>
                                                            <h4 className="w-title letter-space--2 text-white-72">
                                                                RemiTransfer
                                                            </h4>
                                                            <p className="w-desc text-white-56 text-body-3">
                                                                Herramienta interna para transferir archivos sin límite
                                                                de tamaño entre los equipos de la universidad
                                                            </p>
                                                            <div className="w-highlight">
                                                                <div className="box-high">
                                                                    <p className="text-body-3 text-white-56">
                                                                        Año
                                                                    </p>
                                                                    <p className="text-body-1 text-white-72">
                                                                        2026
                                                                    </p>
                                                                </div>
                                                                <div className="box-high">
                                                                    <p className="text-body-3 text-white-56">
                                                                        Rol
                                                                    </p>
                                                                    <p className="text-body-1 text-white-72">
                                                                        Herramienta interna
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="w-tag-list">
                                                                <div className="tag">
                                                                    <span className="text-body-3 fw-medium text-white-72">
                                                                        Node.js
                                                                    </span>
                                                                </div>
                                                                <div className="tag">
                                                                    <span className="text-body-3 fw-medium text-white-72">
                                                                        Archivos
                                                                    </span>
                                                                </div>
                                                                <div className="tag">
                                                                    <span className="text-body-3 fw-medium text-white-72">
                                                                        Interno
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="content-bottom">
                                                            <div className="br-line"></div>
                                                            <div className="group-action">
                                                                <a href="#" className="tf-btn-action style-white">
                                                                    <span className="ic-wrap">
                                                                        <i className="icon icon-arrow-right-top"></i>
                                                                    </span>
                                                                    <span className="text text-body-3 letter-space--05 fw-medium">
                                                                        Ver proyecto
                                                                    </span>
                                                                    <span className="ic-wrap">
                                                                        <i className="icon icon-arrow-right-top"></i>
                                                                    </span>
                                                                </a>
                                                                <p className="text-white-40">
                                                                    <span className="text-white-72">03</span> / 03
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Work Highlight */}

                            {/* Service */}
                            <div id="service" className="section-service flat-spacing">
                                <div className="sect-tag text-caption fw-medium effectFade fadeUp no-div mb-0">
                                    <i className="icon icon-service"></i>
                                    Servicios
                                </div>
                                <div className="" id="accordion-service">
                                    <div className="service-accordion_item scrolling-effect effectBottom" role="presentation">
                                        <div className="accordion-action" data-bs-target="#service-1" role="button" data-bs-toggle="collapse" aria-controls="service-1" aria-expanded="true">
                                            <h4 className="text letter-space--2 text-black-72">Automatización de procesos</h4>
                                            <div className="ic-wrap">
                                                <span className="ic-accordion-custom"></span>
                                            </div>
                                        </div>
                                        <div id="service-1" className="collapse show" data-bs-parent="#accordion-service">
                                            <div className="accordion-content">
                                                <div className="service-tag">
                                                    <span className="tag-item text-body-3 fw-medium text-black-72">
                                                        Integraciones por API
                                                    </span>
                                                    <span className="tag-item text-body-3 fw-medium text-black-72">
                                                        Sincronización de datos
                                                    </span>
                                                    <span className="tag-item text-body-3 fw-medium text-black-72">
                                                        Tareas programadas
                                                    </span>
                                                </div>
                                                <p className="service-desc text-black-56">
                                                    Conecto por API los sistemas que hoy no se hablan y le quito a tu
                                                    equipo el trabajo repetitivo: sincronizar datos entre plataformas,
                                                    generar reportes y disparar tareas sin que nadie se acuerde.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="br-line scrolling-effect effectBottom"></div>
                                    <div className="service-accordion_item scrolling-effect effectBottom" role="presentation">
                                        <div className="accordion-action collapsed" data-bs-target="#service-2" role="button" data-bs-toggle="collapse" aria-controls="service-2" aria-expanded="true">
                                            <h4 className="text letter-space--2 text-black-72">Agentes con IA</h4>
                                            <div className="ic-wrap">
                                                <span className="ic-accordion-custom"></span>
                                            </div>
                                        </div>
                                        <div id="service-2" className="collapse" data-bs-parent="#accordion-service">
                                            <div className="accordion-content">
                                                <div className="service-tag">
                                                    <span className="tag-item text-body-3 fw-medium text-black-72">
                                                        API de Claude
                                                    </span>
                                                    <span className="tag-item text-body-3 fw-medium text-black-72">
                                                        Herramientas propias
                                                    </span>
                                                    <span className="tag-item text-body-3 fw-medium text-black-72">
                                                        Contexto del negocio
                                                    </span>
                                                </div>
                                                <p className="service-desc text-black-56">
                                                    Agentes que leen tus datos, deciden y actúan sobre tus propios
                                                    sistemas con herramientas que les construyo. No un chatbot de
                                                    vitrina: algo que ejecuta tareas de punta a punta.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="br-line scrolling-effect effectBottom"></div>
                                    <div className="service-accordion_item scrolling-effect effectBottom" role="presentation">
                                        <div className="accordion-action collapsed" data-bs-target="#service-3" role="button" data-bs-toggle="collapse" aria-controls="service-3" aria-expanded="true">
                                            <h4 className="text letter-space--2 text-black-72">Software a medida</h4>
                                            <div className="ic-wrap">
                                                <span className="ic-accordion-custom"></span>
                                            </div>
                                        </div>
                                        <div id="service-3" className="collapse" data-bs-parent="#accordion-service">
                                            <div className="accordion-content">
                                                <div className="service-tag">
                                                    <span className="tag-item text-body-3 fw-medium text-black-72">
                                                        Plataformas internas
                                                    </span>
                                                    <span className="tag-item text-body-3 fw-medium text-black-72">
                                                        Paneles de gestión
                                                    </span>
                                                    <span className="tag-item text-body-3 fw-medium text-black-72">
                                                        Migraciones
                                                    </span>
                                                </div>
                                                <p className="service-desc text-black-56">
                                                    Plataformas completas desde cero: paneles de gestión, aplicaciones
                                                    internas, tiendas en línea y migraciones desde sistemas legados.
                                                    Sobre el stack que le convenga al proyecto, no al que yo prefiera.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Service */}

                            {/* Tech Stack */}
                            <div id="tech" className="section-tech-stack flat-spacing">
                                <div className="sect-tag text-caption fw-medium effectFade fadeUp no-div">
                                    <i className="icon icon-tech-stack"></i>
                                    Stack
                                </div>
                                <h4 className="s-title letter-space--2 text-black-72 split-text effect-blur-fade">
                                    Las herramientas con las que <br className="d-none d-sm-block" />
                                    trabajo todos los días
                                </h4>
                                <ul className="tech-list">
                                    <li className="wg-tech">
                                        <div className="tech-infor effectFade fadeUp no-div">
                                            <div className="tech_image">
                                                <img className="image-switch" data-dark="assets/images/section/stack/react_dark.svg" loading="lazy" width="28" height="28" src="/assets/images/section/stack/react.svg" alt="React" />
                                                <img className="image-switch" data-dark="assets/images/section/stack/nextjs_dark.svg" loading="lazy" width="28" height="28" src="/assets/images/section/stack/nextjs.svg" alt="Next.js" />
                                            </div>
                                            <div className="tech_info">
                                                <p className="info__name fw-medium text-black-72">React · Next.js</p>
                                                <p className="info__duty text-black-56 text-body-3">Interfaces y aplicaciones web</p>
                                            </div>
                                        </div>
                                        <div className="tech-progress">
                                            <div className="progress-line" data-progress="80">
                                                <p className="progress-num text-caption">
                                                    <span className="counter">
                                                        <span className="number" data-speed="1500" data-to="80">10</span>
                                                        %
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="br-line"></li>
                                    <li className="wg-tech">
                                        <div className="tech-infor effectFade fadeUp no-div">
                                            <div className="tech_image">
                                                <img className="image-switch" data-dark="assets/images/section/stack/nodejs_dark.svg" loading="lazy" width="28" height="28" src="/assets/images/section/stack/nodejs.svg" alt="Node.js" />
                                                <img className="image-switch" data-dark="assets/images/section/stack/php_dark.svg" loading="lazy" width="28" height="28" src="/assets/images/section/stack/php.svg" alt="PHP" />
                                                <img className="image-switch" data-dark="assets/images/section/stack/python_dark.svg" loading="lazy" width="28" height="28" src="/assets/images/section/stack/python.svg" alt="Python" />
                                            </div>
                                            <div className="tech_info">
                                                <p className="info__name fw-medium text-black-72">Node.js · PHP · Python</p>
                                                <p className="info__duty text-black-56 text-body-3">Servidor, APIs e integraciones
                                                </p>
                                            </div>
                                        </div>
                                        <div className="tech-progress">
                                            <div className="progress-line" data-progress="90">
                                                <p className="progress-num text-caption">
                                                    <span className="counter">
                                                        <span className="number" data-speed="1500" data-to="90">10</span>
                                                        %
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="br-line"></li>
                                    <li className="wg-tech">
                                        <div className="tech-infor effectFade fadeUp no-div">
                                            <div className="tech_image">
                                                <img className="image-switch" data-dark="assets/images/section/stack/supabase_dark.svg" loading="lazy" width="28" height="28" src="/assets/images/section/stack/supabase.svg" alt="Supabase" />
                                                <img className="image-switch" data-dark="assets/images/section/stack/claude_dark.svg" loading="lazy" width="28" height="28" src="/assets/images/section/stack/claude.svg" alt="Claude" />
                                            </div>
                                            <div className="tech_info">
                                                <p className="info__name fw-medium text-black-72">Supabase · API de Claude</p>
                                                <p className="info__duty text-black-56 text-body-3">Base de datos y agentes con IA
                                                </p>
                                            </div>
                                        </div>
                                        <div className="tech-progress">
                                            <div className="progress-line" data-progress="60">
                                                <p className="progress-num text-caption">
                                                    <span className="counter">
                                                        <span className="number" data-speed="1500" data-to="60">10</span>
                                                        %
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            {/* /Tech Stack */}

                            {/* Certificaciones */}
                            <div id="certificaciones" className="section-certificaciones flat-spacing">
                                <div className="sect-tag text-caption fw-medium effectFade fadeUp no-div">
                                    <i className="icon icon-edu"></i>
                                    Certificaciones
                                </div>
                                <h4 className="s-title letter-space--2 text-black-72 split-text effect-blur-fade">
                                    Formación certificada, <br className="d-none d-sm-block" />
                                    verificable en la fuente
                                </h4>
                                <ul className="cert-list">
                                    {CERTIFICACIONES.map((cert) => (
                                        <li key={cert.id} className="cert-item effectFade fadeUp no-div">
                                            <button
                                                type="button"
                                                className="cert-lamina"
                                                onClick={() => setCertAbierta(cert)}
                                                aria-label={`Ampliar el certificado: ${cert.titulo}`}
                                            >
                                                <img loading="lazy" src={cert.imagen} alt={`${cert.titulo}, ${cert.emisor}`} />
                                                <span className="cert-lupa" aria-hidden="true">Ampliar</span>
                                            </button>
                                            <p className="cert-titulo fw-medium text-black-72">{cert.titulo}</p>
                                            <p className="cert-detalle text-black-56 text-body-3">
                                                {cert.emisor} · {cert.detalle}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* /Certificaciones */}

                            {/* Seccion de testimonios retirada: la plantilla traia citas de
                                personas inventadas. Se repondra cuando haya recomendaciones reales. */}

                            {/* Contact */}
                            <div id="contact" className="section-contact flat-spacing">
                                <div className="sect-tag text-caption fw-medium effectFade fadeUp no-div">
                                    <i className="icon icon-send"></i>
                                    Contacto
                                </div>
                                <h4 className="s-title letter-space--2 split-text effect-blur-fade">
                                    Cuéntame qué tienes hoy, qué <br className="d-none d-lg-block" />
                                    quieres lograr y para cuándo. <br className="d-none d-lg-block" />
                                    Entre más contexto, mejor te respondo
                                </h4>
                                <form className="form-contact" id="contactform" action="/api/contacto" method="post" noValidate>
                                    {/* Trampa para robots: oculta, una persona no la rellena. */}
                                    <input type="text" name="website" tabIndex={-1} autoComplete="off" className="visually-hidden" aria-hidden="true" />
                                    <div className="form-content effectFade fadeUp no-div">
                                        <fieldset className="field-ip">
                                            <label htmlFor="name" className="field-label">Nombre <span className="req">*</span></label>
                                            <input type="text" name="name" id="name" autoComplete="name" placeholder="Cómo te llamas" required data-msg-required="Dime cómo te llamas" />
                                        </fieldset>
                                        <fieldset className="field-ip">
                                            <label htmlFor="email" className="field-label">Correo <span className="req">*</span></label>
                                            <input type="email" name="email" id="email" autoComplete="email" placeholder="Dónde te respondo" required data-msg-required="Necesito un correo para responderte" data-msg-email="Ese correo no parece válido" />
                                        </fieldset>
                                        <fieldset className="field-ip field-full">
                                            <label htmlFor="message" className="field-label">Tu proyecto</label>
                                            <textarea name="message" id="message" rows={4} placeholder="Qué tienes hoy, qué quieres lograr y para cuándo"></textarea>
                                        </fieldset>
                                    </div>
                                    <div className="form-action effectFade fadeUp no-div">
                                        <div className="send-wrap">
                                            <button type="submit" className="tf-btn animate-btn animate-dark">
                                                <span className="text-body-3">
                                                    Enviar
                                                </span>
                                            </button>
                                        </div>
                                        <a href={`mailto:${CORREO_CONTACTO}`} className="text-body-1 link letter-space--2 text-black-72">
                                            {CORREO_CONTACTO}
                                        </a>
                                    </div>
                                </form>
                            </div>
                            {/* /Contact */}

                            {/* Footer */}
                            <div id="footer" className="tf-footer flat-spacing">
                                <div className="block-quote effectFade fadeUp no-div">
                                    <h5 className="quote-text font-3 fw-normal text-black-72">
                                        <span className="text-black-56">“</span>
                                        Cuando un negocio me cuenta su problema, no pienso primero en qué
                                        tecnología quiero usar. Pienso en cómo sacarlo adelante.
                                        <span className="text-black-56">“</span>
                                    </h5>
                                    <p className="quote-author font-3 text-black-56 h6 text-end ">
                                        Andrés Contreras
                                    </p>
                                </div>
                                <div className="br-line"></div>
                                <div className="foot-inner">
                                    <p className="h1 font-2 letter-space--2 text-black-72">contreras.dev</p>
                                    <a href="#home" className="f-logo">
                                        <div className="logo">
                                            <img className="image-switch" data-light="assets/images/logo/logo.svg" data-dark="assets/images/logo/logo-2.svg" loading="lazy" width="32" height="32" src="/assets/images/logo/logo.svg" alt="Image" />
                                        </div>
                                    </a>
                                </div>
                                <div className="foot-bottom">
                                    <p className="text-nocopy text-black-56">
                                        Todos los derechos reservados <br />
                                        © 2026 Andrés Contreras
                                    </p>
                                </div>
                            </div>
                            {/* /Footer */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    {/* Javascript */}
    
    
    
    
    
    {/*  */}
    
    
    
    
    
    
    
    

    
    
    
    {certAbierta && (
      <VisorCertificado cert={certAbierta} alCerrar={() => setCertAbierta(null)} />
    )}
    </>
  );
};

export default PortadaIsak;
