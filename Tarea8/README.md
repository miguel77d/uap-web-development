
# Tarea 8 - Gestor de Tareas: Backend + Frontend con Autenticación y Autorización

Este proyecto consiste en una aplicación de gestión de tareas dividida en dos partes: **backend** (API REST con Express y Prisma) y **frontend** (React con Zustand + React Query). Incluye funcionalidades completas de autenticación, autorización, permisos por tablero y persistencia de datos en base de datos.

---

##  Estructura del Repositorio

```
Tarea8/
├── Backend/
│   └── api-server/        → Servidor Express + Prisma + SQLite
└── Frontend/
    └── gestor-tareas/     → Aplicación React + Zustand + React Query
```

---

## 🛠 Tecnologías Utilizadas

### Backend
- Node.js + Express
- Prisma ORM + SQLite
- JWT + Cookies HTTP-only
- bcrypt para contraseñas
- Middlewares personalizados
- CORS

### Frontend
- React + Vite
- Zustand (estado local)
- React Query (estado del servidor)
- Tailwind CSS (estilos)
- React Router DOM

---

##  Funcionalidades Principales

### Autenticación
- Registro y login de usuarios
- Token JWT guardado en cookie segura
- Middleware para proteger rutas
- Logout seguro

### Autorización con permisos
- Sistema de roles: `owner`, `editor`, `viewer`
- Permisos por tablero
- Middleware para verificar permisos

### Gestión de Tableros
- Crear, listar, eliminar tableros (solo `owner`)
- Compartir tableros con otros usuarios
- Cambiar roles

### Gestión de Tareas
- Crear, editar, eliminar tareas
- Filtros por estado (pendiente/completada)
- Búsqueda por texto
- Paginación
- Eliminar todas las completadas

### Configuraciones Personalizadas
- Intervalo de refresco
- Visualización en mayúsculas

---

##  Instalación y Ejecución

### 🔧 Backend

```bash
cd Tarea8/Backend/api-server
npm install
```

Crear archivo `.env` con:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET=tu_clave_secreta_segura
```

Inicializar base de datos y datos de prueba:

```bash
npx prisma migrate dev --name init
node scripts/crearDatosIniciales.js
```

Iniciar el servidor:

```bash
npm run dev
```

---

### Frontend

```bash
cd Tarea8/Frontend/gestor-tareas
npm install
```

Editar `.env` si es necesario:

```
VITE_API_URL=http://localhost:3000/api
```

Ejecutar aplicación:

```bash
npm run dev
```

---

##  Cómo Probar

### Login de prueba (Postman o navegador)

```
POST http://localhost:3000/api/auth/login
```

```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

- Guarda la cookie en el navegador.
- Accedé al frontend en `http://localhost:5173`.

---

## Roles y Permisos

| Rol    | Acciones permitidas                         |
|--------|----------------------------------------------|
| Owner  | Crear, editar, eliminar y compartir tableros |
| Editor | Crear, editar, eliminar tareas               |
| Viewer | Solo puede ver tareas/tableros               |

---

##  Endpoints de la API

###  Autenticación

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

###  Usuario Actual

- `GET /api/perfil`

###  Tableros

- `GET /api/tableros`
- `POST /api/tableros`
- `DELETE /api/tableros/:id`

###  Permisos

- `POST /api/permisos`
- `PATCH /api/permisos/:id`
- `DELETE /api/permisos/:id`

###  Tareas

- `GET /api/tareas?tableroId=1&estado=pendiente&q=texto&page=1&limit=10`
- `POST /api/tareas`
- `PUT /api/tareas/:id`
- `PATCH /api/tareas/:id`
- `DELETE /api/tareas/:id`
- `DELETE /api/tareas/completadas?tableroId=1`

###  Configuración

- `GET /api/configuracion`
- `PUT /api/configuracion`

---

##  Seguridad Aplicada

- Contraseñas hasheadas con `bcrypt`
- JWT en cookies HTTP-only
- Rutas protegidas por middleware
- Verificación de permisos por rol
- CORS habilitado solo para orígenes permitidos

---

##  Scripts Disponibles

- `crearDatosIniciales.js`: carga usuarios, tableros y tareas de prueba
- `agregarPermiso.js`: asigna permisos manualmente

---

## Notas Finales

- El sistema está listo para producción con integración completa entre frontend y backend.
- Se respetan buenas prácticas de autenticación, autorización y estructura RESTful.
