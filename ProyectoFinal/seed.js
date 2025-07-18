require("dotenv").config();
const mongoose = require("mongoose");
const { Producto, Movimiento, Proveedor } = require("./models");
const MONGODB_URL = process.env.MONGODB_URL;

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Conectado a MongoDB para inicialización");

    await Promise.all([
      Proveedor.deleteMany({}),
      Producto.deleteMany({}),
      Movimiento.deleteMany({}),
    ]);
    console.log("Colecciones limpiadas");

    const proveedores = await Proveedor.insertMany([
      {
        nombre: "Distribuidora Tech",
        contacto: "Juan López",
        telefono: "+541123456789",
        email: "ventas@distritech.com",
        productosOfrecidos: [],
      },
      {
        nombre: "Suministros Rápidos",
        contacto: "María García",
        telefono: "+541198765432",
        email: "info@sumirpidos.com",
        productosOfrecidos: [],
      },
      {
        nombre: "ElectroProveedores",
        contacto: "Carlos Martínez",
        telefono: "+541156789012",
        email: "carlos@electroprov.com",
        productosOfrecidos: [],
      },
    ]);
    console.log(`${proveedores.length} proveedores insertados`);

    const proveedorMap = {
      "Distribuidora Tech": proveedores[0]._id,
      "Suministros Rápidos": proveedores[1]._id,
      ElectroProveedores: proveedores[2]._id,
    };

    const productos = await Producto.insertMany([
      {
        codigo: "PROD001",
        nombre: "Laptop HP Pavilion",
        categoria: "Electrónicos",
        precio: 850.0,
        stockActual: 8,
        stockMinimo: 5,
        proveedorId: proveedorMap["Distribuidora Tech"],
      },
      {
        codigo: "PROD002",
        nombre: 'Monitor Samsung 24"',
        categoria: "Electrónicos",
        precio: 200.0,
        stockActual: 15,
        stockMinimo: 8,
        proveedorId: proveedorMap["Distribuidora Tech"],
      },
      {
        codigo: "PROD003",
        nombre: "Teclado Inalámbrico Logitech",
        categoria: "Periféricos",
        precio: 45.0,
        stockActual: 3,
        stockMinimo: 10,
        proveedorId: proveedorMap["Distribuidora Tech"],
      },
      {
        codigo: "PROD004",
        nombre: "Impresora Epson EcoTank",
        categoria: "Oficina",
        precio: 350.0,
        stockActual: 5,
        stockMinimo: 3,
        proveedorId: proveedorMap["Suministros Rápidos"],
      },
      {
        codigo: "PROD005",
        nombre: "Disco SSD 500GB Kingston",
        categoria: "Componentes",
        precio: 65.0,
        stockActual: 12,
        stockMinimo: 15,
        proveedorId: proveedorMap["Suministros Rápidos"],
      },
    ]);
    console.log(`${productos.length} productos insertados`);

    const productoMap = {};
    productos.forEach((p) => {
      productoMap[p.codigo] = p._id;
    });

    await Proveedor.findByIdAndUpdate(proveedorMap["Distribuidora Tech"], {
      $push: {
        productosOfrecidos: {
          $each: [
            productoMap["PROD001"],
            productoMap["PROD002"],
            productoMap["PROD003"],
          ],
        },
      },
    });

    await Proveedor.findByIdAndUpdate(proveedorMap["Suministros Rápidos"], {
      $push: {
        productosOfrecidos: {
          $each: [productoMap["PROD004"], productoMap["PROD005"]],
        },
      },
    });

    console.log("Proveedores actualizados con productos");

    const movimientos = await Movimiento.insertMany([
      {
        productoId: productoMap["PROD001"],
        tipo: "entrada",
        cantidad: 10,
        motivo: "Compra inicial",
        usuario: "admin",
      },
      {
        productoId: productoMap["PROD001"],
        tipo: "salida",
        cantidad: 2,
        motivo: "Venta a cliente",
        usuario: "vendedor1",
      },
      {
        productoId: productoMap["PROD003"],
        tipo: "entrada",
        cantidad: 5,
        motivo: "Reposición de stock",
        usuario: "admin",
      },
      {
        productoId: productoMap["PROD003"],
        tipo: "salida",
        cantidad: 2,
        motivo: "Venta a cliente",
        usuario: "vendedor2",
      },
      {
        productoId: productoMap["PROD004"],
        tipo: "entrada",
        cantidad: 5,
        motivo: "Compra a proveedor",
        usuario: "admin",
      },
    ]);
    console.log(`${movimientos.length} movimientos insertados`);

    console.log("✅ Base de datos poblada exitosamente!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error);
    process.exit(1);
  }
}

seedDatabase();
