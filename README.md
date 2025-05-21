# CMPC-libros

Aplicación web para la gestión digital del inventario de la tienda **CMPC-libros**, permitiendo administración avanzada de libros, autenticación, análisis y exportación de datos.

---

## Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Instalación y configuración](#instalación-y-configuración)
- [Despliegue con Docker](#despliegue-con-docker)
- [Uso](#uso)
- [API y Documentación](#api-y-documentación)
- [Modelo de Base de Datos](#modelo-de-base-de-datos)
- [Decisiones de diseño](#decisiones-de-diseño)
- [Testing](#testing)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## Características

- **Autenticación JWT** para usuarios.
- **CRUD completo** de libros.
- **Filtrado avanzado** por género, editorial, autor y disponibilidad.
- **Ordenamiento y paginación** de resultados.
- **Búsqueda en tiempo real**.
- **Carga de imágenes** para libros.
- **Exportación a CSV**.
- **Soft delete** (eliminación lógica).
- **Logging** de operaciones.
- **Validación y manejo de errores** robusto.
- **Documentación Swagger/OpenAPI**.
- **Cobertura de tests ≥ 80%**.

---

## Arquitectura

- **Frontend:** React + TypeScript (no incluido en este repo)
- **Backend:** NestJS + TypeScript
- **Base de datos:** PostgreSQL (gestionada con Sequelize ORM)
- **Contenedores:** Docker y docker-compose

![Diagrama de arquitectura](./docs/arquitectura.png) <!-- Reemplaza con tu imagen real -->

---

## Instalación y configuración

### Requisitos

- Node.js >= 18
- Docker y docker-compose
- PostgreSQL (si no usas Docker)

### Variables de entorno

Crea un archivo `.env` en la raíz con:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=cmpc_libros
POSTGRES_HOST=db
POSTGRES_PORT=5432
JWT_SECRET=tu_clave_secreta
```

### Instalación

```bash
git clone https://github.com/tuusuario/cmpc-libros.git
cd cmpc-libros
npm install
```

---

## Despliegue con Docker

```bash
docker-compose up --build
```

Esto levantará la base de datos y el backend de NestJS.

---

## Uso

- Accede a la API en [http://localhost:3000](http://localhost:3000)
- Documentación Swagger en [http://localhost:3000/api](http://localhost:3000/api)
- Usa herramientas como Postman para probar los endpoints.

---

## API y Documentación

La documentación interactiva está disponible en `/api` gracias a Swagger.

### Endpoints principales

- `POST /auth/login` — Login de usuario
- `GET /book` — Listado de libros (con filtros, paginación, ordenamiento)
- `POST /book` — Crear libro
- `GET /book/:id` — Obtener libro por ID
- `PATCH /book/:id` — Editar libro
- `DELETE /book/:id` — Eliminar libro (soft delete)
- `GET /book/export/csv` — Exportar libros a CSV

---

## Modelo de Base de Datos

- **Book:** id (UUID), title, author, publisher, price, available, genre, imageUrl, deletedAt
- **User:** id, username, password, roles, etc.
- **Logs:** id, action, userId, timestamp

![Modelo relacional](./docs/modelo-db.png) <!-- Reemplaza con tu imagen real -->

---

## Decisiones de diseño

- **NestJS** por su arquitectura modular y soporte para buenas prácticas (SOLID).
- **Sequelize** para ORM y soporte de soft delete.
- **DTOs y validaciones** para seguridad y robustez.
- **Interceptors y pipes** para transformación y validación de datos.
- **Docker** para facilitar el despliegue local y en producción.

---

## Testing

- Tests unitarios para servicios y controladores con Jest.
- Cobertura mínima del 80%.
- Ejecuta los tests con:

```bash
npm run test
```

---

## Contribuciones

¡Bienvenidas! Abre un issue o pull request.

---

## Licencia

MIT
