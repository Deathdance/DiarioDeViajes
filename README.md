DiarioDeViajes
==============

Web para crear diarios sobre tus viajes y compartir tus viajes (todos o solo alguno)
publicamente o con tus amigos (gente con solicitud de amistad añadida a tu red social)

<h2>Encriptar contraseña</h2>
=============================

Situarse en la carpeta del app.js:
  - $ node
  - > var bcrypt = require('bcrypt-nodejs');
  - > bcrypt.hashSync("gorka");
    '$2a$10$o1TZTgwquDqtNNBwIqy2Mes04zlRyufWqy8Q26gCejJUlLYzC.Ajq' (gorka encryptado)

