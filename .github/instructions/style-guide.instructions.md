---
applyTo: '**'
description: Guía de estilo de Angular para el proyecto
---

# Angular Style Guide - Carrocerias RMS

Esta guía establece las convenciones de estilo para el código Angular del proyecto. Seguir estas prácticas promueve la consistencia y facilita el mantenimiento del código.

## Principio Fundamental

**Cuando tengas dudas, prioriza la consistencia.** Si estas reglas contradicen el estilo de un archivo en particular, mantén la consistencia dentro del archivo.

---

## 📁 Nomenclatura de Archivos

### Separar palabras con guiones

- ✅ `user-profile.ts`
- ❌ `userProfile.ts` o `user_profile.ts`

### Archivos de pruebas terminan en `.spec.ts`

- ✅ `user-profile.spec.ts`
- ❌ `user-profile.test.ts`

### Nombres de archivos reflejan el identificador TypeScript

- Componente `UserProfile` → `user-profile.ts`
- Servicio `ProductImagesService` → `product-images.service.ts`

### Componentes: mismo nombre base para TypeScript, template y estilos

- `user-profile.ts`
- `user-profile.html`
- `user-profile.css`

Si hay múltiples archivos de estilos:

- `user-profile-settings.css`
- `user-profile-subscription.css`

---

## 🏗️ Estructura del Proyecto

### Todo el código de la aplicación va en `src/`

- Código UI (TypeScript, HTML, CSS) → dentro de `src/`
- Configuración y scripts → fuera de `src/`

### Bootstrap en `main.ts`

- El punto de entrada siempre es `src/main.ts`

### Agrupar archivos relacionados en el mismo directorio

```
src/app/features/
├─ customers/
│  ├─ customers-list/
│  │  ├─ customers-list.ts
│  │  ├─ customers-list.html
│  │  ├─ customers-list.css
│  │  └─ customers-list.spec.ts
│  ├─ customers-edit/
│  └─ customers-create/
```

### Organizar por áreas de funcionalidad (features)

✅ **PREFERIR:**

```
src/app/
├─ features/
│  ├─ products/
│  ├─ customers/
│  ├─ orders/
├─ core/
│  ├─ services/
│  ├─ guards/
├─ shared/
│  ├─ components/
│  ├─ directives/
```

❌ **EVITAR:**

```
src/app/
├─ components/
├─ directives/
├─ services/
```

### Un concepto por archivo

- Un componente, directiva o servicio por archivo
- Excepción: clases pequeñas relacionadas que forman un solo concepto

---

## 💉 Inyección de Dependencias

### Preferir `inject()` sobre inyección en constructor

✅ **PREFERIR:**

```typescript
import { inject } from '@angular/core';

export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  // Comentarios más claros para cada dependencia
  private readonly logger = inject(LoggerService); // Para logging de errores
}
```

❌ **EVITAR:**

```typescript
export class ProductService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private logger: LoggerService
  ) {}
}
```

**Ventajas de `inject()`:**

- Más legible con muchas dependencias
- Mejor inferencia de tipos
- Más fácil agregar comentarios
- Evita separar declaración e inicialización con ES2022+

---

## 🎨 Componentes y Directivas

### Selectores de componentes

- Usar prefijo específico de la aplicación (ej: `app-`, `mr-`)
- ✅ `app-user-profile`
- ✅ `mr-tooltip`

### Nomenclatura de miembros

**Inputs:**

- Nombres descriptivos en camelCase
- ✅ `userId`, `productName`

**Outputs:**

- Nombres que describen eventos en camelCase
- ✅ `userSaved`, `itemDeleted`

### Agrupar propiedades Angular antes de los métodos

✅ **PREFERIR:**

```typescript
@Component({
  /* ... */
})
export class UserProfile {
  // Dependencias inyectadas
  private readonly userService = inject(UserService);

  // Inputs
  readonly userId = input<string>();

  // Outputs
  readonly userSaved = output<void>();

  // Queries
  @ViewChildren(PaymentMethod) readonly paymentMethods?: QueryList<PaymentMethod>;

  // Signals y propiedades
  protected userName = signal('');

  // Métodos
  protected saveUser(): void {
    // ...
  }
}
```

### Usar `protected` para miembros usados solo en templates

```typescript
@Component({
  template: `<p>{{ fullName() }}</p>`
})
export class UserProfile {
  firstName = input();
  lastName = input();

  // `fullName` no es parte de la API pública, pero se usa en el template
  protected fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
}
```

### Usar `readonly` para propiedades que no deben cambiar

```typescript
@Component({
  /* ... */
})
export class UserProfile {
  readonly userId = input();
  readonly userSaved = output();
  readonly userName = model();

  @ViewChildren(PaymentMethod) readonly paymentMethods?: QueryList<PaymentMethod>;
}
```

### Preferir `class` y `style` sobre `ngClass` y `ngStyle`

✅ **PREFERIR:**

```html
<div [class.admin]="isAdmin" [class.dense]="density === 'high'">
  <!-- O -->
  <div [class]="{admin: isAdmin, dense: density === 'high'}"></div>
</div>
```

❌ **EVITAR:**

```html
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}"></div>
```

### Nombrar event handlers por lo que HACEN, no por el evento

✅ **PREFERIR:**

```html
<button (click)="saveUserData()">Save</button>
<textarea (keydown.control.enter)="commitNotes()"></textarea>
```

❌ **EVITAR:**

```html
<button (click)="handleClick()">Save</button>
```

### Mantener métodos de ciclo de vida simples

✅ **PREFERIR:**

```typescript
ngOnInit() {
  this.startLogging();
  this.runBackgroundTask();
}

private startLogging(): void {
  this.logger.setMode('info');
  this.logger.monitorErrors();
}
```

❌ **EVITAR:**

```typescript
ngOnInit() {
  this.logger.setMode('info');
  this.logger.monitorErrors();
  // ...mucho código más aquí
}
```

### Usar interfaces de ciclo de vida

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  /* ... */
})
export class UserProfile implements OnInit, OnDestroy {
  ngOnInit(): void {
    // La interfaz OnInit asegura que el método esté nombrado correctamente
  }

  ngOnDestroy(): void {
    // ...
  }
}
```

---

## 🎯 Mejores Prácticas Adicionales

### Componentes enfocados en presentación

- Mantener lógica de negocio en servicios
- Componentes deben enfocarse en la UI
- Refactorizar validaciones y transformaciones a funciones/clases separadas

### Evitar lógica compleja en templates

- Usar `computed()` para lógica compleja
- Mantener expresiones de template simples y legibles

✅ **PREFERIR:**

```typescript
export class UserList {
  users = signal<User[]>([]);

  protected activeUsers = computed(() => this.users().filter((u) => u.isActive));
}
```

```html
<div *ngFor="let user of activeUsers()">{{ user.name }}</div>
```

❌ **EVITAR:**

```html
<div *ngFor="let user of users().filter(u => u.isActive)">{{ user.name }}</div>
```

---

## 📋 Checklist de Revisión

Antes de hacer commit, verifica:

- [ ] Nombres de archivos con guiones (kebab-case)
- [ ] Archivos agrupados por feature
- [ ] Uso de `inject()` para dependencias
- [ ] Propiedades Angular agrupadas antes de métodos
- [ ] Uso de `protected` para miembros de template
- [ ] Uso de `readonly` en inputs, outputs y queries
- [ ] Preferencia de `class`/`style` sobre `ngClass`/`ngStyle`
- [ ] Event handlers con nombres descriptivos
- [ ] Métodos de ciclo de vida simples
- [ ] Implementación de interfaces de ciclo de vida
- [ ] Lógica compleja fuera de templates

---

## 🔗 Referencias

- [Angular Official Style Guide](https://angular.dev/style-guide)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
