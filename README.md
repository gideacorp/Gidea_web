# GIDEA-IFPD — Sitio Web

## Estructura de carpetas

```
website/
├── index.html                         ← Página principal
├── assets/
│   ├── css/
│   │   └── style.css                  ← Estilos principales
│   ├── js/
│   │   └── main.js                    ← JavaScript (navbar, animaciones, form)
│   └── images/
│       ├── hero/                      ← Imágenes del hero y CTA banner
│       │   ├── hero-bg.jpg            ← [REQUERIDA] Fondo del hero principal (1920x1080 min)
│       │   └── cta-banner-bg.jpg      ← [REQUERIDA] Fondo del banner CTA (1920x800 min)
│       ├── nosotros/
│       │   ├── about-team.jpg         ← [REQUERIDA] Foto del equipo / oficina (800x1000 px)
│       │   └── analysis-map.jpg       ← [OPCIONAL] Imagen de análisis aeronáutico (1600x600 px)
│       ├── servicios/
│       │   ├── procedimientos-vuelo.jpg    ← Servicio 1 (800x450 px)
│       │   ├── entorno-aeroportuario.jpg   ← Servicio 2 (800x450 px)
│       │   └── seguridad-operacional.jpg   ← Servicio 3 (800x450 px)
│       ├── capacidades/
│       │   ├── nuevos-aeropuertos.jpg          ← Capacidad 01 (720x400 px)
│       │   ├── modernizacion-espacio-aereo.jpg ← Capacidad 02 (720x400 px)
│       │   ├── optimizacion-procedimientos.jpg ← Capacidad 03 (720x400 px)
│       │   ├── nuevos-procedimientos.jpg       ← Capacidad 04 (720x400 px)
│       │   └── cambios-operacionales.jpg       ← Capacidad 05 (720x400 px)
│       ├── equipo/
│       │   └── [fotos del equipo]     ← Para futura sección de equipo
│       └── logos/
│           ├── logo.svg               ← Logo principal SVG
│           ├── logo-white.svg         ← Logo en blanco para fondos oscuros
│           └── favicon.svg            ← Favicon SVG
└── README.md                          ← Este archivo
```

## Guía de imágenes

### Imágenes recomendadas para la sección HERO
- Foto aérea de aeropuerto, pista o espacio aéreo
- Cockpit de avión con instrumentos
- Radar o sala de control ATC
- Mapa de rutas aéreas
- **Formato**: JPG optimizado, mínimo 1920×1080px

### Imágenes para SERVICIOS (cards)
- Procedimientos de vuelo → Carta de aproximación, pantalla de simulador
- Entorno aeroportuario → Foto aérea de aeródromo, diagrama de obstáculos
- Seguridad operacional → Checklist, sala de análisis, documentación técnica
- **Formato**: JPG, 800×450px (relación 16:9)

### Imágenes para CAPACIDADES (items)
- Nuevos aeropuertos → Construcción de pista o aeródromo nuevo
- Modernización → Pantalla de radar moderno, ATC
- Optimización → Simulación de trayectoria
- Nuevos procedimientos → Carta aeronáutica, plotter de vuelo
- Cambios operacionales → Reunión técnica, análisis de datos
- **Formato**: JPG, 720×400px

### Logo
- Entregar logo en formato SVG con fondo transparente
- Versión en color oscuro (para fondos claros)
- Versión en blanco (para la navbar sobre fondos oscuros)

## Funcionalidades del sitio

- ✅ Diseño responsive (mobile, tablet, desktop)
- ✅ Navbar fija con cambio de estilo al hacer scroll
- ✅ Menú hamburguesa en mobile
- ✅ Animaciones fade-in al hacer scroll (Intersection Observer)
- ✅ Efecto parallax sutil en el hero
- ✅ Formulario de contacto con validación
- ✅ Scroll suave a secciones
- ✅ Indicador de sección activa en navbar

## Para publicar en internet

1. Subir toda la carpeta `website/` a un hosting (Netlify, Vercel, cPanel, etc.)
2. Conectar el formulario a un servicio como Formspree, EmailJS o backend propio
3. Agregar las imágenes según el listado de esta guía
4. Opcionalmente: agregar Google Analytics, pixel de Meta, etc.

---
Desarrollado para GIDEA-IFPD | Buenos Aires, Argentina
