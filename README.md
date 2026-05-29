# Monex

Proyecto de titulo Monex con arquitectura de microservicios backend en Spring Boot.

## Estado actual

Actualmente el repositorio contiene 3 microservicios backend funcionales:

- `Monex/Bknd_User`: autenticacion y gestion de usuarios (Puerto 8081).
- `Monex/Bknd_Categories`: CRUD de categorias con JWT (Puerto 8082).
- `Monex/bknd-expenses`: Gestion de gastos del usuario (Puerto 8083).

### Base de datos

Todos los servicios estan configurados con **PostgreSQL** para desarrollo local.
Migracion completada desde MySQL.

## Stack tecnologico

- Java 21
- Spring Boot 4.0.5
- Spring Web MVC
- Spring Data JPA
- PostgreSQL
- Bean Validation
- JWT (`jjwt` 0.12.3)
- Swagger/OpenAPI (`springdoc-openapi` 2.4.0 - 2.8.14)
- Lombok
- Maven

## Estructura del repo

```text
Monex/
	Bknd_User/
	Bknd_Categories/
	bknd-expenses/
	frontend/
```

## Backend de usuarios (`Bknd_User`)

### Resumen

Este servicio maneja:

- Registro de usuario.
- Login y emision de token JWT.
- Consulta de perfil autenticado.
- Operaciones de usuario (consulta, actualizacion, eliminacion y cambio de password).

### Configuracion actual

- Puerto: `8081`.
- Base de datos: `usuarios` en PostgreSQL.
- URL de conexion: `jdbc:postgresql://localhost:5432/usuarios`
- Usuario BD: `postgres`
- JWT expiration: `86400000` ms (24 horas)

### Endpoints principales

Base URL: `http://localhost:8081`

**Autenticación:**

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login y obtencion de JWT
- `GET /api/auth/me` (requiere token) - Obtener perfil autenticado

**Usuarios:**

- `GET /api/users/{id}` (requiere token) - Obtener usuario por ID
- `GET /api/users/me` (requiere token) - Obtener datos del usuario autenticado
- `PUT /api/users/{id}` (requiere token) - Actualizar usuario
- `DELETE /api/users/{id}` (requiere token) - Eliminar usuario
- `POST /api/users/cambiar-password` (requiere token) - Cambiar contraseña

**Configuración de Tarjeta de Crédito:**

- `GET /api/tarjeta/configuracion` (requiere token) - Obtener configuración de tarjeta
- `POST /api/tarjeta/configuracion` (requiere token) - Guardar/actualizar configuración (fecha de facturación, sueldo, cupo)

Swagger:

- `http://localhost:8081/swagger-ui.html`

## Backend de categorias (`Bknd_Categories`)

### Resumen

Este servicio maneja:

- Listado y consulta de categorias.
- Creacion, actualizacion y eliminacion de categorias.
- Asociacion de `createdByUserId` a partir del `userId` presente en el JWT.

### Configuracion actual

- Puerto: `8082`
- Base de datos: `categorias` en PostgreSQL.
- URL de conexion: `jdbc:postgresql://localhost:5432/categorias`
- Usuario BD: `postgres`

### Endpoints principales

Base URL: `http://localhost:8082`

- `GET /api/categorias`
- `GET /api/categorias/{id}`
- `POST /api/categorias` (requiere `Authorization: Bearer <token>`)
- `PUT /api/categorias/{id}` (requiere `Authorization: Bearer <token>`)
- `DELETE /api/categorias/{id}` (requiere `Authorization: Bearer <token>`)

Swagger:

- `http://localhost:8082/swagger-ui.html`

## Backend de gastos (`bknd-expenses`)

### Resumen

Este servicio maneja:

- Listado y consulta de gastos del usuario con filtros avanzados.
- Creacion, actualizacion y eliminacion de gastos.
- Soporte para múltiples métodos de pago: EFECTIVO, DEBITO, CREDITO.
- Soporte para pagos con cuotas (solo en método CREDITO).
- Comisiones asociadas a gastos.
- Filtrado avanzado por categoría, método de pago, rango de fechas, y combinaciones.
- Calculo de estimación mensual de gastos con tarjeta de crédito.
- Validaciones automáticas de datos y seguridad basada en JWT.

### Configuracion actual

- Puerto: `8083`
- Base de datos: `gastos` en PostgreSQL.
- URL de conexion: `jdbc:postgresql://localhost:5432/gastos`
- Usuario BD: `postgres`
- JWT expiration: `86400000` ms (24 horas)

### Endpoints principales

Base URL: `http://localhost:8083`

**CRUD básico:**

- `GET /api/expenses` - Listar todos los gastos del usuario (soporta filtros opcionales)
- `GET /api/expenses/{id}` (requiere token) - Obtener gasto específico
- `POST /api/expenses` (requiere token) - Crear nuevo gasto
- `PUT /api/expenses/{id}` (requiere token) - Actualizar gasto
- `DELETE /api/expenses/{id}` (requiere token) - Eliminar gasto

**Filtros y búsquedas:**

- `GET /api/expenses/payment-method/{paymentMethod}` - Filtrar por método de pago (EFECTIVO, DEBITO, CREDITO)
- `GET /api/expenses/category/{categoryId}` - Filtrar por categoría
- `GET /api/expenses/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Filtrar por rango de fechas

**Parámetros de query (GET /api/expenses):**

- `categoryId` (opcional) - ID de categoría
- `paymentMethod` (opcional) - Método de pago
- `startDate` (opcional) - Fecha inicio (YYYY-MM-DD)
- `endDate` (opcional) - Fecha fin (YYYY-MM-DD)

**Estadísticas:**

- `GET /api/expenses/monthly-estimate` (requiere token) - Calcular estimación mensual de gastos con crédito

**Campos soportados en gastos:**

- `name` - Nombre del gasto
- `categoryId` - ID de la categoría
- `categoryName` - Nombre de la categoría
- `date` - Fecha del gasto
- `amount` - Monto (BigDecimal)
- `commission` - Comisión asociada (opcional, default 0)
- `paymentMethod` - Método de pago (EFECTIVO, DEBITO, CREDITO)
- `installments` - Cuotas (solo para CREDITO, default 1)

Swagger:

- `http://localhost:8083/swagger-ui.html`

## CORS actual

Todos los backends permiten origen:

- `http://localhost:5173` (Frontend Vite)

## Prerrequisitos

- Java 21
- PostgreSQL 12+
- Node.js (para el frontend)
- Maven 3.9+

## Como ejecutar

### 1) Configurar PostgreSQL

Asegúrate de tener PostgreSQL corriendo localmente en `localhost:5432`.


Las bases de datos se crearán automaticamente con `spring.jpa.hibernate.ddl-auto=update`.

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

Servicio disponible en: `http://localhost:8081`

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

Servicio disponible en: `http://localhost:8082`

### 4) Ejecutar backend de gastos

```bash
cd Monex/bknd-expenses
./mvnw spring-boot:run
```

En Windows (PowerShell):

```powershell
cd Monex/bknd-expenses
.\mvnw.cmd spring-boot:run
```

Servicio disponible en: `http://localhost:8083`

### 5) Ejecutar frontend

```bash
cd Monex/frontend
npm install
npm run dev
```

Frontend disponible en: `http://localhost:5173`

## Flujo recomendado entre servicios

1. Registrar/login en `Bknd_User` (Puerto 8081) para obtener JWT.
2. Usar el token JWT en `Authorization: Bearer <token>` para acceder a endpoints protegidos de:
   - `Bknd_Categories` (Puerto 8082)
   - `bknd-expenses` (Puerto 8083)

## Consideraciones importantes

- **JWT Secret**: Todos los backends deben tener el mismo `jwt.secret` para validar tokens correctamente.
- **CORS**: Configurado para permitir requests desde `http://localhost:5173`.
- **Base de datos**: Las migraciones se aplican automaticamente con Hibernate (`ddl-auto=update`).
- **Swagger/OpenAPI**: Disponible en `/swagger-ui.html` de cada servicio para explorar endpoints.
- **Métodos de pago**: Los valores válidos son: `EFECTIVO`, `DEBITO`, `CREDITO` (se normalizan automáticamente a mayúsculas).
- **Cuotas**: Solo aplica para pagos con CREDITO. Si se omite, por defecto es 1 cuota.
- **Configuración de tarjeta**: En Bknd_User se puede guardar la fecha de facturación, sueldo del mes y cupo de la tarjeta de crédito.
- **Estimación mensual**: El endpoint `/api/expenses/monthly-estimate` calcula el total de cuotas activas para el mes actual en pagos con crédito.

## Flujo de uso recomendado

### 1. Registro e inicio de sesión
```
POST /api/auth/register → Registrar nuevo usuario
POST /api/auth/login → Obtener JWT
```

### 2. Configurar tarjeta de crédito (opcional)
```
POST /api/tarjeta/configuracion → Guardar configuración de tarjeta
GET /api/tarjeta/configuracion → Ver configuración guardada
```

### 3. Gestionar gastos
```
POST /api/expenses → Crear gasto
GET /api/expenses → Listar todos los gastos
GET /api/expenses?paymentMethod=CREDITO&startDate=2026-05-01&endDate=2026-05-31 → Filtrar gastos
GET /api/expenses/monthly-estimate → Ver estimación de pago mensual
```

## Estado de la documentacion

README actualizado segun los cambios realizados:
- ✅ Migracion completada de MySQL a PostgreSQL
- ✅ Agregado tercer microservicio (bknd-expenses)
- ✅ Actualización de puertos y configuración
- ✅ Documentación de prerrequisitos y pasos de ejecución
- ✅ Endpoints de configuración de tarjeta agregados (Bknd_User)
- ✅ Filtros y búsquedas avanzadas documentados (bknd-expenses)
- ✅ Soporte para múltiples métodos de pago documentado
- ✅ Flujo de uso recomendado agregado
