# 🛒 E-commerce Backend

Este proyecto es una API RESTful desarrollada con NestJS
 que implementa la lógica de negocio para un sistema de comercio electrónico.

Incluye gestión de productos, categorías y autenticación con JWT. El proyecto está estructurado siguiendo buenas prácticas con TypeORM, DTOs para validación, y soporte para Docker.


---

## 🚀 Características

- Gestión de productos: creación, actualización, eliminación, búsqueda y paginación.
- Categorías: organización de productos por categorías.
- Autenticación y autorización: login con JWT y control de acceso por roles.
- Validación de datos: mediante class-validator en los DTOs.
- Persistencia: base de datos relacional (MySQL) con TypeORM.
- Configuración segura: variables de entorno validadas con Joi.



---


 ## ⚙️ Tecnologías utilizadas

NestJS
 - framework principal.

TypeScript
 - tipado estático.

TypeORM
 - ORM para MySQL.

class-validator
 - validación de DTOs.

Passport + JWT
 - autenticación.

Docker
 - contenedores para la app y base de datos.