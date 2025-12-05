# Modelos 3D

Esta carpeta contiene los archivos `.glb` de los modelos 3D utilizados en el visualizador de productos.

## Modelos Actuales

- `bi-model-3d.glb` - Brazo de Izaje (modelo por defecto)

## Cómo Agregar un Nuevo Modelo 3D

### 1. Preparar el Archivo

- El modelo debe estar en formato **GLB** (GLTF Binary)
- Recomendaciones:
  - Tamaño: Menor a 10 MB
  - Polígonos: Optimizado (evitar modelos con millones de polígonos)
  - Texturas: Comprimidas y embebidas en el GLB

### 2. Nombrar el Archivo

Usa un nombre descriptivo en `kebab-case`:

```
brazo-pesado-model.glb
brazo-liviano-model.glb
contenedor-10m3.glb
```

### 3. Colocar el Archivo

Copia el archivo `.glb` en esta carpeta: `src/assets/models/3d/`

### 4. Configurar en el Código

Edita el archivo: `src/app/features/products/product-detail/product-detail.ts`

En el computed signal `model3DName`, agrega el mapeo:

```typescript
protected readonly model3DName = computed(() => {
  const product = this.product();
  if (!product || product.categoryId !== '1-brazos-de-izaje') return '';

  // Mapeo por subcategoría
  if (product.subcategoryId === 'brazo-de-izaje-carga-pesada-14-20tn') {
    return 'brazo-pesado-model'; // ← nombre del archivo sin extensión
  }

  if (product.subcategoryId === 'brazo-de-izaje-carga-liviana-3-5tn') {
    return 'brazo-liviano-model';
  }

  // Modelo por defecto
  return 'bi-model-3d';
});
```

### 5. Habilitar para Otras Categorías (Opcional)

Si quieres mostrar el modelo 3D para otras categorías además de "Brazos de Izaje":

Edita el computed signal `shouldShow3DModel`:

```typescript
protected readonly shouldShow3DModel = computed(() => {
  const product = this.product();
  // Agrega más categorías aquí
  return product?.categoryId === '1-brazos-de-izaje'
      || product?.categoryId === '2-contenedores';
});
```

Y actualiza el mapeo en `model3DName` para incluir la lógica de las nuevas categorías:

```typescript
protected readonly model3DName = computed(() => {
  const product = this.product();
  if (!product) return '';

  // Brazos de izaje
  if (product.categoryId === '1-brazos-de-izaje') {
    return 'bi-model-3d';
  }

  // Contenedores
  if (product.categoryId === '2-contenedores') {
    return 'contenedor-10m3';
  }

  return '';
});
```

## Herramientas Recomendadas

- **Blender** - Para crear/editar modelos 3D
- **gltf.report** - Para optimizar archivos GLB
- **glTF Validator** - Para validar el formato

## Optimización

Para mejor rendimiento:

1. Reducir polígonos usando simplificación de malla
2. Comprimir texturas (usar WebP o JPG)
3. Usar compresión Draco (ya configurado en el componente)
4. Limitar tamaño de archivo a 5-10 MB máximo

## Soporte

Para preguntas contactar a: gersonjeanpierre
