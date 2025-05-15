CREATE INDEX idx_precio ON productos(precio);
CREATE INDEX idx_prod ON productos(precio, stock);
CREATE INDEX idx_cant ON productos(precio, stock, fecha_creacion);
EXPLAIN SELECT productos.nombre, productos.precio, productos.stock, categorias.nombre AS categoria, marcas.nombre AS marca
FROM productos
JOIN categorias ON productos.id_categoria = categorias.id_categoria
JOIN marcas ON productos.id_marca = marcas.id_marca
WHERE productos.precio BETWEEN 100 AND 500
  AND productos.stock > 100
  AND productos.fecha_creacion >= '2023-01-01'
  AND categorias.nombre = 'Mascotas'
  AND marcas.nombre = 'Wonka';
