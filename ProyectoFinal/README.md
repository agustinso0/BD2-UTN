Instalar dependencias:
npm install

configurar variables de entorno .env

npm start

poblar base de datos => npm run seed

ENDPOINTS

OBTENER TODOS LOS PRODUCTOS
GET
http://localhost:3100/productos

OBTENER TODOS LOS MOVIMIENTOS
GET
http://localhost:3100/movimientos

OBTENER TODOS LOS PROVEEDORES
GET
http://localhost:3100/proveedores

CONSULTAR PRODUCTO POR CODIGO
GET
http://localhost:3100/productos/stock/PROD002

CONSULTAR PRODUCTOS POR STOCK DEBAJO DEL MINIMO
GET
http://localhost:3100/productos/stock-bajo

CONSULTAR REPORTE DE MOVIMIENTOS POR FECHA DE INICIO Y FIN

GET
http://localhost:3100/movimientos/reporte?fechaInicio=2025-01-01&fechaFin=2025-12-31

CREAR UN NUEVO PRODUCTO

POST
http://localhost:3100/productos

JSON
{
    "codigo": "PROD100",
    "nombre": "Nuevo Producto",
    "categoria": "Electrónicos",
    "precio": 299.99,
    "stockActual": 50,
    "stockMinimo": 10,
    "proveedorId": "68668679e38a6315bf7b036b"
}

TODO REGISTRAR MOVIMIENTOS DE ENTRADA Y SALIDA DE STOCK