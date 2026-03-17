import { G, uid } from './constants';

export const SECUENCIA_VALOR = [
    {
        dia: 1, diaNombre: "Lunes", tipo: "StoryTelling / Antes y Después",
        objetivo: "Mostrar cómo pasaste de tu momento anterior a través de tu vehículo al resultado.",
        estructura: [
            { paso: "Capta la atención", items: ["Cómo lograste X resultados en X tiempo", "Cómo pasaste del punto A al punto B", "Los beneficios que obtuviste"] },
            { paso: "Narrar el ANTES", items: ["Emociones dolorosas", "Lo que ocurría a tu alrededor y el caos", "Las barreras de ese momento"] },
            { paso: "Narrar el DESPUÉS", items: ["El resultado que tu vehículo te permitió tener", "Describe cómo cambió todo", "Las acciones que tomaste y los resultados"] },
            { paso: "Momentos WOW / Aprendizajes", items: ["¿Qué hiciste para mejorar?", "¿Cuáles medidas tomaste?", "¿Qué hiciste para cambiar?", "Vender el método con pasos"] },
            { paso: "Inspirar al público", items: ["Agradecimiento", "Aprendizaje que tuviste"] },
            { paso: "CTA", items: ["Preguntarles sobre el sueño", "Si quieren conocer el vehículo"] },
            { paso: "Formato", items: ["Foto de ANTES y DESPUÉS", "Que se note la diferencia y se vea tu rostro", "Capturas de pantalla o puntos comparativos"] },
        ],
        color: G.magenta, grad: G.gMagenta,
    },
    {
        dia: 2, diaNombre: "Martes", tipo: "Post de contenido de valor",
        objetivo: "Mostrar tu autoridad. Demostrar que sabes, ser de utilidad y generar más curiosidad.",
        estructura: [
            { paso: "Gancho", items: ["Cuantitativo (3 Consejos, 4 Secretos...)", "Basado en el beneficio (Cómo obtuve X resultado)"] },
            { paso: "Credibilidad", items: ["Resultados que tú y/o tu cliente obtuvieron"] },
            { paso: "Valor detallado", items: ["Qué (lo que deben hacer) y por qué (el beneficio)", "Puntos clave/lecciones + ejemplos reales", "Paso a paso numerado o con puntos clave"] },
            { paso: "Acción", items: ["Qué pueden hacer ahora para obtener resultados"] },
            { paso: "Formato", items: ["Carrusel o video educativo"] },
        ],
        color: G.purple, grad: G.gViolet,
    },
    {
        dia: 3, diaNombre: "Miércoles", tipo: "Post de descubrimiento – Momento Wow",
        objetivo: "Contar los diferentes acontecimientos que te llevaron a encontrar una solución.",
        estructura: [
            { paso: "Gancho", items: ["Posicionar el problema y por qué es importante", "Controversial / Observación / Pregunta"] },
            { paso: "Creencias más comunes", items: ["'Esto es lo que piensa la mayoría…'"] },
            { paso: "Defiende tu posición", items: ["'Estoy a punto de mostrarte por qué esto no funciona, y qué hacer'"] },
            { paso: "Prueba social", items: ["Historia donde respaldas tu posición", "Argumentos lógicos y emocionales", "Tu historia de antes"] },
            { paso: "Consecuencias de creencias comunes", items: ["El daño que estas creencias pueden crear", "'Si sigues creyéndolas, esto es lo que te va a pasar'"] },
            { paso: "Revela la solución", items: ["Lo que has hecho para resolver el problema", "La pieza faltante", "Cómo cambió tu vida"] },
            { paso: "Conclusión / Lección", items: ["Resume los beneficios", "Dales tarea o pasos de acción"] },
            { paso: "Formato", items: ["Foto"] },
        ],
        color: G.blue, grad: G.gBlue,
    },
    {
        dia: 4, diaNombre: "Jueves", tipo: "Post de contenido de valor",
        objetivo: "Mostrar tu autoridad.",
        estructura: [
            { paso: "Gancho", items: ["Cuantitativo (3 Consejos, 4 Secretos...)", "Basado en el beneficio"] },
            { paso: "Credibilidad", items: ["Resultados que tú y/o tu cliente obtuvieron"] },
            { paso: "Valor detallado", items: ["Qué y por qué", "Puntos clave + ejemplos reales", "Paso a paso"] },
            { paso: "Acción", items: ["Qué pueden hacer ahora"] },
            { paso: "Formato elegido", items: ["Carrusel o video"] },
        ],
        color: G.purple, grad: G.gViolet,
    },
    {
        dia: 5, diaNombre: "Viernes", tipo: "Caso de éxito o Reel de valor",
        objetivo: "Mostrar resultados concretos y aumentar autoridad.",
        estructura: [
            { paso: "Gancho", items: ["Cuantitativo (3 Consejos, 4 Secretos...)", "Basado en el beneficio (Cómo obtener X resultado)"] },
            { paso: "Resalta el problema principal", items: ["Relevante: dolor del infierno actual", "Escena de película: descripción vívida", "Emociones: cómo les hace sentir eso"] },
            { paso: "3 a 5 consejos", items: ["Que contribuyan a resolver el problema"] },
            { paso: "CTA", items: ["Comentar una palabra clave para generar interacción"] },
        ],
        color: G.green, grad: G.gGreen,
    },
    {
        dia: 6, diaNombre: "Sábado", tipo: "Día a día o motivación",
        objetivo: "Conectar emocionalmente con la audiencia y humanizar tu marca.",
        estructura: [
            { paso: "Emoción que te genera tu hoy", items: ["¿Cómo estás hoy?", "Relato de un momento actual", "Descripción de lo que estás viviendo hoy"] },
            { paso: "El cómo te sentías antes", items: ["En una o dos oraciones", "Las emociones más difíciles"] },
            { paso: "Cómo superaste los retos", items: ["Aquello que marcó tu vida", "Palabras inspiradoras", "Motivo de tomar acción"] },
            { paso: "Mensaje motivacional", items: ["Inspíralos a sentirse capaces"] },
            { paso: "Invítalos a seguir trabajando en ellos", items: ["CTA suave de conexión"] },
        ],
        color: G.orange, grad: G.gOrange,
    },
    {
        dia: 7, diaNombre: "Domingo", tipo: "Subiendo nivel de consciencia",
        objetivo: "Aumentar interacciones en comentarios y temperatura del lead.",
        estructura: [
            { paso: "Ofrece contenido de regalo", items: ["Descargables o lead magnet", "Episodios de podcast", "Videos de YouTube", "Entrenamientos"] },
            { paso: "CTA para comentar", items: ["'Comenta YO' o palabra clave para recibir el regalo"] },
        ],
        color: G.cyan, grad: G.gCyan,
    },
];

export const SECUENCIA_VENTA = [
    {
        dia: 1, diaNombre: "Lunes", tipo: "Lanzamiento para atraer leads",
        objetivo: "Atraer un número concreto de prospectos o leads.",
        estructura: [
            { paso: "Audiencia", items: ["'Estoy buscando a X, X y X'"] },
            { paso: "Resultado de la transformación", items: ["'Llevarlos a conseguir X resultados'"] },
            { paso: "Escasez", items: ["Buscamos # de personas", "Número limitado"] },
            { paso: "Método", items: ["Vender que el resultado se da a través de tu método"] },
            { paso: "CTA", items: ["¿Quién se suma?", "Comenta 'XX'"] },
        ],
        color: G.magenta, grad: G.gMagenta,
    },
    {
        dia: 2, diaNombre: "Martes", tipo: "Post de Oferta completa",
        objetivo: "Lanzar la oferta de forma completa a la audiencia.",
        estructura: [
            { paso: "Gancho", items: ["Preguntar si quiere obtener el resultado o la transformación"] },
            { paso: "Credibilidad", items: ["Resultados que tú y/o tu cliente obtuvieron"] },
            { paso: "Transición", items: ["Mostrar que no fue siempre así"] },
            { paso: "Barrera", items: ["Dolor del cliente en este momento", "Describir el momento de vida", "Emociones internas que está enfrentando"] },
            { paso: "Aprendizaje", items: ["Cambios que adoptaste", "Pasos que seguiste", "Claves de tu vida"] },
            { paso: "Lanzamiento de la oferta", items: ["Anunciar la tensión de compra", "Motivos que te llevan a esa decisión"] },
            { paso: "Urgencia y resultados", items: ["Los resultados que van a tener"] },
            { paso: "CTA de palabra clave", items: ["Comenta la palabra clave"] },
        ],
        color: G.purple, grad: G.gViolet,
    },
    {
        dia: 3, diaNombre: "Miércoles", tipo: "Derribar objeciones",
        objetivo: "Tumbar objeciones haciendo evidentes las creencias o errores que cometen.",
        estructura: [
            { paso: "Gancho", items: ["Posicionar el problema y por qué es importante", "Controversial / Observación / Pregunta"] },
            { paso: "Creencias más comunes", items: ["'Esto es lo que piensa la mayoría…'"] },
            { paso: "Defiende tu posición", items: ["'Estoy a punto de mostrarte por qué esto no funciona, y qué hacer'"] },
            { paso: "Dolores de esas creencias", items: ["Enlista los dolores o consecuencias"] },
            { paso: "Momento WOW", items: ["Por qué estas creencias son falsas", "Qué les falta para obtener el resultado"] },
            { paso: "Revela la solución", items: ["Describe la pieza faltante", "Cómo cambió tu vida"] },
            { paso: "Prueba social", items: ["Historia que respalda tu posición", "Argumentos lógicos y emocionales"] },
            { paso: "Consecuencias de las creencias", items: ["El daño que estas creencias pueden crear", "'Si sigues creyéndolas…'"] },
            { paso: "Lanzamiento de la oferta", items: ["Tensión de compra", "Urgencia y resultados"] },
            { paso: "CTA de palabra clave", items: ["Comenta la palabra clave"] },
        ],
        color: G.red, grad: G.gOrange,
    },
    {
        dia: 4, diaNombre: "Jueves", tipo: "Post de Antes y Después",
        objetivo: "Mostrar cómo pasaste de tu momento anterior a través de tu vehículo al resultado.",
        estructura: [
            { paso: "Capta la atención", items: ["Cómo lograste X resultados en X tiempo", "Cómo pasaste del punto A al B", "Los beneficios que obtuviste"] },
            { paso: "Narrar el ANTES", items: ["Emociones dolorosas", "Lo que ocurría a tu alrededor y el caos", "Las barreras de ese momento"] },
            { paso: "Narrar el DESPUÉS", items: ["El resultado que tu vehículo te permitió tener", "Cómo cambió todo", "Las acciones y los resultados"] },
            { paso: "Momentos WOW / Aprendizajes", items: ["Qué hiciste para mejorar", "Vender el método con pasos"] },
            { paso: "Inspirar al público", items: ["Agradecimiento", "Aprendizaje"] },
            { paso: "Formato", items: ["Foto ANTES y DESPUÉS", "Que se note la diferencia", "Capturas de pantalla"] },
        ],
        color: G.blue, grad: G.gBlue,
    },
    {
        dia: 5, diaNombre: "Viernes", tipo: "Caso de éxito o Reel de valor",
        objetivo: "Mostrar resultados y aumentar credibilidad.",
        estructura: [
            { paso: "Gancho", items: ["Cuantitativo (3 Consejos, 4 Secretos...)", "Basado en el beneficio"] },
            { paso: "Resalta el problema principal", items: ["Dolor del infierno actual", "Escena vívida", "Emociones"] },
            { paso: "3 a 5 consejos", items: ["Que contribuyan a resolver el problema"] },
            { paso: "CTA", items: ["Comentar palabra clave para interacción"] },
        ],
        color: G.green, grad: G.gGreen,
    },
    {
        dia: 6, diaNombre: "Sábado", tipo: "Día a día o motivación",
        objetivo: "Conectar emocionalmente con la audiencia.",
        estructura: [
            { paso: "Gancho", items: ["Preguntar si quiere obtener el resultado"] },
            { paso: "Credibilidad", items: ["Resultados propios o de clientes"] },
            { paso: "Transición", items: ["Mostrar que no fue siempre así"] },
            { paso: "Barrera", items: ["Dolor del cliente", "Emociones internas"] },
            { paso: "Aprendizaje", items: ["Cambios que adoptaste", "Pasos que seguiste"] },
            { paso: "Lanzamiento de la oferta", items: ["Tensión de compra"] },
            { paso: "CTA de palabra clave", items: ["Comenta la palabra clave"] },
        ],
        color: G.orange, grad: G.gOrange,
    },
    {
        dia: 7, diaNombre: "Domingo", tipo: "Post de contenido de valor",
        objetivo: "Mostrar autoridad y mantener caliente la audiencia.",
        estructura: [
            { paso: "Gancho", items: ["Cuantitativo", "Basado en el beneficio"] },
            { paso: "Credibilidad", items: ["Resultados propios o de clientes"] },
            { paso: "Valor detallado", items: ["Qué y por qué", "Puntos clave + ejemplos reales", "Paso a paso"] },
            { paso: "Acción", items: ["Qué pueden hacer ahora"] },
        ],
        color: G.purple, grad: G.gViolet,
    },
    {
        dia: 8, diaNombre: "Lunes", tipo: "Caso de éxito o Antes y Después",
        objetivo: "Reforzar credibilidad con evidencia concreta.",
        estructura: [
            { paso: "Capta la atención", items: ["X resultados en X tiempo", "Punto A a punto B", "Los beneficios"] },
            { paso: "Narrar el ANTES y DESPUÉS", items: ["Emociones dolorosas antes", "El resultado y las acciones después"] },
            { paso: "Momentos WOW", items: ["Qué hiciste para mejorar", "Vender el método"] },
            { paso: "Lanzamiento de la oferta", items: ["Tensión de compra", "Urgencia"] },
            { paso: "CTA de palabra clave", items: ["Comenta la palabra clave"] },
            { paso: "Formato", items: ["Foto ANTES y DESPUÉS"] },
        ],
        color: G.magenta, grad: G.gMagenta,
    },
    {
        dia: 9, diaNombre: "Martes", tipo: "Derribar objeciones (2da ronda)",
        objetivo: "Segunda oleada de derribo de objeciones más profunda.",
        estructura: [
            { paso: "Gancho", items: ["Controversial / Observación / Pregunta"] },
            { paso: "Creencias más comunes", items: ["'Esto es lo que piensa la mayoría…'"] },
            { paso: "Defiende tu posición", items: ["Por qué no funciona lo que están haciendo"] },
            { paso: "Dolores de esas creencias", items: ["Consecuencias de seguir así"] },
            { paso: "Momento WOW", items: ["Por qué estas creencias son falsas"] },
            { paso: "Revela la solución", items: ["Pieza faltante", "Tu transformación"] },
            { paso: "Prueba social", items: ["Historia de respaldo"] },
            { paso: "Consecuencias", items: ["'Si sigues creyéndolas…'"] },
            { paso: "Lanzamiento de la oferta + urgencia", items: ["Tensión de compra", "CTA"] },
        ],
        color: G.red, grad: G.gOrange,
    },
    {
        dia: 10, diaNombre: "Miércoles", tipo: "Historia personal",
        objetivo: "Relatar una historia donde derribaste una objeción o limitación.",
        estructura: [
            { paso: "Historia de tu ANTES", items: ["El momento previo a la transformación"] },
            { paso: "Vehículo y acciones", items: ["Las acciones que superaste"] },
            { paso: "Objeción o creencia superada", items: ["La creencia que venciste"] },
            { paso: "Urgencia o escasez", items: ["El tiempo se acaba / plazas limitadas"] },
            { paso: "CTA", items: ["Comenta la palabra clave"] },
        ],
        color: G.cyan, grad: G.gCyan,
    },
    {
        dia: 11, diaNombre: "Jueves", tipo: "Caso de éxito o Antes y Después (3ra ronda)",
        objetivo: "Reforzar con más evidencia social.",
        estructura: [
            { paso: "Capta la atención", items: ["X resultados en X tiempo"] },
            { paso: "Narrar ANTES y DESPUÉS", items: ["Emociones dolorosas antes", "Resultado y acciones después"] },
            { paso: "Momentos WOW", items: ["Qué hiciste para cambiar"] },
            { paso: "Lanzamiento de la oferta", items: ["Tensión de compra", "Urgencia"] },
            { paso: "CTA + Formato", items: ["Foto ANTES y DESPUÉS", "Comenta la palabra clave"] },
        ],
        color: G.blue, grad: G.gBlue,
    },
    {
        dia: 12, diaNombre: "Viernes", tipo: "Oferta directa",
        objetivo: "Hablar directamente de la oferta sin rodeos.",
        estructura: [
            { paso: "Por qué deberían tomar la oferta", items: ["Los beneficios concretos"] },
            { paso: "El resultado que obtendrán", items: ["Descripción detallada de la transformación"] },
            { paso: "Urgencia de la fecha", items: ["¿Cuándo cierra la oferta?"] },
            { paso: "CTA directo", items: ["Comenta la palabra clave", "Link directo al WhatsApp o checkout"] },
        ],
        color: G.green, grad: G.gGreen,
    },
    {
        dia: 13, diaNombre: "Sábado", tipo: "Cuenta regresiva",
        objetivo: "Activar urgencia final con los días que faltan.",
        estructura: [
            { paso: "Lanzamiento + cuenta regresiva", items: ["Adaptar el post de lanzamiento agregando los días que faltan"] },
            { paso: "Tensión de compra", items: ["Mencionar la escasez o deadline"] },
            { paso: "CTA", items: ["Comenta la palabra clave"] },
        ],
        color: G.orange, grad: G.gOrange,
    },
    {
        dia: 14, diaNombre: "Domingo", tipo: "Último día – Cierre",
        objetivo: "Máxima urgencia. FALTAN 24 HORAS.",
        estructura: [
            { paso: "Lanzamiento + FALTAN 24 HORAS", items: ["Adaptar el post de lanzamiento con urgencia máxima"] },
            { paso: "Tensión de compra final", items: ["Esta es la última oportunidad"] },
            { paso: "CTA final", items: ["Comenta la palabra clave", "Último llamado al WhatsApp"] },
        ],
        color: G.red, grad: G.gOrange,
    },
];

export const TENSIONES_COMPRA = [
    { id: "t1", label: "Primer lanzamiento", desc: "Primera vez que ofreces esto públicamente" },
    { id: "t2", label: "Aumento de precios", desc: "El precio sube al terminar el período" },
    { id: "t3", label: "Exclusividad – Primer grupo", desc: "Solo los primeros X acceden a condiciones especiales" },
    { id: "t4", label: "Cuenta regresiva", desc: "La oferta cierra en una fecha fija" },
];

export const BANCO_TEMPLATE = [
    { fase: "Atracción", avatar: "Primerizo", dolor: "Miedo al error", titulo: "3 errores al comprar tierra en Yucatán", hook: "El 90% de los que compran terreno en Yucatán cometen este error...", ctaDm: "CHECKLIST" },
    { fase: "Atracción", avatar: "Primerizo", dolor: "Miedo a fraude", titulo: "Cómo detectar un fraude inmobiliario", hook: "Si un vendedor evita mostrarte esto... cuidado.", ctaDm: "GUIA" },
    { fase: "Atracción", avatar: "Patrimonial", dolor: "Plusvalía", titulo: "Por qué el dinero de CDMX fluye a Yucatán", hook: "Hay una razón por la que el dinero inteligente está llegando aquí.", ctaDm: "MAPA" },
    { fase: "Atracción", avatar: "Primerizo", dolor: "Presupuesto", titulo: "¿Qué compras realmente con $200k?", hook: "Si tienes $200,000 pesos esto es lo que puedes comprar hoy.", ctaDm: "OPCIONES" },
    { fase: "Atracción", avatar: "Lifestyle", dolor: "Libertad", titulo: "Por qué todos se mudan a Yucatán", hook: "Esto está pasando en Mérida y pocos lo ven venir.", ctaDm: "MERIDA" },
    { fase: "Atracción", avatar: "Patrimonial", dolor: "Comparativa", titulo: "Terreno vs Departamento: ¿Cuál gana?", hook: "Si buscas plusvalía pura, esta opción suele ganar.", ctaDm: "PLUS" },
    { fase: "Atracción", avatar: "Primerizo", dolor: "Miedo financiero", titulo: "El error más caro al invertir", hook: "He visto gente perder mucho dinero por este pequeño detalle.", ctaDm: "ERROR" },
    { fase: "Atracción", avatar: "Patrimonial", dolor: "Crecimiento", titulo: "Las 3 zonas con mayor crecimiento en 2024", hook: "Estas 3 zonas están creciendo más rápido que el resto.", ctaDm: "ZONAS" },
    { fase: "Atracción", avatar: "Lifestyle", dolor: "Aspiración", titulo: "Un fin de semana en la costa de Yucatán", hook: "Así es la vida cuando inviertes cerca de la playa.", ctaDm: "PLAYA" },
    { fase: "Atracción", avatar: "Primerizo", dolor: "Incertidumbre", titulo: "La verdad sobre la plusvalía", hook: "La plusvalía no es magia, es infraestructura. Mira esto.", ctaDm: "PLUSVALIA" },
    { fase: "Atracción", avatar: "Patrimonial", dolor: "Protección", titulo: "Por qué la tierra protege tu patrimonio", hook: "Muchos empresarios invierten en tierra por esta razón estratégica.", ctaDm: "PATRIMONIO" },
    { fase: "Atracción", avatar: "Todos", dolor: "Educación básica", titulo: "Lo que nadie te dice del costo real", hook: "Invertir en tierra tiene costos ocultos. Aquí te los digo.", ctaDm: "INVERTIR" },
    { fase: "Valor", avatar: "Todos", dolor: "Confianza", titulo: "Cómo funciona el sistema Native", hook: "Así filtramos los proyectos antes de recomendarlos.", ctaDm: "SISTEMA" },
    { fase: "Valor", avatar: "Todos", dolor: "Seguridad Legal", titulo: "Documentos que debe tener un terreno seguro", hook: "Si un terreno no tiene esto... corre.", ctaDm: "DOCUMENTOS" },
    { fase: "Valor", avatar: "Patrimonial", dolor: "Estrategia", titulo: "Cómo elegimos zonas con plusvalía", hook: "Antes de invertir revisamos estos 3 factores clave.", ctaDm: "ZONA" },
    { fase: "Valor", avatar: "Primerizo", dolor: "Proceso", titulo: "Paso a paso para tu primera inversión", hook: "Así es el proceso completo, desde el clic hasta la firma.", ctaDm: "PASOS" },
    { fase: "Valor", avatar: "Todos", dolor: "Miedo Legal", titulo: "Qué revisar antes de firmar un contrato", hook: "Nunca firmes nada sin verificar estos puntos.", ctaDm: "CONTRATO" },
    { fase: "Valor", avatar: "Patrimonial", dolor: "Análisis", titulo: "Cómo evaluar una oportunidad inmobiliaria", hook: "Así analizamos nosotros si un terreno vale la pena.", ctaDm: "ANALISIS" },
    { fase: "Conversión", avatar: "Primerizo", dolor: "Guía Directa", titulo: "¿Quieres invertir pero no sabes por dónde empezar?", hook: "He ayudado a decenas de personas a invertir seguro en Yucatán.", ctaDm: "INVERTIR" },
    { fase: "Conversión", avatar: "Todos", dolor: "Oportunidad", titulo: "Oportunidades de inversión activas este mes", hook: "Aquí están los proyectos que pasaron nuestro filtro hoy.", ctaDm: "TERRENOS" },
].map((p, i) => ({ ...p, id: uid(), num: i + 1, estado: "En cola", formato: "", fechaProg: "", copy: "", guion: "", instrucciones: "", notasInternas: "", linkRecursos: "", linkFinal: "", linkEvidencia: "", origen: "manual", origenRef: null, anotaciones: [] }));

export const ONBOARDING_STEPS = [
    {
        id: "ob1", dias: "Días 1–4", titulo: "Auditoría & Setup", items: [
            { id: "o1", text: "Auditoría completa del perfil actual" },
            { id: "o2", text: "Setup de Business Manager y Meta Ads" },
            { id: "o3", text: "Cuestionario de posicionamiento completado" },
            { id: "o4", text: "Diagnóstico de zona y cliente ideal definido" },
        ]
    },
    {
        id: "ob2", dias: "Días 5–8", titulo: "Contenido & Guiones", items: [
            { id: "o5", text: "Guiones de video entregados al broker" },
            { id: "o6", text: "Primera sesión de fotos/videos coordinada" },
            { id: "o7", text: "Material base recibido del broker" },
            { id: "o8", text: "Calendario del mes listo y aprobado" },
        ]
    },
    {
        id: "ob3", dias: "Días 9–12", titulo: "Producción & Aprobación", items: [
            { id: "o9", text: "Primeras piezas editadas y diseñadas" },
            { id: "o10", text: "Revisión y aprobación del broker" },
            { id: "o11", text: "Programación de los primeros posts" },
            { id: "o12", text: "Optimización de perfil aplicada" },
        ]
    },
    {
        id: "ob4", dias: "Día 15", titulo: "Lanzamiento", items: [
            { id: "o13", text: "Lanzamiento oficial de campañas de tráfico" },
            { id: "o14", text: "Pauta activada con presupuesto definido" },
            { id: "o15", text: "Grupo de WhatsApp activo con cliente" },
            { id: "o16", text: "Reporte de arranque enviado" },
        ]
    },
];

export const INSTALACION_SECTIONS = [
    {
        id: "in1", label: "Bio & SEO", icon: "✦", items: [
            { id: "i1", text: "Nombre SEO optimizado con palabras clave buscables" },
            { id: "i2", text: "Gancho de bio cambiado de 'empresa líder' a metodología protectora" },
            { id: "i3", text: "CTA directo en bio (Agenda asesoría / WhatsApp link)" },
            { id: "i4", text: "Link de bio apuntando a lead magnet o agenda" },
        ]
    },
    {
        id: "in2", label: "Arquitectura de Destacadas", icon: "◈", items: [
            { id: "i5", text: "Orden estratégico: Invertir → Proyectos → Casos → Terrenos → FAQ" },
            { id: "i6", text: "Story fija de conversión en highlight INVERTIR" },
            { id: "i7", text: "CTA al final de cada highlight ('Escribe INVERTIR')" },
            { id: "i8", text: "Diseño visual coherente con marca personal" },
        ]
    },
    {
        id: "in3", label: "3 Posts Fijados", icon: "◉", items: [
            { id: "i9", text: "Post 1 — El Manual: Cómo invertir paso a paso (video tutorial)" },
            { id: "i10", text: "Post 2 — El Filtro: 3 errores fatales (establece autoridad)" },
            { id: "i11", text: "Post 3 — El Origen: Por qué creamos esto (conexión emocional)" },
        ]
    },
    {
        id: "in4", label: "Puntos Ciegos a Evitar", icon: "◆", items: [
            { id: "i12", text: "Perfil no parece valla publicitaria de los 90s" },
            { id: "i13", text: "Cada sección tiene CTA directo visible" },
            { id: "i14", text: "Sin renders de proyectos en contenido de Atracción" },
            { id: "i15", text: "Velocidad de respuesta a DM < 15 minutos configurada" },
        ]
    },
];
