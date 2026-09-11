-- Cuatro artículos base optimizados para SEO y para motores de respuesta (GEO).
-- Se usan dólar-comillas ($html$) para no tener que escapar el HTML.
-- Reejecutable: si el slug ya existe, actualiza el contenido en vez de duplicar.

insert into public.blog_posts (title, slug, category, author, image, read_time, date, status, content)
values

-- ─────────────────────────────────────────────────────────────── 1
(
  'Cómo migrar un sitio de WordPress sin perder el SEO',
  'migrar-wordpress-sin-perder-seo',
  'Migraciones',
  'Andrés Contreras',
  '/images/blog/migraciones.svg',
  '6 min de lectura',
  '2026-08-14',
  'published',
$html$
<p><strong>Para migrar un sitio de WordPress sin perder posicionamiento hay que conservar tres cosas: las URLs, el contenido indexado y las señales técnicas.</strong> Si una URL antigua cambia de dirección, necesita una redirección 301 hacia su equivalente. Si desaparece sin redirección, Google pierde el rastro y el tráfico que llegaba a esa página se cae.</p>

<h2>En resumen</h2>
<ul>
  <li>Inventaría todas las URLs indexadas <em>antes</em> de tocar nada.</li>
  <li>Mantén la misma estructura de URLs siempre que puedas.</li>
  <li>Redirige con 301 (permanente), nunca con 302, lo que sí cambie.</li>
  <li>Conserva los títulos, meta descripciones y encabezados de cada página.</li>
  <li>Migra en un entorno de pruebas y compara antes de publicar.</li>
</ul>

<h2>¿Por qué una migración hace caer el tráfico?</h2>
<p>Casi nunca es por el cambio de tecnología. Es por lo que se pierde en el camino: URLs que cambian sin avisar, páginas que no se copiaron, encabezados que se reescribieron, imágenes que quedaron sin texto alternativo, o un <code>robots.txt</code> de pruebas que se publicó bloqueando el sitio entero.</p>
<p>Ese último caso es más común de lo que parece. Un entorno de staging suele llevar <code>Disallow: /</code> para que no se indexe, y si ese archivo viaja al servidor de producción, el sitio desaparece de los resultados en cuestión de días.</p>

<h2>¿Qué hay que inventariar antes de empezar?</h2>
<p>Antes de mover una sola página, necesitas saber qué tienes. El inventario mínimo:</p>
<ol>
  <li><strong>Las URLs indexadas.</strong> Search Console te da las que Google conoce; un rastreo del sitio te da las que existen.</li>
  <li><strong>Las páginas con tráfico.</strong> No todas valen lo mismo. Las 20 que traen el 80 % de las visitas son las que no puedes equivocarte.</li>
  <li><strong>Los enlaces entrantes.</strong> Las páginas que otros sitios enlazan son las más caras de recuperar si se rompen.</li>
  <li><strong>Los metadatos.</strong> Título y meta descripción de cada página que importe.</li>
</ol>

<h2>¿Redirecciones 301 o 302?</h2>
<p><strong>301 para una migración, siempre.</strong> Una redirección 301 le dice al buscador que el cambio es permanente y que debe transferir la autoridad de la URL vieja a la nueva. Una 302 indica algo temporal, así que el buscador mantiene indexada la dirección original y no traslada esas señales.</p>
<p>Usar 302 en una migración es uno de los errores que más caro sale, porque el sitio parece funcionar perfecto para un visitante humano y el problema solo se nota semanas después, cuando el tráfico ya cayó.</p>

<h2>¿Cómo sé si la migración salió bien?</h2>
<p>Estas son las señales que conviene vigilar durante las primeras semanas:</p>
<ul>
  <li><strong>Cobertura en Search Console.</strong> Un pico de errores 404 significa redirecciones faltantes.</li>
  <li><strong>Páginas indexadas.</strong> Debería mantenerse estable, no desplomarse.</li>
  <li><strong>Tráfico orgánico por página.</strong> Compáralo página por página, no solo el total: el agregado puede ocultar que tus mejores páginas se cayeron.</li>
  <li><strong>Core Web Vitals.</strong> Si el sitio nuevo es más rápido, esto debería mejorar.</li>
</ul>
<p>Es normal ver una fluctuación de unos días mientras el buscador reprocesa el sitio. Lo que no es normal es una caída sostenida después de tres o cuatro semanas: eso indica que algo quedó mal y hay que revisarlo.</p>

<h2>¿Cuándo conviene migrar y cuándo no?</h2>
<p>Migrar tiene sentido cuando la plataforma actual te está frenando: no puedes hacer cambios sin romper algo, el sitio es lento y no hay margen para mejorarlo, o dependes de plugins que ya nadie mantiene. Es una decisión de negocio, no de moda tecnológica.</p>
<p>Si el problema es solo velocidad o seguridad, muchas veces se arregla sin reconstruir nada. Reconstruir un sitio que funciona bien es gastar presupuesto en el problema equivocado.</p>

<h2>Preguntas frecuentes</h2>

<h3>¿Cuánto tarda en recuperarse el tráfico tras una migración?</h3>
<p>Si las redirecciones están bien hechas, el tráfico suele estabilizarse entre dos y seis semanas. Si después de dos meses sigue por debajo, el problema no es el tiempo: hay algo técnico sin resolver.</p>

<h3>¿Puedo cambiar las URLs durante la migración?</h3>
<p>Puedes, pero es un riesgo extra. Si necesitas reestructurar las URLs, conviene hacerlo en una fase separada de la migración, para que si algo falla sepas cuál de los dos cambios lo causó.</p>

<h3>¿Se pierde el SEO al pasar de WordPress a otro stack?</h3>
<p>No por el cambio en sí. Google no posiciona según la tecnología del servidor, sino según el contenido, la experiencia y las señales técnicas. Un sitio bien migrado suele posicionar mejor, porque normalmente queda más rápido.</p>

<hr>
<p>¿Tienes un sitio que necesita modernizarse sin perder lo que ya construiste? <a href="/features">Mira en qué puedo ayudarte</a> o <a href="/contact">cuéntame tu caso</a>.</p>
$html$
),

-- ─────────────────────────────────────────────────────────────── 2
(
  'Qué es la IA aplicada al negocio y en qué se diferencia de un chatbot',
  'que-es-ia-aplicada-al-negocio',
  'IA aplicada',
  'Andrés Contreras',
  '/images/blog/ia-aplicada.svg',
  '5 min de lectura',
  '2026-08-21',
  'published',
$html$
<p><strong>La IA aplicada al negocio es el uso de modelos de lenguaje para ejecutar tareas concretas dentro de una operación: clasificar solicitudes, extraer datos de documentos, redactar respuestas o mover información entre sistemas.</strong> Se diferencia de un chatbot en que no existe para conversar, sino para producir un resultado que antes hacía una persona a mano.</p>

<h2>En resumen</h2>
<ul>
  <li>Un chatbot responde; una automatización con IA <em>ejecuta</em>.</li>
  <li>El valor no está en el modelo, sino en conectarlo a tus datos y sistemas.</li>
  <li>Se mide en horas ahorradas o errores evitados, no en cuán natural suena.</li>
  <li>Los mejores casos son tareas repetitivas, de alto volumen y reglas difusas.</li>
</ul>

<h2>¿Cuál es la diferencia real con un chatbot?</h2>
<p>Un chatbot vive en una ventana de chat y espera a que alguien escriba. Su resultado es texto, y lo que pase después depende de la persona que lo lee.</p>
<p>Una automatización con IA se dispara sola cuando ocurre algo: llega un correo, se llena un formulario, se sube un archivo. Procesa la información, decide qué hacer y actúa: crea el registro en el CRM, notifica al equipo correcto, genera el reporte. Nadie tiene que estar mirando.</p>
<blockquote>
  <p>La pregunta útil no es "¿qué tan inteligente es el modelo?", sino "¿qué tarea deja de hacer una persona cuando esto entra en producción?".</p>
</blockquote>

<h2>¿Qué tareas son buenas candidatas?</h2>
<p>Las que cumplen estas tres condiciones a la vez:</p>
<ol>
  <li><strong>Se repiten mucho.</strong> Si pasa dos veces al mes, automatizarlo cuesta más de lo que ahorra.</li>
  <li><strong>Las reglas son difusas.</strong> Si se puede resolver con un <code>if</code>, no necesitas IA: necesitas un <code>if</code>. La IA gana donde el criterio depende del contexto y del lenguaje.</li>
  <li><strong>El error es tolerable o verificable.</strong> Un humano debe poder revisar lo dudoso, o el costo de equivocarse debe ser bajo.</li>
</ol>
<p>Ejemplos típicos: clasificar y enrutar solicitudes entrantes, extraer datos estructurados de facturas o formularios en texto libre, resumir conversaciones largas, redactar primeros borradores que alguien aprueba.</p>

<h2>¿Por qué fracasan muchos proyectos de IA?</h2>
<p>Por tres razones que se repiten:</p>
<ul>
  <li><strong>Se empieza por la tecnología, no por el problema.</strong> "Queremos usar IA" no es un objetivo; "queremos dejar de clasificar 200 correos al día a mano" sí.</li>
  <li><strong>El modelo no tiene acceso a los datos que necesita.</strong> Un asistente que no conoce tu catálogo ni tu histórico solo puede dar respuestas genéricas.</li>
  <li><strong>No hay forma de medir si funciona.</strong> Sin una métrica previa, no se puede saber si mejoró algo.</li>
</ul>

<h2>¿Cuánta infraestructura hace falta?</h2>
<p>Menos de la que se suele pensar. La mayoría de estas automatizaciones son una integración: un disparador, una llamada a la API del modelo con el contexto correcto, y una escritura en el sistema que ya usas. No hace falta entrenar un modelo propio ni montar infraestructura de datos para empezar.</p>
<p>Entrenar modelos propios tiene sentido en casos muy específicos y con volúmenes grandes. Para el 90 % de los negocios, usar un modelo existente bien conectado resuelve el problema a una fracción del costo.</p>

<h2>Preguntas frecuentes</h2>

<h3>¿Qué diferencia hay entre IA aplicada y automatización tradicional?</h3>
<p>La automatización tradicional sigue reglas fijas que alguien escribió por adelantado. La IA aplicada maneja entradas que no siguen un formato predecible, como texto escrito por personas, donde enumerar todas las reglas sería imposible.</p>

<h3>¿Es seguro darle acceso a la IA a los datos de mi empresa?</h3>
<p>Depende de cómo se implemente. Las buenas prácticas incluyen enviar solo los datos necesarios para cada tarea, no exponer información sensible en los prompts, revisar las políticas de retención del proveedor y registrar qué se consultó y cuándo.</p>

<h3>¿Cómo sé si mi negocio está listo?</h3>
<p>Si puedes nombrar una tarea concreta, decir cuántas veces ocurre por semana y quién la hace hoy, estás listo. Si la respuesta es "queremos innovar con IA", todavía no.</p>

<hr>
<p>¿Tienes una tarea repetitiva que se podría automatizar? <a href="/contact">Cuéntamela</a> y te digo con franqueza si vale la pena o no.</p>
$html$
),

-- ─────────────────────────────────────────────────────────────── 3
(
  'Tienda en línea a medida o plantilla: cómo elegir',
  'tienda-a-medida-o-plantilla',
  'E-commerce',
  'Andrés Contreras',
  '/images/blog/ecommerce.svg',
  '6 min de lectura',
  '2026-09-02',
  'published',
$html$
<p><strong>Una plantilla conviene cuando tu operación cabe en lo que la plataforma ya hace; una tienda a medida conviene cuando tu forma de vender no cabe ahí.</strong> La decisión no es de presupuesto ni de gusto: depende de cuántas peleas vas a tener con la herramienta para que haga lo que tu negocio necesita.</p>

<h2>En resumen</h2>
<ul>
  <li>Plantilla: rápido de lanzar, barato al inicio, límites fijos.</li>
  <li>A medida: más inversión inicial, sin techo funcional, tú eres dueño del código.</li>
  <li>La pregunta clave: ¿cuántas excepciones tiene tu forma de vender?</li>
  <li>Migrar de plantilla a medida después es normal y no es un fracaso.</li>
</ul>

<h2>¿Cuándo una plantilla es la decisión correcta?</h2>
<p>Cuando estás validando. Si todavía no sabes si el producto vende, si el catálogo es pequeño y el proceso de compra es el estándar (ver producto, agregar al carrito, pagar, recibir), una plantilla te pone a vender en días y te deja descubrir qué necesitas de verdad.</p>
<p>Gastar meses construyendo una tienda a medida para un negocio que aún no ha vendido nada es construir sobre suposiciones. La plantilla es la forma barata de reemplazar suposiciones por datos.</p>

<h2>¿Cuándo se queda corta?</h2>
<p>Las señales son bastante claras:</p>
<ul>
  <li><strong>Pagas más en plugins que en la plataforma.</strong> Cada función que falta se resuelve comprando una extensión, y la suma mensual ya duele.</li>
  <li><strong>Tu proceso no cabe.</strong> Descuentos que dependen del cliente, combinaciones de producto raras, envíos con reglas propias, precios por volumen.</li>
  <li><strong>Estás haciendo trabajo manual.</strong> Exportar, cruzar en Excel y volver a subir es la señal más clara de que la herramienta no está haciendo su trabajo.</li>
  <li><strong>La tienda es lenta y no puedes hacer nada.</strong> Con una plantilla cargada de extensiones, el margen de optimización es limitado.</li>
</ul>

<h2>¿Qué significa realmente "a medida"?</h2>
<p>No significa programar todo desde cero. Significa que la lógica de tu negocio la controlas tú, apoyándote en piezas ya probadas para lo que no te diferencia: una pasarela de pagos establecida, un servicio de correos transaccionales, una base de datos gestionada.</p>
<p>Nadie debería construir su propio procesador de pagos. Pero sí tiene sentido controlar cómo se calcula un precio, cómo se aplica un descuento o cómo se arma un pedido, porque ahí es donde cada negocio es distinto.</p>

<h2>¿Qué se suele olvidar al presupuestar?</h2>
<p>Estas son las partes que no aparecen en la primera conversación y que siempre hacen falta:</p>
<ol>
  <li><strong>Correos transaccionales.</strong> Confirmación de compra, envío, recuperación de contraseña. Sin esto, el cliente queda a ciegas.</li>
  <li><strong>Manejo de errores en producción.</strong> Si un pago falla a las 2 de la mañana, ¿alguien se entera?</li>
  <li><strong>Carga inicial del catálogo.</strong> Si tienes cientos de productos en un Excel, alguien tiene que convertir eso en datos reales.</li>
  <li><strong>Panel de administración.</strong> Alguien no técnico tiene que poder cambiar precios sin llamarte.</li>
</ol>

<h2>¿Se puede empezar con una y cambiar después?</h2>
<p>Sí, y es un camino perfectamente razonable. Validar con una plantilla y reconstruir cuando el volumen lo justifique es una secuencia sensata: la segunda versión se construye sabiendo exactamente qué necesita el negocio, en vez de adivinando.</p>
<p>Lo importante es conservar desde el principio lo que es tuyo: los datos de clientes, el historial de pedidos y el catálogo. Mientras eso sea exportable, cambiar de plataforma es un proyecto, no una tragedia.</p>

<h2>Preguntas frecuentes</h2>

<h3>¿Una tienda a medida posiciona mejor en Google?</h3>
<p>No automáticamente, pero da más control. Puedes optimizar la velocidad, la estructura de URLs y el marcado estructurado sin las restricciones de una plataforma cerrada. El contenido sigue siendo lo que más pesa.</p>

<h3>¿Cuánto tiempo toma construir una tienda a medida?</h3>
<p>Depende del alcance, pero una primera versión que ya vende (catálogo, carrito, checkout, cuentas y correos) es un proyecto de semanas, no de días ni de un año. Lo que alarga los plazos suele ser la cantidad de excepciones del negocio.</p>

<h3>¿Qué pasa si el desarrollador desaparece?</h3>
<p>Por eso importa que el código esté en un repositorio tuyo, con la documentación mínima para que otra persona lo retome. Si no puedes acceder a tu propio código, no es una tienda a medida: es una dependencia.</p>

<hr>
<p>¿Estás decidiendo entre las dos? <a href="/contact">Cuéntame cómo vendes hoy</a> y te digo cuál tiene más sentido en tu caso.</p>
$html$
),

-- ─────────────────────────────────────────────────────────────── 4
(
  'Por qué tu sitio en WordPress es lento y cómo arreglarlo',
  'por-que-tu-wordpress-es-lento',
  'Rendimiento',
  'Andrés Contreras',
  '/images/blog/rendimiento.svg',
  '6 min de lectura',
  '2026-09-11',
  'published',
$html$
<p><strong>Un sitio en WordPress casi nunca es lento por WordPress: es lento por la suma de plugins, imágenes sin optimizar, un tema pesado y un hosting compartido saturado.</strong> La buena noticia es que las cuatro causas se pueden medir, y normalmente se arreglan sin reconstruir el sitio.</p>

<h2>En resumen</h2>
<ul>
  <li>Mide antes de tocar nada: sin datos estarás adivinando.</li>
  <li>Las imágenes suelen ser el mayor peso de la página.</li>
  <li>Cada plugin activo es código que se ejecuta en cada visita.</li>
  <li>Las métricas que importan son LCP, INP y CLS.</li>
</ul>

<h2>¿Qué métricas hay que mirar?</h2>
<p>Google usa las Core Web Vitals, y tienen umbrales públicos para considerarse "buenas":</p>
<table>
  <thead>
    <tr><th>Métrica</th><th>Qué mide</th><th>Umbral</th></tr>
  </thead>
  <tbody>
    <tr><td>LCP</td><td>Cuánto tarda en verse el elemento principal</td><td>2,5 s o menos</td></tr>
    <tr><td>INP</td><td>Qué tan rápido responde a una interacción</td><td>200 ms o menos</td></tr>
    <tr><td>CLS</td><td>Cuánto se mueve el contenido al cargar</td><td>0,1 o menos</td></tr>
  </tbody>
</table>
<p>Un detalle importante: mídelas con datos de usuarios reales, no solo con una prueba de laboratorio. Una prueba desde un servidor rápido puede dar verde mientras tus clientes, en móvil y con red irregular, tienen otra experiencia.</p>

<h2>¿Por qué las imágenes pesan tanto?</h2>
<p>Porque se suben tal como salieron de la cámara o del banco de imágenes. Una foto de 4000 píxeles de ancho que se muestra en un espacio de 800 obliga al navegador a descargar varias veces más datos de los necesarios.</p>
<p>Lo que hay que hacer con cada imagen:</p>
<ul>
  <li>Redimensionarla al tamaño máximo en que se va a mostrar.</li>
  <li>Convertirla a un formato moderno como WebP o AVIF.</li>
  <li>Cargar en diferido (<code>loading="lazy"</code>) todo lo que esté por debajo del primer pantallazo.</li>
  <li>Reservar su espacio con <code>width</code> y <code>height</code>, para que el contenido no salte al cargar.</li>
</ul>

<h2>¿Cuántos plugins son demasiados?</h2>
<p>No es el número, es lo que hace cada uno. Veinte plugins ligeros pueden pesar menos que uno solo que carga su propia librería de JavaScript en todas las páginas.</p>
<p>El ejercicio útil es revisar plugin por plugin y preguntarse tres cosas: ¿se está usando de verdad?, ¿carga recursos en páginas donde no hace falta?, ¿existe una forma más simple de lograr lo mismo? Los constructores visuales merecen atención especial: suelen generar mucho HTML anidado y cargar estilos para funciones que la página ni usa.</p>

<h2>¿Sirve instalar un plugin de caché?</h2>
<p>Sirve, y bastante, pero no arregla todo. La caché evita que el servidor reconstruya la misma página una y otra vez, lo que mejora mucho el tiempo de respuesta inicial. Lo que <em>no</em> arregla es una página que descarga 8 MB de imágenes o ejecuta JavaScript pesado en el navegador: eso ocurre en el dispositivo del visitante, después de que la caché hizo su trabajo.</p>
<p>Por eso el orden importa: primero reduce el peso real de la página, luego cachea. Al revés, estarás guardando en caché una página igual de pesada.</p>

<h2>¿Cuándo el problema es el hosting?</h2>
<p>Cuando el tiempo de respuesta del servidor (TTFB) es alto incluso con caché activa y una página ligera. En hosting compartido barato, tu sitio comparte recursos con muchos otros, y si uno de ellos recibe un pico de tráfico, el tuyo lo siente.</p>
<p>Antes de cambiar de proveedor conviene descartar lo demás, porque migrar un sitio lento a un servidor más caro suele dar un sitio lento más caro.</p>

<h2>Preguntas frecuentes</h2>

<h3>¿La velocidad afecta el posicionamiento?</h3>
<p>Sí, aunque no es el factor más importante. Las Core Web Vitals son una señal de posicionamiento confirmada por Google, pero el contenido relevante pesa más. Donde la velocidad se nota de inmediato es en la conversión: cada segundo de espera pierde visitantes.</p>

<h3>¿Tengo que reconstruir el sitio para que sea rápido?</h3>
<p>Casi nunca. La mayoría de los sitios mejora mucho optimizando imágenes, limpiando plugins y configurando caché. Reconstruir se justifica cuando la plataforma te impide hacer los cambios que necesitas.</p>

<h3>¿Cuánta mejora se puede esperar?</h3>
<p>Depende del punto de partida, pero en sitios que nunca se han optimizado los cambios básicos suelen dar la mayor parte de la mejora. Lo difícil es el último tramo, cuando ya se arregló lo evidente.</p>

<hr>
<p>¿Quieres saber qué está frenando tu sitio? <a href="/contact">Escríbeme</a> y lo revisamos con datos, no con suposiciones.</p>
$html$
)

on conflict (slug) do update set
  title      = excluded.title,
  category   = excluded.category,
  author     = excluded.author,
  image      = excluded.image,
  read_time  = excluded.read_time,
  date       = excluded.date,
  status     = excluded.status,
  content    = excluded.content,
  updated_at = now();
