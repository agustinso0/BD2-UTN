# Sistema de Inventario de Tienda

## Instalación

```sh
npm install
```

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto con la variable de conexión a MongoDB:
    ```
    MONGODB_URL=mongodb://localhost:27017/tu_basededatos
    ```
2. Inicia el servidor:
    ```sh
    npm start
    ```
3. Para poblar la base de datos con datos de ejemplo:
    ```sh
    npm run seed
    ```

---

## Endpoints

### Obtener todos los productos
**GET** `/productos`  
http://localhost:3100/productos

### Obtener todos los movimientos
**GET** `/movimientos`  
http://localhost:3100/movimientos

### Obtener todos los proveedores
**GET** `/proveedores`  
http://localhost:3100/proveedores

### Consultar producto por código
**GET** `/productos/stock/:codigo`  
Ejemplo:  
http://localhost:3100/productos/stock/PROD002

### Consultar productos con stock bajo el mínimo
**GET** `/productos/stock-bajo`  
http://localhost:3100/productos/stock-bajo

### Consultar reporte de movimientos por fecha
**GET** `/movimientos/reporte?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD`  
Ejemplo:  
http://localhost:3100/movimientos/reporte?fechaInicio=2025-01-01&fechaFin=2025-12-31

---

## Crear un nuevo producto

**POST** `/productos`  
http://localhost:3100/productos

**JSON de ejemplo:**
```json
{
  "codigo": "PROD100",
  "nombre": "Nuevo Producto",
  "categoria": "Electrónicos",
  "precio": 299.99,
  "stockActual": 50,
  "stockMinimo": 10,
  "proveedorId": "68668679e38a6315bf7b036b"
}
```

---

## TODO

- Registrar movimientos de entrada y salida de stock (endpoint POST /movimientos)

---

**Tener en cuenta:**  
- MongoDB tiene qu estar corriendo antes de iniciar la app.
- Los IDs de proveedor deben existir en la base de datos para asociarlos a productos.