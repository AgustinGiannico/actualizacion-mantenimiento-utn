Proyecto de Mantenimiento UTN

Descripción

Este proyecto es un sistema de mantenimiento desarrollado para la Universidad Tecnológica Nacional (UTN). Permite gestionar órdenes de trabajo, activos, ubicaciones, tipos de tareas y usuarios. Incluye autenticación de usuarios con control de permisos y documenta todos los endpoints mediante Swagger.


Características Principales

Gestión de órdenes de trabajo (OT)
Administración de activos y ubicaciones
Control de usuarios y roles de administrador
Autenticación y autorización con JWT y cookies
Documentación de API con Swagger


Tecnologías Utilizadas

Node.js
Express
MySQL
JWT para autenticación
Swagger para documentación de API
bcrypt para encriptación de contraseñas


Instalación

1- Clona el repositorio:
git clone https://github.com/AgustinGiannico/proyecto-mantenimiento-utn-frvt.git
cd proyecto-mantenimiento-utn-frvt

2- Instala las dependencias:
npm install

3- Configura el archivo .env (crea uno si no existe) con los siguientes valores:
PORT=3011
SECRET_KEY=servidor_utn
DB_HOST=mantenimiento-utn.ct2gsimk6pll.us-east-2.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=BaseMantenimiento_UTN
DB_PORT=3306
DB_NAME=mantenimiento_utn
DB_TIMEZONE=-03:00

4- Inicia el servidor:
npm start

5- Accede a la aplicación en http://localhost:3011


Documentación de la API

La documentación de la API está disponible en Swagger. Puedes acceder a ella en la ruta /api-docs cuando el servidor está en ejecución.
También puedes ver el archivo swagger.json en la carpeta src/docs para revisar la documentación sin ejecutar el proyecto.

Uso

Autenticación

Para iniciar sesión, envía una solicitud POST a /api/login con el correo y la contraseña del usuario en el cuerpo de la solicitud:

Acceso para Evaluación

Usuario administrador para navegar por la página web:

- Correo: agustingiannico@gmail.com
- Contraseña: AgustinGiannico_123

Con estas credenciales, puedes explorar todas las funcionalidades de la aplicación.
