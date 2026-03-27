# Monex

Proyecto de titulo Monex con arquitectura de microservicios backend en Spring Boot.

## Estado actual

Actualmente el repositorio contiene 2 backends funcionales:

- `Monex/Bknd_User`: autenticacion y gestion de usuarios.
- `Monex/Bknd_Categories`: CRUD de categorias, integrado con JWT para acciones protegidas.

### Roadmap de base de datos

Hoy ambos servicios estan configurados con MySQL para desarrollo local.
En una futura iteracion, la base de datos migrara a PostgreSQL.

## Stack tecnologico

- Java 21
- Spring Boot 4.0.5
- Spring Web MVC
- Spring Data JPA
- MySQL
- Bean Validation
- JWT (`jjwt`)
- Swagger/OpenAPI (`springdoc-openapi`)
- Lombok
- Maven

## Estructura del repo

```text
Monex/
	Bknd_User/
	Bknd_Categories/
```

## Backend de usuarios (`Bknd_User`)

### Resumen

Este servicio maneja:

- Registro de usuario.
- Login y emision de token JWT.
- Consulta de perfil autenticado.
- Operaciones de usuario (consulta, actualizacion, eliminacion y cambio de password).

### Configuracion actual

- Puerto: `8080` (por defecto de Spring Boot).
- Base de datos: `usuarios`.
- URL actual: `jdbc:mysql://localhost:3306/usuarios?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true`
- Usuario DB: `root`
- Password DB: vacio
- JWT secret: `jwt.secret` en `application.properties`
- JWT expiration: `86400000` ms (24h)

### Endpoints principales

Base URL: `http://localhost:8080`

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (requiere `Authorization: Bearer <token>`)

Users:

- `GET /api/users/{id}`
- `GET /api/users/me` (requiere token)
- `PUT /api/users/{id}` (requiere token del mismo usuario)
- `DELETE /api/users/{id}` (requiere token del mismo usuario)
- `POST /api/users/cambiar-password` (requiere token)

Swagger:

- `http://localhost:8080/swagger-ui/index.html`

### Nota importante de seguridad (estado actual)

En la configuracion actual de seguridad existe `permitAll()` para `"/api/users/**"`, por lo que parte de la proteccion recae en validaciones manuales dentro de controladores.

## Backend de categorias (`Bknd_Categories`)

### Resumen

Este servicio maneja:

- Listado y consulta de categorias.
- Creacion, actualizacion y eliminacion de categorias.
- Asociacion de `createdByUserId` a partir del `userId` presente en el JWT.

### Configuracion actual

- Puerto: `8081`
- Base de datos: `categorias`
- URL actual: `jdbc:mysql://localhost:3306/categorias?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true`
- Usuario DB: `root`
- Password DB: vacio
- JWT secret: `jwt.secret` en `application.properties`

### Endpoints principales

Base URL: `http://localhost:8081`

- `GET /api/categorias`
- `GET /api/categorias/{id}`
- `POST /api/categorias` (requiere `Authorization: Bearer <token>`)
- `PUT /api/categorias/{id}` (requiere `Authorization: Bearer <token>`)
- `DELETE /api/categorias/{id}` (requiere `Authorization: Bearer <token>`)

Swagger:

- `http://localhost:8081/swagger-ui/index.html`

## CORS actual

Ambos backends permiten origen:

- `http://localhost:5173`

## Como ejecutar

### 1) Levantar MySQL

Verifica que exista acceso local en `localhost:3306` con usuario `root`.

### 2) Ejecutar backend de usuarios

```bash
cd Monex/Bknd_User
./mvnw spring-boot:run
```

En Windows (PowerShell):

```powershell
cd Monex/Bknd_User
.\mvnw.cmd spring-boot:run
```

### 3) Ejecutar backend de categorias

```bash
cd Monex/Bknd_Categories
./mvnw spring-boot:run
```

En Windows (PowerShell):

```powershell
cd Monex/Bknd_Categories
.\mvnw.cmd spring-boot:run
```

## Flujo recomendado entre servicios

1. Registrar/login en `Bknd_User` para obtener JWT.
2. Enviar ese token en `Authorization: Bearer <token>` al usar endpoints protegidos de `Bknd_Categories`.

## Estado de documentacion

README actualizado segun el codigo implementado actualmente en ambos backends.
