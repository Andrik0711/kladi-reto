# 🛠️ Kladi Ferretería - Gestión de Catálogo Inicial

---

## 🧱 FASE 1: ESTRUCTURA DEL PROYECTO

### ✅ Tecnologías y herramientas sugeridas

- **Frontend:** React + TypeScript
- **Framework de UI:** Material UI
- **Gestión de estado:** Context API
- **Consumo de API:** Axios
- **Routing:** React Router DOM
- **Build:** Vite
- **Formateo y Lint:** Prettier + ESLint

**Extras (puntos extra):**

<!-- - SSR con Next.js  -->

- Deploy en Netlify
- Pruebas unitarias con Vitest o Jest

---

## 🧩 FASE 2: CONSUMO DE LA API

- 🌐 API externa: Se consume el catálogo de productos desde una API abierta de Kladi.

---

## 🎨 FASE 3: UI DE VISUALIZACIÓN Y EDICIÓN

### ✏️ Componentes clave

- **ProductTable** con campos editables (precio e inventario)
- **Filtros:** por texto, rango de precio, estado de inventario
- **Botones:** restaurar precios, finalizar

### 🧮 Lógica clave

- Comparar `precio_actual !== precio_sugerido` o `inventario_actual !== inventario_original` para saber si fue modificado.
- Campo editable con validación numérica.

---

## ✅ FASE 4: PANTALLA DE RESUMEN Y GUARDADO

### 📋 Mostrar

- Lista de productos modificados
- Total de productos modificados
- Suma del inventario

### 🧩 Funcionalidad

- Botón "Guardar cambios": muestra modal de éxito.
- Botón "Regresar": vuelve a pantalla de edición.

---

## 🧪 FASE 5: MEJORAS Y ENVÍO

### 🏅 Puntos extra

- ✅ SSR con Next.js
- ✅ Columna y filtro por categoría
- ✅ Modificación por grupos
- ✅ Marca visual de productos editados
- ✅ Pruebas unitarias

### 📤 Deploy y envío

- Publicar en GitHub y desplegar en Netlify.
- Incluir README con:
    - Descripción
    - Instrucciones de instalación
    - Justificación de decisiones técnicas
    - Capturas de pantalla

---

## ✨ Funcionalidades principales

- Visualización de catálogo con campos editables (`precio` e `inventario`)
- Filtro de productos por nombre o clave
- Filtros por rango de precio y estado de inventario
- Restauración de precios sugeridos
- Detección de productos modificados (precio/inventario editado)
- Pantalla de resumen con lista de productos modificados
- Modal de éxito al guardar cambios
- Navegación entre vista de edición y resumen

---

## 🧑‍💻 Tecnologías utilizadas

- ⚛️ **React** + **TypeScript**
- 🎨 [Material UI (MUI)](https://mui.com/)
- 🌐 [Axios](https://axios-http.com/) – Consumo de API externa
- ⚡ [Vite](https://vitejs.dev/) – Entorno de desarrollo rápido
- 🧠 **React Context API** – Para estado global
- 🧪 ESLint + Prettier – Buenas prácticas de código

---

## 📁 Estructura del Proyecto

```
kladi-ferreteria/
├── public/
│   └── index.html
├── src/
│   ├── __tests__/
│   │   ├── ProductTable.test.tsx  # Pruebas unitarias de la tabla
│   │   ├── ProductFilters.test.tsx # Pruebas unitarias de filtros
│   │   └── SummaryModal.test.tsx   # Pruebas unitarias del modal
│   ├── api/
│   │   └── kladiApi.ts         # Cliente Axios para API de Kladi
│   ├── adapters/
│   │   └── productAdapters.ts   # Sanitización de datos de productos
│   ├── components/
│   │   ├── ProductTable.tsx    # Tabla editable de productos
│   │   ├── ProductFilters.tsx  # Barra de búsqueda y filtro modificado
│   │   └── SummaryModal.tsx    # Modal de éxito tras guardar
│   ├── context/
│   │   └── ProductContext.tsx  # Estado global de productos
│   ├── pages/
│   │   ├── EditProducts.tsx    # Pantalla principal (edición)
│   │   └── Summary.tsx         # Pantalla resumen de cambios
│   ├── types/
│   │   └── Product.ts          # Tipado del modelo de producto
│   ├── App.tsx                 # Rutas y layout
│   ├── main.tsx                # Entrada principal + Theme MUI
│   └── ...
├── .eslintrc.json              # Configuración ESLint (4 espacios)
├── .prettierrc                 # Configuración Prettier (4 espacios)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Instalación y uso local

### 1. Clona el repositorio

```bash
git clone https://github.com/Andrik0711/kladi-reto.git
cd kladi-reto
```

### 2. Instala Material UI (MUI) y otras dependencias

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install axios react-router-dom
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Instala ESLint y Prettier (opcional pero recomendado)

```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### 4. Scripts útiles

- `npm run lint` — Ejecuta ESLint sobre el código fuente
- `npm run format` — Formatea el código con Prettier

### 5. Inicia el servidor de desarrollo

```bash
npm run dev
```

### 6. Abre la app en tu navegador

[http://localhost:5173](http://localhost:5173)

---

## 📌 Consideraciones Técnicas

- Se utiliza el API abierto de Kladi para poblar productos:  
  https://catalogo-kladi.dev.rombo.microsipnube.com

- Los productos se enriquecen en frontend con campos auxiliares como `precio_actual`, `inventario_actual`, `inventario_original` y `modificado`.

- La detección de cambios se basa en comparar `precio_actual` con `precio_sugerido` e `inventario_actual` con `inventario_original`.

---

## 🧪 Pruebas

El proyecto incluye pruebas unitarias automáticas usando [Vitest](https://vitest.dev/) y [Testing Library](https://testing-library.com/).

### Ejecutar pruebas

```bash
npm run test         # Ejecuta todas las pruebas en modo consola
npm run test:ui      # Ejecuta las pruebas en modo interactivo (UI)
```

Los archivos de prueba se encuentran en `src/__tests__/` para mantener una arquitectura limpia y escalable.

---
