# Nomada ✈️

**Nomada** (Flyealo) es una aplicación web moderna que te permite planificar tus viajes de forma inteligente usando el poder de la Inteligencia Artificial. Genera itinerarios personalizados en segundos basados en tus preferencias, destinos y presupuesto.

[![Angular](https://img.shields.io/badge/Angular-20.3-DD0031?style=flat&logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-20.4-007AD9?style=flat)](https://primeng.org/)

## 🌟 Características

- 🤖 **Generación de itinerarios con IA**: Crea planes de viaje personalizados en menos de 60 segundos
- 🗺️ **Integración con Mapbox**: Visualiza tus destinos en mapas interactivos
- 🔐 **Autenticación segura**: Sistema de login/registro con Supabase
- 📱 **Diseño responsivo**: Interfaz moderna y adaptable a cualquier dispositivo
- 🎨 **UI/UX Premium**: Diseño elegante con PrimeNG y componentes personalizados
- 📊 **Historial de viajes**: Guarda y accede a todos tus itinerarios anteriores
- 🌍 **180+ países**: Planifica viajes a más de 180 países alrededor del mundo
- 💯 **Gratis para empezar**: No requiere tarjeta de crédito

## 🚀 Tecnologías

Este proyecto utiliza las siguientes tecnologías de vanguardia:

- **Frontend Framework**: [Angular 20.3](https://angular.dev)
- **Lenguaje**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **UI Components**: [PrimeNG 20.4](https://primeng.org/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Mapas**: [Mapbox GL JS](https://www.mapbox.com/)
- **Estilos**: SCSS
- **Testing**: Jasmine & Karma

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18.x o superior)
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- [Angular CLI](https://angular.dev/tools/cli) versión 20.3.9

```bash
npm install -g @angular/cli@20.3.9
```

## 🛠️ Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/acanojiDev/nomada.git
cd nomada/nomada
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Configura las variables de entorno**

Crea los archivos de entorno en `src/environments/`:

- `environment.ts` (producción)
- `environment.development.ts` (desarrollo)

```typescript
// environment.development.ts
export const environment = {
  production: false,
  supabaseUrl: 'TU_SUPABASE_URL',
  supabaseKey: 'TU_SUPABASE_KEY',
  mapboxToken: 'TU_MAPBOX_TOKEN'
};
```

4. **Inicia el servidor de desarrollo**

```bash
npm start
# o
ng serve
```

5. **Abre tu navegador**

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques los archivos fuente.

## 📁 Estructura del Proyecto

```
nomada/
├── src/
│   ├── app/
│   │   ├── core/              # Servicios y guards centrales
│   │   │   ├── guards/        # Guards de autenticación
│   │   │   ├── interfaces/    # Interfaces TypeScript
│   │   │   └── services/      # Servicios (Auth, Itinerary)
│   │   ├── features/          # Páginas de la aplicación
│   │   │   ├── landing-page/  # Página de inicio
│   │   │   ├── home-page/     # Generador de itinerarios
│   │   │   ├── details-page/  # Detalles del itinerario
│   │   │   └── error-page/    # Página de error 404
│   │   ├── shared/            # Componentes compartidos
│   │   │   ├── components/    # Componentes reutilizables
│   │   │   └── validators/    # Validadores personalizados
│   │   ├── app.routes.ts      # Configuración de rutas
│   │   └── app.config.ts      # Configuración de la app
│   ├── environments/          # Variables de entorno
│   └── styles.scss            # Estilos globales
├── public/                    # Recursos estáticos
├── angular.json               # Configuración de Angular
├── package.json               # Dependencias del proyecto
└── tsconfig.json              # Configuración de TypeScript
```

## 🎯 Uso

### Para Usuarios

1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Genera tu itinerario**: 
   - Añade ciudades o lugares que deseas visitar
   - Selecciona la duración de tu viaje
   - Define tu presupuesto (opcional)
   - Indica tus intereses
   - Proporciona detalles adicionales
3. **Recibe tu plan**: La IA generará un itinerario personalizado en segundos
4. **Visualiza y guarda**: Revisa tu itinerario con mapas interactivos y guárdalo para futuras referencias

### Para Desarrolladores

#### Generar componentes

Angular CLI incluye herramientas poderosas de scaffolding:

```bash
ng generate component component-name
ng generate service service-name
ng generate guard guard-name
```

#### Compilar el proyecto

Para compilar el proyecto para producción:

```bash
npm run build
# o
ng build
```

Los archivos compilados se guardarán en el directorio `dist/`.

#### Ejecutar tests

```bash
npm test
# o
ng test
```

#### Formatear código

El proyecto usa Prettier con configuración personalizada:

```bash
npx prettier --write .
```

## 🔒 Autenticación y Seguridad

- Sistema de autenticación completo con Supabase
- Guards de ruta para proteger páginas privadas:
  - `authenticatedGuard`: Protege rutas que requieren login
  - `guestGuard`: Redirige usuarios autenticados
- Manejo seguro de tokens y sesiones

## 🗺️ Integración con Mapbox

La aplicación utiliza Mapbox GL JS para visualizar destinos en mapas interactivos. Asegúrate de obtener tu token de Mapbox en [mapbox.com](https://www.mapbox.com/).

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Convenciones de Código

- Usa TypeScript estricto
- Sigue las guías de estilo de Angular
- Escribe tests para nuevas funcionalidades
- Documenta funciones y componentes complejos
- Usa nombres descriptivos en español para variables de UI

## 🐛 Reportar Problemas

Si encuentras un bug o tienes una sugerencia, por favor [abre un issue](https://github.com/acanojiDev/nomada/issues).

## 📄 Licencia

Este proyecto es privado y está bajo desarrollo activo.

## 👨‍💻 Autor

Desarrollado por [acanojiDev](https://github.com/acanojiDev)

## 🙏 Agradecimientos

- Angular Team por el excelente framework
- PrimeNG por los componentes UI
- Supabase por el backend y autenticación
- Mapbox por la integración de mapas

## 📞 Soporte

Para soporte y consultas, por favor contacta a través de GitHub Issues.

---

**¡Feliz viaje!** ✈️🌍
