---
name: top-seller-design
description: Use this skill to generate well-branded interfaces and assets for Top Seller, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Qué es Top Seller
Agencia de **marketing inmobiliario** (México, español) que vende **sistemas,
no servicios**. Producto estrella: **Sistema Referente Inmobiliario™** (método
**Embudo Invertido™**). Promesa: *"de asesor invisible a referente en 30 días"*.
Cliente: asesores/brokers/desarrolladores. Precio: $10K MXN/mes (valor $50K).
Enemigo de marca: *"el Modelo Invisible"*. Avatares: Asesor Invisible,
Competidor Oculto, Arquitecto del Mercado.

## Quick reference
- **Idioma:** español (México) en todo lo de cara al cliente.
- **Voz:** directa, confrontacional, emocional. Patrón firma: ❌ lo que creen →
  👉 la verdad. Términos: sistema, referente, invisible, control, visibilidad.
  Marca con ™ los nombres propios. Sin emoji en diseño de cara al cliente.
- **Colors:** morado `#7060D8` (primary), naranja `#F08048` (accent único),
  negro `#081010`, blanco. Ramps + alias en `tokens/colors.css`.
- **Type:** Gilroy only — ExtraBold (800) for display/UI, Light (300) for body. Files in `assets/fonts/`.
- **Logos:** `assets/logos/` — wordmark + geometric fox mark, in purple/black/white/orange.
- **Icons:** thin geometric line (stroke 1.75); kit set in `ui_kits/sales-platform/Icons.jsx`, Lucide as the recommended extension. No emoji.
- **Voice:** direct, motivating, sales-confident; speaks to "you"; no exclamation spam.

## Using the components
Link `styles.css`, load `_ds_bundle.js`, then read primitives from
`window.TopSellerDesignSystem_57ba3c` (Button, Card, Badge, Stat, Logo, …).
See `readme.md` for the full guide and `ui_kits/sales-platform/` for a worked example.
