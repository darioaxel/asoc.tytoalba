---
title: 'Segundo artículo del blog'
description: 'Otro ejemplo de artículo usando Nuxt Content'
date: 2025-12-02
author: 'Autor del blog'
---

# Segundo artículo

Este es un segundo artículo para demostrar cómo se vería tener múltiples entradas en tu blog.

## Más contenido

Nuxt Content permite crear blogs y sitios web con contenido dinámico a partir de archivos Markdown.

- Fácil de usar
- Potente
- Flexible

## Código de ejemplo

```vue
<template>
  <div class="blog-post">
    <h1>{{ title }}</h1>
    <ContentRenderer :value="article" />
  </div>
</template>
```

Con esta configuración, puedes crear tantos artículos como desees simplemente añadiendo archivos Markdown a la carpeta `content/articles`.