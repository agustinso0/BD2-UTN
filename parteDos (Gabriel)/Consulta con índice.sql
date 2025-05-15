CREATE INDEX idx_stock ON productos(stock);
EXPLAIN SELECT * FROM productos WHERE stock = 200;
DROP INDEX idx_stock ON productos;