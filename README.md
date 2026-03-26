# BookApp - Sistema de Gestión de Libros

Aplicación web para gestión de libros, categorías, autores y editoriales desarrollada con Node.js, Express, Sequelize y Handlebars.

##  Características

-  Arquitectura MVC con Express.js
-  CRUD completo para Libros, Categorías, Autores y Editoriales
-  Filtrado de libros por título y categorías
-  Subida de imágenes de portada con Multer
-  Envío automático de emails al autor cuando se crea un libro (Nodemailer)
-  Validaciones en frontend y backend
-  Interfaz responsive con Bootstrap
-  Soporte multi-entorno (development/qa) con SQLite y MySQL
-  Mensajes flash para notificaciones

##  Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **ORM**: Sequelize
- **Base de Datos**: SQLite (desarrollo) / MySQL (QA)
- **Template Engine**: Handlebars (hbs)
- **Frontend**: Bootstrap 5, Font Awesome
- **Imágenes**: Multer
- **Emails**: Nodemailer
- **Variables de entorno**: dotenv, cross-env

##  Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/bookapp.git
cd bookapp