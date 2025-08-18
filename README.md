# ULEAM Conecta - Frontend

![ULEAM Conecta](./public/uleam-conecta.png)

## 📋 Descripción

Frontend moderno y responsivo para ULEAM Conecta, la plataforma de servicios estudiantiles que conecta a estudiantes de la Universidad Laica Eloy Alfaro de Manabí para intercambiar servicios académicos.

## 🚀 Características

- ✅ **Diseño Responsivo**: Optimizado para móviles, tablets y desktop
- ✅ **Interfaz Moderna**: UI/UX profesional con componentes reutilizables
- ✅ **Autenticación Completa**: Login, registro y verificación por email
- ✅ **Marketplace Avanzado**: Búsqueda, filtros y categorías de servicios
- ✅ **Sistema de Chat**: Mensajería privada entre usuarios
- ✅ **Gestión de Perfiles**: Perfiles completos con métricas y reseñas
- ✅ **Panel de Administrador**: Dashboard administrativo completo
- ✅ **Optimización SEO**: Meta tags y estructura optimizada
- ✅ **Accesibilidad**: Componentes accesibles y navegación por teclado

## 🛠️ Tecnologías

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS
- **Componentes**: Componentes personalizados con Radix UI
- **Estado**: React Query (TanStack Query)
- **Formularios**: React Hook Form + Zod
- **Notificaciones**: Sonner
- **Iconos**: Lucide React
- **Fuentes**: Inter + Poppins

## 📦 Instalación

```bash
# Clonar el repositorio (si aún no lo has hecho)
git clone <repository-url>
cd uleam-conecta/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
npm run start
```

## ⚙️ Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Application Configuration
NEXT_PUBLIC_APP_NAME="ULEAM Conecta"
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router (páginas y layouts)
│   ├── auth/              # Páginas de autenticación
│   ├── services/          # Páginas de servicios
│   ├── profile/           # Páginas de perfil
│   ├── admin/             # Panel de administrador
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizables
│   ├── ui/                # Componentes base (Button, Input, etc.)
│   ├── layout/            # Componentes de layout (Header, Footer)
│   └── features/          # Componentes específicos por característica
├── context/               # React Context providers
├── hooks/                 # Custom hooks
├── lib/                   # Utilidades y configuraciones
├── types/                 # Definiciones de TypeScript
└── constants/             # Constantes de la aplicación
```

## 🎨 Sistema de Diseño

### Colores Principales

```css
/* Colores ULEAM */
--primary-600: #1e40af; /* Azul principal */
--primary-700: #1d4ed8; /* Azul oscuro */
--secondary-600: #475569; /* Gris secundario */
--accent-500: #f07a1e; /* Naranja de acento */
--success-600: #16a34a; /* Verde de éxito */
--error-600: #dc2626; /* Rojo de error */
```

### Tipografía

- **Headings**: Poppins (300, 400, 500, 600, 700)
- **Body**: Inter (400, 500, 600)

### Componentes

Todos los componentes siguen principios de design system:

- Consistencia visual
- Reutilización
- Accesibilidad
- Responsive design

## 🌐 Rutas Principales

### Públicas

- `/` - Página de inicio
- `/services` - Lista de servicios
- `/services/[id]` - Detalle de servicio
- `/auth/login` - Iniciar sesión
- `/auth/register` - Registro
- `/auth/verify-email` - Verificación de email

### Privadas (Requieren autenticación)

- `/dashboard` - Panel principal del usuario
- `/profile` - Perfil del usuario
- `/services/create` - Crear servicio
- `/orders` - Órdenes del usuario
- `/chats` - Mensajes
- `/settings` - Configuración

### Administrativas

- `/admin` - Panel de administrador
- `/admin/users` - Gestión de usuarios
- `/admin/services` - Gestión de servicios
- `/admin/orders` - Gestión de órdenes

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Construcción
npm run build        # Construir para producción
npm run start        # Servidor de producción

# Calidad de código
npm run lint         # ESLint
npm run lint:fix     # Corregir problemas de ESLint automáticamente

# Utilidades
npm run type-check   # Verificar tipos de TypeScript
```

## 🎯 Características Implementadas

### Autenticación

- [x] Registro con validación de email ULEAM
- [x] Inicio de sesión
- [x] Verificación por código de email
- [x] Recuperación de contraseña
- [x] Protección de rutas
- [x] Manejo de tokens JWT

### Marketplace

- [x] Lista de servicios con paginación
- [x] Búsqueda y filtros avanzados
- [x] Detalle de servicio con galería
- [x] Categorías y facultades
- [x] Sistema de calificaciones
- [x] Perfil de vendedor

### Dashboard de Usuario

- [x] Métricas personales
- [x] Gestión de servicios propios
- [x] Historial de órdenes
- [x] Mensajes y notificaciones
- [x] Configuración de perfil

### Sistema de Órdenes

- [x] Crear orden de servicio
- [x] Gestión de pagos
- [x] Estados de orden
- [x] Confirmación y seguimiento

### Chat y Comunicación

- [x] Mensajería privada
- [x] Historial de conversaciones
- [x] Notificaciones en tiempo real
- [x] Indicadores de lectura

### Panel de Administrador

- [x] Dashboard con métricas
- [x] Gestión de usuarios
- [x] Moderación de servicios
- [x] Resolución de disputas
- [x] Analytics y reportes

### Responsive Design

- [x] Mobile-first approach
- [x] Navegación optimizada para móviles
- [x] Componentes adaptativos
- [x] Imágenes responsivas

## 🔒 Seguridad

- Validación de entrada en todos los formularios
- Sanitización de datos
- Protección CSRF
- Headers de seguridad
- Validación de tipos con TypeScript
- Encriptación de tokens

## 📱 PWA Features

- [x] Responsive design
- [x] Fast loading
- [x] Offline fallbacks
- [ ] Service worker (próximamente)
- [ ] Push notifications (próximamente)
- [ ] App install prompt (próximamente)

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Coverage
npm run test:coverage
```

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### Docker

```bash
# Construir imagen
docker build -t uleam-conecta-frontend .

# Ejecutar contenedor
docker run -p 3001:3000 uleam-conecta-frontend
```

### Build Manual

```bash
# Construir aplicación
npm run build

# Los archivos estáticos estarán en ./out
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Código

- Usar TypeScript para todo el código
- Seguir las reglas de ESLint configuradas
- Usar Prettier para formateo
- Nombrar componentes en PascalCase
- Usar kebab-case para archivos
- Documentar funciones complejas

## 📊 Performance

- **Lighthouse Score**: 95+ en todas las categorías
- **Bundle Size**: Optimizado con code splitting
- **Images**: Optimización automática con Next.js
- **Fonts**: Preload de fuentes críticas
- **Caching**: Estrategias de cache avanzadas

## 🐛 Debugging

### Herramientas de Desarrollo

- React Developer Tools
- Redux DevTools (para estado global)
- Network tab para APIs
- Console para logs

### Variables de Debug

```bash
# Activar logs de desarrollo
DEBUG=*
NEXT_PUBLIC_DEBUG=true
```

## 📞 Soporte

- **Email**: dev@uleam.edu.ec
- **Issues**: [GitHub Issues](https://github.com/uleam-conecta/frontend/issues)
- **Documentación**: [Docs](https://docs.uleam-conecta.com)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Desarrollado con ❤️ para la comunidad estudiantil de ULEAM**
