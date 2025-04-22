# Administracion, seguridad y mantenimiento

## Ejercicio 7: Gestion de Permisos

**Crear un usuario analista que solo pueda hacer SELECT en ciertas tablas. Intentar insertar desde
 ese usuario y explicar el resultado.**

`CREATE USER 'analista'@'localhost' IDENTIFIED BY '123456';`

`GRANT SELECT ON bd2.clientes TO 'analista'@'localhost';`
`GRANT SELECT ON bd2.productos TO 'analista'@'localhost';`

`FLUSH PRIVILEGES;`

Dado que se está utilizando el usuario 'analista', el cual no cuenta con los permisos necesarios para realizar operaciones de inserción (INSERT), se genera el siguiente error:

**Error:**
![ERROR](img/error_permiso_7.png)

**Consulta SQL utilizada:**
`INSERT INTO clientes(nombre, correo) VALUES('Juan', 'juan@ejemplo.com');`
