# Mixólogo IA · Buscador de Bebidas

Aplicación web desarrollada con React y TypeScript para buscar recetas, guardar bebidas favoritas y crear recetas personalizadas con inteligencia artificial.

## Demo

https://proyecto-bebidas-react.netlify.app

## Características

- Búsqueda por ingrediente y categoría mediante TheCocktailDB.
- Ficha completa de cada bebida.
- Favoritos persistentes en el navegador.
- Generador de recetas con IA y formato profesional.
- Ejemplos rápidos, estados de carga y manejo de errores.
- Integración segura con OpenRouter mediante una función de Netlify.
- Diseño responsive.

## Tecnologías

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- Zod
- Axios
- Netlify Functions
- OpenRouter

## Instalación

```bash
git clone https://github.com/Crowlley2001/proyecto-bebidas-react.git
cd proyecto-bebidas-react
npm install
```

Para trabajar únicamente con la búsqueda tradicional:

```bash
npm run dev
```

Para probar también la función de IA localmente:

```bash
npx netlify dev
```

## Variable privada

La clave de OpenRouter se configura en **Netlify → Project configuration → Environment variables**:

```env
OPENROUTER_API_KEY="tu_clave_privada"
OPENROUTER_MODEL="openrouter/free"
```

La clave no debe comenzar con `VITE_`, porque las variables con ese prefijo se incluyen en el frontend y pueden quedar expuestas.

## Seguridad

El navegador llama a `/.netlify/functions/generate-recipe`. La función valida la solicitud, utiliza la clave privada del servidor y devuelve únicamente la receta generada.

## Autor

Daniel Estrada · https://github.com/Crowlley2001
