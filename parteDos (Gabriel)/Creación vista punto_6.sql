-- como cree la base de datos basandome en la que el profe había mandado a modo de ejmplo, en  vez de ventas mensuales utilizare el año en el que fueron creados los productos 
CREATE OR REPLACE VIEW vista_creaciones_anuales AS
SELECT marcas.nombre AS Marca, DATE_FORMAT(productos.fecha_creacion, '%Y') AS año, COUNT(*) AS Productos_creados
FROM productos JOIN marcas ON marcas.id_marca = productos.id_marca
GROUP BY Marca, año;