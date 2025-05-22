# CMPC-libros

Aplicación web para la gestión digital del inventario de la tienda **CMPC-libros**, permitiendo administración avanzada de libros, autenticación, análisis y exportación de datos.

---

## Tabla de Contenidos

- [Características](#características)
- [Arquitectura y Decisiones de Diseño](#arquitectura-y-decisiones-de-diseño)
- [Instalación y configuración](#instalación-y-configuración)
- [Despliegue con Docker](#despliegue-con-docker)
- [Uso](#uso)
- [API y Documentación](#api-y-documentación)
- [Modelo de Base de Datos](#modelo-de-base-de-datos)
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

## Arquitectura y Decisiones de Diseño

### Arquitectura General

- **Backend:** NestJS + TypeScript, arquitectura modular, controladores y servicios separados, DTOs para validación y tipado fuerte.
- **Base de datos:** PostgreSQL gestionada con Sequelize ORM, uso de modelos y migraciones, soporte para soft delete.
- **Frontend:** React + TypeScript (no incluido en este repo), pensado para consumir la API RESTful.
- **Contenedores:** Docker y docker-compose para facilitar el despliegue y la portabilidad.

### Decisiones de Diseño

- **NestJS**: Elegido por su estructura modular, soporte para buenas prácticas (SOLID), inyección de dependencias y ecosistema robusto.
- **Sequelize**: ORM que permite modelar entidades, relaciones y soft delete de manera sencilla y compatible con PostgreSQL.
- **DTOs y validaciones**: Uso de DTOs y class-validator para garantizar la integridad y seguridad de los datos recibidos en la API.
- **Autenticación JWT**: Seguridad basada en tokens, con roles y guards para proteger rutas sensibles.
- **Interceptors y pipes**: Para logging, transformación y validación de datos de entrada y salida.
- **Swagger/OpenAPI**: Documentación interactiva y autogenerada para facilitar el consumo y testing de la API.
- **Testing**: Cobertura de tests unitarios y de integración con Jest, siguiendo TDD en los servicios principales.
- **Docker**: Facilita el despliegue local y en producción, asegurando consistencia entre entornos.
- **Soft delete**: Permite mantener historial y evitar pérdidas accidentales de datos.
- **Exportación a CSV**: Para análisis y respaldo de datos desde la API.

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

## Despliegue con Docker Compose

Asegúrate de tener Docker y Docker Compose instalados en tu sistema.

1. Clona el repositorio y navega a la carpeta raíz del proyecto.
2. Crea un archivo `.env` con las variables necesarias (ver ejemplo más arriba).
3. Ejecuta el siguiente comando para levantar todos los servicios (backend, base de datos y frontend si está configurado):

```bash
docker-compose up --build
```

Esto levantará:

- **Base de datos PostgreSQL** en el puerto 5432.
- **Backend NestJS** en el puerto 3000.
- **Frontend** (si está configurado) en el puerto 8080.

Puedes acceder a la API en [http://localhost:3000/api](http://localhost:3000/api)  
Y a la documentación Swagger en [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

Para detener los servicios, usa:

```bash
docker-compose down
```

---

## Uso

- Accede a la API en [http://localhost:3000](http://localhost:3000)
- Documentación Swagger en [http://localhost:3000/api](http://localhost:3000/api)
- Swagger de los endpoints [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
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
