# Análisis: Por qué los textos se ven diminutos en 1920x1080

## Resumen

El frontend tiene **3 problemas de raíz** que, combinados, hacen que todo se vea microscópico en pantallas de escritorio:

1. Uso masivo de `text-[10px]` — 44 instancias en todo el proyecto
2. Falta `<meta name="viewport">` en el HTML
3. No hay escalado de tipografía para pantallas grandes

---

## Problema #1: Abuso de `text-[10px]` y `text-[11px]`

Este es el problema principal. Hay **44 instancias** de `text-[10px]` (10 píxeles) y **14 instancias** de `text-[11px]` repartidas por todo el proyecto. 10px está por debajo del estándar WCAG AA de accesibilidad (mínimo 12px).

### Inventario completo de tamaños usados

| Clase | Tamaño real | Instancias | Problema |
|-------|-------------|------------|----------|
| `text-[10px]` | 10px | 44 | Ilegible en desktop |
| `text-[11px]` | 11px | 14 | Casi ilegible |
| `text-xs` | 12px (0.75rem) | 55 | Muy pequeño para labels |
| `text-sm` | 14px (0.875rem) | 72 | Aceptable para secundario |
| `text-base` | 16px (1rem) | 8 | Tamaño base — SOLO 8 usos |
| `text-lg` | 18px | 17 | Bueno para cuerpo |
| `text-xl` | 20px | 7 | Bueno para subtítulos |
| `text-2xl` | 24px | 6 | Títulos |
| `text-3xl+` | 30px+ | 9 | Headers principales |

**El 76% de todo el texto del proyecto usa 14px o menos.**
Solo 8 elementos en todo el frontend usan el tamaño base de 16px.

### Archivos más afectados

**`StatsBar.tsx`** — 4 labels de estadísticas en `text-[10px]`:
```tsx
// Líneas 23, 42, 59, 87
<span className="text-[10px] font-bold uppercase tracking-widest">
  Total Value Locked / 24h Volume / Extra Yield / Network Status
</span>
```

**`Sidebar.tsx`** — 3 encabezados de sección en `text-[10px]`:
```tsx
// Líneas 63, 90, 206
<h4 className="text-[10px] font-bold uppercase tracking-[0.15em]">
  Explore / Filter By / Stellar Network Info
</h4>
```

**`Navbar.tsx`** — Badge de Stellar en `text-[10px]`:
```tsx
// Línea 43
<span className="text-[10px] font-bold uppercase tracking-wider text-yes">
  Stellar
</span>
```

**`Footer.tsx`** — 3 encabezados de columna en `text-[10px]`:
```tsx
// Líneas 36, 76, 87
<h4 className="text-[10px] font-bold uppercase tracking-wider">
  Product / Ecosystem / Built For
</h4>
```

**`MarketCard.tsx`** — Categoría en `text-[10px]`:
```tsx
// Línea 32
<div className="text-[10px] font-bold uppercase">
  {market.category}
</div>
```

**`page.tsx` (home)** — Headers de actividad en `text-[10px]` y `text-[11px]`:
```tsx
// Activity sidebar, featured hero labels, section headers
```

**`SignalsTable.tsx`** — 6 headers de tabla en `text-[10px]`:
```tsx
// Todos los <TableHead>
<TableHead className="text-[10px] font-semibold uppercase tracking-wider">
```

**`MobileNav.tsx`** — Labels de navegación en `text-[10px]`:
```tsx
// Línea 48
className="text-[10px] font-medium"
```

**`TradingPanel.tsx`** — Labels "Predict" en `text-xs`, footer en `text-[10px]`:
```tsx
// Líneas 93, 113, 201
```

**`portfolio/page.tsx`** — Labels de yield y deposited en `text-[10px]`:
```tsx
// YieldBanner: líneas 203, 214
```

**`markets/[id]/page.tsx`** — Stats en `text-[10px]`:
```tsx
// Múltiples labels de metadata
```

---

## Problema #2: Falta `<meta name="viewport">`

**Archivo:** `src/app/layout.tsx`

```tsx
<html lang="en" className="dark" suppressHydrationWarning>
  <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
```

**Falta completamente:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

Sin esta meta tag:
- El navegador puede aplicar escalado inesperado
- En pantallas de alta densidad (HiDPI/Retina) el renderizado es diferente
- El responsive design no funciona correctamente

**Nota:** Next.js 16 normalmente inyecta esta tag automáticamente, pero al usar `suppressHydrationWarning` y no exportar un `viewport` object en metadata, puede que no se genere correctamente en todos los casos.

---

## Problema #3: No hay escalado para pantallas grandes

**Archivo:** `src/app/globals.css`

No existe ninguna estrategia de escalado tipográfico:

- **No hay `font-size` base** en `html` o `body` — se usa el default del navegador (16px)
- **No hay `clamp()`** para responsive — los tamaños son fijos
- **No hay media queries** que aumenten tamaños en pantallas grandes
- **No hay custom fontSize** en la configuración de Tailwind (no existe `tailwind.config.ts`)

El resultado: en una pantalla de 1920x1080, se usan los **mismos 10px y 12px** que en un móvil de 375px. No hay ningún escalado.

---

## Problema #4: Restricciones de `max-width` agravan la percepción

| Contenedor | Max-width | % de 1920px usado |
|------------|-----------|---------------------|
| Páginas principales | `max-w-[1400px]` | 73% |
| Dashboard/Navbar/Footer | `max-w-[1600px]` | 83% |

El contenido ocupa como máximo el 73-83% del ancho de pantalla. Esto deja márgenes vacíos a los lados que hacen que el texto, ya de por sí pequeño, se vea aún más diminuto en proporción al espacio total visible.

---

## Problema #5: Letter-spacing y line-height comprimen el texto

**`globals.css`** aplica compresión tipográfica agresiva:

```css
h1, h2, h3, h4, h5, h6 {
  letter-spacing: -0.025em;  /* Comprime horizontalmente */
  line-height: 1.15;         /* Comprime verticalmente */
}
h1 {
  letter-spacing: -0.035em;  /* Aún más comprimido */
}
```

Además, muchos elementos combinan `uppercase` + `tracking-widest` + `text-[10px]`, que es legible en un diseño Figma pero ilegible en una pantalla real a distancia normal de lectura.

---

## Escala de severidad por archivo

| Archivo | Instancias ≤11px | Instancias text-xs (12px) | Total "diminuto" |
|---------|-------------------|---------------------------|-------------------|
| `page.tsx` (home) | 8 | 6 | 14 |
| `StatsBar.tsx` | 4 | 2 | 6 |
| `Sidebar.tsx` | 3 | 5 | 8 |
| `Footer.tsx` | 3 | 4 | 7 |
| `SignalsTable.tsx` | 6 | 0 | 6 |
| `Navbar.tsx` | 1 | 3 | 4 |
| `MarketCard.tsx` | 2 | 1 | 3 |
| `TradingPanel.tsx` | 1 | 3 | 4 |
| `portfolio/page.tsx` | 4 | 3 | 7 |
| `markets/[id]/page.tsx` | 2 | 4 | 6 |
| `MobileNav.tsx` | 1 | 0 | 1 |
| `EmptyState.tsx` | 1 | 1 | 2 |
| `SkeletonCard.tsx` | 0 | 0 | 0 |
| Otros componentes | ~2 | ~4 | ~6 |
| **TOTAL** | **~38** | **~36** | **~74** |

---

## Solución recomendada

### 1. Reemplazar todos los `text-[10px]` → `text-xs` (12px) mínimo

En muchos casos, los labels que usan `text-[10px]` deberían ser `text-sm` (14px) en desktop:
```tsx
// ANTES (ilegible)
<span className="text-[10px] font-bold uppercase tracking-widest">

// DESPUÉS (legible)
<span className="text-sm font-bold uppercase tracking-wider">
```

### 2. Subir un nivel general de tamaños

| Uso actual | Debería ser | Contexto |
|------------|-------------|----------|
| `text-[10px]` | `text-xs` o `text-sm` | Labels, badges |
| `text-[11px]` | `text-sm` | Subtexto |
| `text-xs` (labels) | `text-sm` | Labels de formularios, stats |
| `text-sm` (body) | `text-base` | Texto de cuerpo principal |
| `text-base` (subtítulos) | `text-lg` | Subtítulos de sección |
| `text-lg` (títulos card) | `text-xl` | Títulos de tarjetas |

### 3. Agregar viewport meta tag

En `layout.tsx`, exportar:
```tsx
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};
```

### 4. Considerar escalado responsive en globals.css

```css
html {
  font-size: 16px;
}

@media (min-width: 1440px) {
  html {
    font-size: 17px;
  }
}

@media (min-width: 1920px) {
  html {
    font-size: 18px;
  }
}
```

Esto escalaría TODO el texto proporcionalmente ya que Tailwind usa `rem`.
