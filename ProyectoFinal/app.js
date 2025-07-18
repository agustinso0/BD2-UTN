require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { Producto, Movimiento, Proveedor } = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;
app.use(express.json());

mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Respuesta de inicio
app.get("/", (req, res) => {
  res.send("Api || Sistema de Inventario de Tienda");
});

// Obtener todos los productos
app.get("/productos", async (req, res) => {
  try {
    const productos = await Producto.find().populate(
      "proveedorId",
      "nombre telefono email"
    ); // buscar todos los productos y trae la informacion del proveedor
    res.send(productos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// obtener todos los movimietnos
app.get("/movimientos", async (req, res) => {
  try {
    const movimientos = await Movimiento.find().populate(
      "productoId",
      "codigo nombre"
    ); // trae datos del producto
    res.send(movimientos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener todos los proveedores
app.get("/proveedores", async (req, res) => {
  try {
    const proveedores = await Proveedor.find().populate(
      "productosOfrecidos",
      "codigo nombre"
    ); // trae los productos ofrecidos por cada proveedor
    res.send(proveedores);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Consultar stock por codigo
app.get("/productos/stock/:codigo", async (req, res) => {
  try {
    if (!req.params.codigo) {
      return res.status(400).send("Se requiere el código del producto");
    }
    const producto = await Producto.findOne({ codigo: req.params.codigo });
    if (!producto) return res.status(404).send("Producto no encontrado");

    res.send({
      codigo: producto.codigo,
      nombre: producto.nombre,
      stockActual: producto.stockActual,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener los productos con stock debajo del minimo
app.get("/productos/stock-bajo", async (req, res) => {
  try {
    const productos = await Producto.find({
      $expr: { $lt: ["$stockActual", "$stockMinimo"] }, // stock actual es menor al minimo
    });
    res.send(productos);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Agrgar producto
app.post("/productos", async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).send(producto);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Reporte de movimientos por fechas
app.get("/movimientos/reporte", async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query; //desde la url
    if (!fechaInicio || !fechaFin) {
      return res.status(400).send("Se requieren fechaInicio y fechaFin");
    }
    console.log(
      `Consultando movimientos desde ${fechaInicio} hasta ${fechaFin}`
    );
    const movimientos = await Movimiento.find({
      createdAt: {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      },
    }).populate("productoId", "codigo nombre");

    res.send(movimientos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Registrar movimiento de entrada o salida de stock

app.post("/movimientos", async (req, res) => {
  try {
    const { productoId, tipo, cantidad, motivo, usuario } = req.body;

    // valido los datos
    if (!productoId || !tipo || !cantidad) {
      return res
        .status(400)
        .send("productoId (código), tipo y cantidad son obligatorios");
    }
    const producto = await Producto.findOne({ codigo: productoId });
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    // calculo el stock segun el tipo
    let nuevoStock = producto.stockActual;
    if (tipo === "entrada") {
      nuevoStock += cantidad;
    } else if (tipo === "salida") {
      if (producto.stockActual < cantidad) {
        return res.status(400).send("Stock insuficiente para la salida");
      }
      nuevoStock -= cantidad;
    } else {
      return res.status(400).send("Tipo de movimiento inválido");
    }

    producto.stockActual = nuevoStock;
    await producto.save();

    // registramos el nuevo movimiento
    const movimiento = new Movimiento({
      productoId: producto._id,
      tipo,
      cantidad,
      motivo,
      usuario,
    });
    await movimiento.save();

    res.status(201).send(movimiento);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
