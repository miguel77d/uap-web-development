# Tarea 8 – Gestor de Tareas: Backend + Frontend con Autenticación y Autorización

Este proyecto consiste en una aplicación de gestión de tareas dividida en dos partes: **backend** (API REST con Express y Prisma) y **frontend** (React con Zustand + React Query). Incluye funcionalidades completas de autenticación, autorización, permisos por tablero y persistencia de datos en base de datos.

---

## Estructura del Repositorio

```
Tarea8/
├── Backend/
│   └── api-server/        → Servidor Express + Prisma + SQLite
└── Frontend/
    └── gestor-tareas/     → Aplicación React + Zustand + React Query
```

---

## Tecnologías Utilizadas

### Backend:
- Node.js + Express
- Prisma ORM + SQLite
- JWT + Cookies HTTP-only
- bcrypt para contraseñas
- Middlewares personalizados
- CORS

### Frontend:
- React + Vite
- Zustand para estado local
- React Query para estado del servidor
- Tailwind CSS para estilos
- React Router DOM

---

## Funcionalidades Principales

### Autenticación
- Registro y login
- Token JWT en cookie segura
- Middleware de autenticación
- Cierre de sesión (logout)

### Autorización con permisos
- Sistema de roles por tablero: `owner`, `editor`, `viewer`
- Middleware de verificación de permisos

### Gestión de Tableros
- Crear, editar, eliminar tableros (solo `owner`)
- Compartir tableros y cambiar roles

### Gestión de Tareas
- Crear, listar, editar, eliminar
- Filtros: estado (pendiente/completada), búsqueda, paginación
- Eliminar tareas completadas

### Configuraciones
- Preferencias por usuario (ej: texto en mayúsculas, intervalo de refresco)

---

## Instalación y Ejecución

###  Backend

1. Clonar el repo y entrar al backend:
```bash
cd Tarea8/Backend/api-server
npm install
```

2. Crear archivo `.env`:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET=tu_clave_secreta_segura
```

3. Ejecutar migraciones y cargar datos:
```bash
npx prisma migrate dev --name init
node scripts/crearDatosIniciales.js
```

4. Iniciar servidor:
```bash
npm run dev
```

###  Frontend

1. Ir a la carpeta del frontend:
```bash
cd Tarea8/Frontend/gestor-tareas
npm install
```

2. Configurar `.env` si es necesario:
```
VITE_API_URL=http://localhost:3000/api
```

3. Ejecutar aplicación:
```bash
npm run dev
```

---

##  Cómo Probar

### 1. Login de prueba
POST `http://localhost:3000/api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

🟢 Guarda la cookie en el navegador. El frontend detecta la sesión automáticamente.

### 2. Frontend
- Accedé a `http://localhost:5173`
- Crea tableros, tareas, cambia filtros
- Compartí tableros desde la vista de configuración

---

##  Roles y Permisos

| Rol     | Acciones Permitidas                            |
|---------|------------------------------------------------|
| Owner   | Todas: editar, eliminar, compartir             |
| Editor  | Crear, editar, completar y borrar tareas       |
| Viewer  | Solo ver tareas y tableros                     |

---

## Estructura del Proyecto

### Backend (api-server)
```
controllers/       → Lógica de rutas
middlewares/       → Autenticación y permisos
routes/            → Agrupación de endpoints
scripts/           → Carga de datos iniciales y permisos
prisma/schema.prisma → Base de datos
index.js           → Punto de entrada del servidor
```

### Frontend (gestor-tareas)
```
src/
├── components/    → Componentes de UI
├── pages/         → Páginas principales
├── store/         → Zustand
├── hooks/         → React Query
├── api/           → Llamadas a la API
└── App.jsx        → Rutas principales
```

---

##  Seguridad Aplicada

- JWT en cookie HTTP-only
- Autenticación robusta
- Autorización por rol en cada acción
- Validaciones básicas de entrada
- CORS habilitado

---

## Scripts disponibles

### Backend
- `crearDatosIniciales.js`: crea usuarios, tableros y tareas de prueba
- `agregarPermiso.js`: agrega roles a usuarios sobre tableros

---

##  Notas Finales

- El sistema está listo para integrarse con cualquier frontend moderno.
- Todas las funcionalidades básicas y avanzadas están cubiertas.
- Documentación, autenticación y seguridad mínimas implementadas correctamente.

---