### Ejercicios:

***
**Ejercicio 1: Sistema de Gestión de Proyectos**


*Modelado*

```
    CREATE
    (d1:Departamento {nombre: "IT"}),
    (d2:Departamento {nombre: "Marketing"}),
    (e1:Empleado {nombre: "Mateo"}),
    (e2:Empleado {nombre: "Agustin"}),
    (e3:Empleado {nombre: "Gabriel"}),
    (p1:Proyecto {nombre: "Aplicacion Web"}),
    (p2:Proyecto {nombre: "Ciberseguridad"});

    MATCH
    (e1:Empleado {nombre: "Mateo"}),
    (e2:Empleado {nombre: "Agustin"}),
    (e3:Empleado {nombre: "Gabriel"}),
    (d1:Departamento {nombre: "IT"}),
    (d2:Departamento {nombre: "Marketing"}),
    (p1:Proyecto {nombre: "Aplicacion Web"}),
    (p2:Proyecto {nombre: "Ciberseguridad"})

    CREATE
    (e1)-[:PERTENECE]->(d1),
    (e2)-[:PERTENECE]->(d2),
    (e3)-[:PERTENECE]->(d2),

    (e1)-[:TRABAJA_EN {horas: 12}]->(p1),
    (e2)-[:TRABAJA_EN {horas: 16}]->(p1),
    (e2)-[:TRABAJA_EN {horas: 22}]->(p2),
    (e3)-[:TRABAJA_EN {horas: 5}]->(p2),

    (e1)-[:LIDERA]->(p1),
    (e1)-[:LIDERA]->(p2);
```

*Consultas*

Obtener nombre del proyecto, su líder y empleados asignados
``` 
MATCH (p:Proyecto)<-[:LIDERA]-(lider:Empleado),
      (emp:Empleado)-[:TRABAJA_EN]->(p)
RETURN p.nombre AS Proyecto, 
       lider.nombre AS Lider, 
       collect(emp.nombre) AS Empleados 
```

![IMAGEN](/TP4/img/Screenshot_1.png)

Calcular el total de horas semanales por proyecto

```
MATCH (:Empleado)-[r:TRABAJA_EN]->(p:Proyecto)
RETURN p.nombre AS Proyecto, SUM(r.horas) AS TotalHorasSemanales;
```

![IMAGEN](/TP4/img/Screenshot_2.png)

Listar los empleados que trabajan en mas de un proyecto

```
MATCH (e:Empleado)-[:TRABAJA_EN]->(p:Proyecto)
WITH e, COUNT(DISTINCT p) AS cantidadProyectos
WHERE cantidadProyectos > 1
RETURN e.nombre AS Empleado, cantidadProyectos;
```

![IMAGEN](/TP4/img/Screenshot_3.png)

***
Ejercicio 2: Biblioteca Universitaria Extendida

*Modelado*
```

CREATE
  (mateo:Estudiante {nombre: "Mateo"}),
  (agustin:Estudiante {nombre: "Agustin"}),
  (gabriel:Estudiante {nombre: "Gabriel"}),
  (laura:Estudiante {nombre: "Laura"}),
  
  (ing: Carrera {nombre: "Ingeniería"}),
  (med: Carrera {nombre: "Medicina"}),
  (der: Carrera {nombre: "Derecho"}),
  (eco: Carrera {nombre: "Economía"});


MATCH
  (m:Estudiante {nombre: "Mateo"}), (i:Carrera {nombre: "Ingeniería"}),
  (a:Estudiante {nombre: "Agustin"}), (d:Carrera {nombre: "Derecho"}),
  (g:Estudiante {nombre: "Gabriel"}), (m2:Carrera {nombre: "Medicina"}),
  (l:Estudiante {nombre: "Laura"}), (e:Carrera {nombre: "Economía"})
CREATE
  (m)-[:PERTENECE]->(i),
  (a)-[:PERTENECE]->(d),
  (g)-[:PERTENECE]->(m2),
  (l)-[:PERTENECE]->(e);


CREATE
  (fic:Categoria {nombre: "Ficción"}),
  (cien:Categoria {nombre: "Ciencia"}),
  (his:Categoria {nombre: "Historia"}),
  (art:Categoria {nombre: "Arte"});


CREATE
  (l1:Libro {titulo: "Cien años de soledad"}),
  (l2:Libro {titulo: "Breve historia del tiempo"}),
  (l3:Libro {titulo: "Sapiens"}),
  (l4:Libro {titulo: "El arte de la guerra"});

MATCH
  (l1:Libro {titulo: "Cien años de soledad"}), (fic:Categoria {nombre: "Ficción"}),
  (l2:Libro {titulo: "Breve historia del tiempo"}), (cien:Categoria {nombre: "Ciencia"}),
  (l3:Libro {titulo: "Sapiens"}), (his:Categoria {nombre: "Historia"}),
  (l4:Libro {titulo: "El arte de la guerra"}), (art:Categoria {nombre: "Arte"})
CREATE
  (l1)-[:PERTENECE_A]->(fic),
  (l2)-[:PERTENECE_A]->(cien),
  (l3)-[:PERTENECE_A]->(his),
  (l4)-[:PERTENECE_A]->(art);


MATCH
  (m:Estudiante {nombre: "Mateo"}), (l1:Libro {titulo: "Cien años de soledad"}),
  (a:Estudiante {nombre: "Agustin"}), (l2:Libro {titulo: "Breve historia del tiempo"}),
  (g:Estudiante {nombre: "Gabriel"}), (l3:Libro {titulo: "Sapiens"}),
  (l:Estudiante {nombre: "Laura"}), (l4:Libro {titulo: "El arte de la guerra"})
CREATE
  (m)-[:PRESTAMO {fecha: date('2023-10-01'), estado: "Active"}]->(l1),
  (a)-[:PRESTAMO {fecha: date('2023-10-02'), estado: "Active"}]->(l2),
  (g)-[:PRESTAMO {fecha: date('2023-09-15'), estado: "Due"}]->(l3),
  (l)-[:PRESTAMO {fecha: date('2023-10-03'), estado: "Active"}]->(l4),
  (m)-[:PRESTAMO {fecha: date('2023-09-20'), estado: "Due"}]->(l2);
```
*Consultas*

Obtener todos los libros actualmente prestados (estado "Activo" )
```
MATCH (e:Estudiante)-[p:PRESTAMO {estado: "Active"}]->(l:Libro)
RETURN e.nombre AS Estudiante, l.titulo AS Libro, p.fecha AS Fecha
```

![IMAGEN](/TP4/img/Screenshot_8.png)

Listar cuántos libros ha pedido prestado cada estudiante

```
MATCH (e:Estudiante)-[:PRESTAMO]->(l:Libro)
RETURN e.nombre AS Estudiante, count(l) AS Total_Prestamos
```

![IMAGEN](/TP4/img/Screenshot_9.png)

Mostrar las categorías con más préstamos activos
```
MATCH (c:Categoria)<-[:PERTENECE_A]-(l:Libro)<-[p:PRESTAMO {estado: "Active"}]-()
RETURN c.nombre AS Categoria, count(p) AS Prestamos_Activos
ORDER BY Prestamos_Activos DESC
```

![IMAGEN](/TP4/img/Screenshot_10.png)

Encontrar los estudiantes que no tienen préstamos activos
```
MATCH (e:Estudiante)
WHERE NOT EXISTS {
  (e)-[:PRESTAMO {estado: "Active"}]->()
}
RETURN e.nombre AS Estudiante
```

![IMAGEN](/TP4/img/Screenshot_11.png)

***

**Ejercicio 3: Red Social Profesional**

*Modelado*

```
CREATE
  (u1:Usuario {nombre: "Ana"}),
  (u2:Usuario {nombre: "Juan"}),
  (u3:Usuario {nombre: "Maria"}),
  (u4:Usuario {nombre: "Pedro"});


MATCH
  (a:Usuario {nombre: "Ana"}),
  (j:Usuario {nombre: "Juan"}),
  (m:Usuario {nombre: "Maria"}),
  (p:Usuario {nombre: "Pedro"})
CREATE
  (a)-[:CONOCE]->(j),
  (a)-[:CONOCE]->(m),
  (j)-[:CONOCE]->(m),
  (m)-[:CONOCE]->(p),
  (p)-[:CONOCE]->(a),
  (j)-[:CONOCE]->(p);


CREATE
  (post1:Post {titulo: "Mi primer post", fecha: date('2023-01-01')}),
  (post2:Post {titulo: "Hola mundo", fecha: date('2023-01-02')}),
  (post3:Post {titulo: "Aprendiendo Neo4j", fecha: date('2023-01-03')});


MATCH
  (a:Usuario {nombre: "Ana"}),
  (j:Usuario {nombre: "Juan"}),
  (m:Usuario {nombre: "Maria"}),
  (post1:Post {titulo: "Mi primer post"}),
  (post2:Post {titulo: "Hola mundo"}),
  (post3:Post {titulo: "Aprendiendo Neo4j"})
CREATE
  (a)-[:PUBLICO]->(post1),
  (j)-[:PUBLICO]->(post2),
  (j)-[:PUBLICO]->(post3);


CREATE
  (hab1:Habilidad {nombre: "Java"}),
  (hab2:Habilidad {nombre: "Python"}),
  (hab3:Habilidad {nombre: "Neo4j"}),
  (hab4:Habilidad {nombre: "SQL"}),
  (hab5:Habilidad {nombre: "Marketing"}),
  (hab6:Habilidad {nombre: "Diseño"});


MATCH
  (a:Usuario {nombre: "Ana"}),
  (j:Usuario {nombre: "Juan"}),
  (m:Usuario {nombre: "Maria"}),
  (p:Usuario {nombre: "Pedro"}),
  (java:Habilidad {nombre: "Java"}),
  (python:Habilidad {nombre: "Python"}),
  (neo4j:Habilidad {nombre: "Neo4j"}),
  (sql:Habilidad {nombre: "SQL"}),
  (marketing:Habilidad {nombre: "Marketing"}),
  (diseno:Habilidad {nombre: "Diseño"})
CREATE
  (a)-[:TIENE]->(java),
  (a)-[:TIENE]->(python),
  (j)-[:TIENE]->(neo4j),
  (j)-[:TIENE]->(sql),
  (m)-[:TIENE]->(marketing),
  (m)-[:TIENE]->(diseno),
  (p)-[:TIENE]->(python),
  (p)-[:TIENE]->(diseno);


MATCH
  (a:Usuario {nombre: "Ana"}),
  (j:Usuario {nombre: "Juan"}),
  (m:Usuario {nombre: "Maria"}),
  (p:Usuario {nombre: "Pedro"}),
  (java:Habilidad {nombre: "Java"}),
  (python:Habilidad {nombre: "Python"}),
  (neo4j:Habilidad {nombre: "Neo4j"}),
  (sql:Habilidad {nombre: "SQL"}),
  (marketing:Habilidad {nombre: "Marketing"}),
  (diseno:Habilidad {nombre: "Diseño"})
CREATE
  (j)-[:ENDOSA]->(java),    // Juan endosa Java de Ana
  (m)-[:ENDOSA]->(java),    // Maria endosa Java de Ana
  (a)-[:ENDOSA]->(neo4j),   // Ana endosa Neo4j de Juan
  (p)-[:ENDOSA]->(neo4j),   // Pedro endosa Neo4j de Juan
  (j)-[:ENDOSA]->(diseno),  // Juan endosa Diseño de Maria
  (a)-[:ENDOSA]->(diseno);  // Ana endosa Diseño de Maria
```

*Consultas*

Usuarios con mas conexiones

```
MATCH (u:Usuario)-[:CONOCE]->(otro)
RETURN u.nombre AS Usuario, count(otro) AS Conexiones
ORDER BY Conexiones DESC
```

![IMAGEN](/TP4/img/Screenshot_4.png)

Obtener los 2 usuarios con más publicaciones

```
MATCH (u:Usuario)-[:PUBLICO]->(p:Post)
RETURN u.nombre AS Usuario, count(p) AS Publicaciones
ORDER BY Publicaciones DESC
LIMIT 2
```

![IMAGEN](/TP4/img/Screenshot_5.png)

Mostrar las habilidades más endosadas en total
```
MATCH (h:Habilidad)<-[:ENDOSA]-()
RETURN h.nombre AS Habilidad, count(*) AS Endosos
ORDER BY Endosos DESC
```

![IMAGEN](/TP4/img/Screenshot_6.png)

Para un usuario específico, listar las habilidades que aún no ha endosado a otros

```
MATCH (ana:Usuario {nombre: "Ana"})
MATCH (h:Habilidad)
WHERE NOT (ana)-[:ENDOSA]->(h) 
  AND EXISTS { (otro:Usuario)-[:TIENE]->(h) }
  AND NOT (ana)-[:TIENE]->(h)
RETURN h.nombre AS Habilidad
```

![IMAGEN](/TP4/img/Screenshot_7.png)


**Ejercicio 4: Sistema de Cursos y Calificaciones**

*Modelado*
```

CREATE
  (mateo:Estudiante {nombre: "Mateo"}),
  (agustin:Estudiante {nombre: "Agustin"}),
  (gabriel:Estudiante {nombre: "Gabriel"}),
  (sofia:Estudiante {nombre: "Sofia"});

CREATE
  (m1:Materia {nombre: "Matemáticas I"}),
  (m2:Materia {nombre: "Programación I"}),
  (m3:Materia {nombre: "Bases de Datos"}),
  (m4:Materia {nombre: "Inteligencia Artificial"});

MATCH
  (bd:Materia {nombre: "Bases de Datos"}),
  (prog:Materia {nombre: "Programación I"}),
  (ia:Materia {nombre: "Inteligencia Artificial"})
CREATE
  (bd)-[:PRERREQUISITO]->(prog),
  (ia)-[:PRERREQUISITO]->(bd);

CREATE
  (c1:Curso {codigo: "MAT101", periodo: "2023-1"}),
  (c2:Curso {codigo: "PROG101", periodo: "2023-1"}),
  (c3:Curso {codigo: "BD202", periodo: "2023-2"}),
  (c4:Curso {codigo: "IA301", periodo: "2023-3"});

MATCH
  (c1:Curso {codigo: "MAT101"}), (m1:Materia {nombre: "Matemáticas I"}),
  (c2:Curso {codigo: "PROG101"}), (m2:Materia {nombre: "Programación I"}),
  (c3:Curso {codigo: "BD202"}), (m3:Materia {nombre: "Bases de Datos"}),
  (c4:Curso {codigo: "IA301"}), (m4:Materia {nombre: "Inteligencia Artificial"})
CREATE
  (c1)-[:CORRESPONDE_A]->(m1),
  (c2)-[:CORRESPONDE_A]->(m2),
  (c3)-[:CORRESPONDE_A]->(m3),
  (c4)-[:CORRESPONDE_A]->(m4);

MATCH
  (mateo:Estudiante {nombre: "Mateo"}),
  (agustin:Estudiante {nombre: "Agustin"}),
  (gabriel:Estudiante {nombre: "Gabriel"}),
  (sofia:Estudiante {nombre: "Sofia"}),
  (mat101:Curso {codigo: "MAT101"}),
  (prog101:Curso {codigo: "PROG101"}),
  (bd202:Curso {codigo: "BD202"}),
  (ia301:Curso {codigo: "IA301"})
CREATE
  (mateo)-[:INSCRITO_EN {calificacion: 8}]->(mat101),
  (agustin)-[:INSCRITO_EN {calificacion: 7}]->(mat101),
  (gabriel)-[:INSCRITO_EN {calificacion: 9}]->(prog101),
  (mateo)-[:INSCRITO_EN {calificacion: 6}]->(prog101),
  (agustin)-[:INSCRITO_EN {calificacion: 8}]->(bd202),
  (sofia)-[:INSCRITO_EN {calificacion: 7}]->(bd202),
  (mateo)-[:INSCRITO_EN {calificacion: 9}]->(ia301),
  (sofia)-[:INSCRITO_EN {calificacion: 5}]->(ia301);
```

*Consultas*

Listar la transcripción académica de un estudiante

```
MATCH (e:Estudiante {nombre: "Mateo"})-[i:INSCRITO_EN]->(c:Curso)-[:CORRESPONDE_A]->(m:Materia)
RETURN m.nombre AS Materia, c.periodo AS Periodo, i.calificacion AS Calificacion
```

![IMAGEN](/TP4/img/Screenshot_12.png)

Verificar si un estudiante puede inscribirse en una materia (si aprobó los prerrequisitos)

```
MATCH (ia:Materia {nombre: "Inteligencia Artificial"})-[:PRERREQUISITO*]->(prerreq:Materia)
MATCH (mateo:Estudiante {nombre: "Mateo"})
OPTIONAL MATCH (mateo)-[i:INSCRITO_EN]->(curso)-[:CORRESPONDE_A]->(prerreq)
WITH prerreq.nombre AS Prerrequisito, i.calificacion AS Calificacion
RETURN Prerrequisito, 
       CASE WHEN Calificacion >= 6 THEN 'Aprobado' ELSE 'Pendiente' END AS Estado
```

![IMAGEN](/TP4/img/Screenshot_13.png)

Calcular el promedio de calificaciones por estudiante

```
MATCH (e:Estudiante)-[i:INSCRITO_EN]->()
RETURN e.nombre AS Estudiante, avg(i.calificacion) AS Promedio
```

![IMAGEN](/TP4/img/Screenshot_14.png)

Detectar materias con promedio inferior a 7

```
MATCH (m:Materia)<-[:CORRESPONDE_A]-(c:Curso)<-[i:INSCRITO_EN]-()
WITH m.nombre AS Materia, avg(i.calificacion) AS Promedio
WHERE Promedio < 7
RETURN Materia, round(Promedio*100)/100 AS Promedio_Redondeado
```

![IMAGEN](/TP4/img/Screenshot_15.png)

(no hay materias con promedio menor a 7)
