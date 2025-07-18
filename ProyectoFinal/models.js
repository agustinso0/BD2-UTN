const mongoose = require("mongoose");

// producto
const productoSchema = new mongoose.Schema(
  {
    proveedorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proveedor",
    },
    nombre: {
      type: String,
      required: true,
    },
    codigo: {
      type: String,
      required: true,
      unique: true,
    },
    categoria: String,
    precio: {
      type: Number,
      default: 0,
      min: 0,
    },
    stockActual: {
      type: Number,
      default: 0,
      min: 0,
    },
    stockMinimo: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Movimiento
const movimientoSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    tipo: {
      type: String,
      enum: ["entrada", "salida"],
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1,
    },
    motivo: String,
    fecha: {
      type: Date,
      default: Date.now,
    },
    usuario: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//Proveedor
const proveedorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    telefono: String,
    email: String,
    productosOfrecidos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = {
  Producto: mongoose.model("Producto", productoSchema),
  Movimiento: mongoose.model("Movimiento", movimientoSchema),
  Proveedor: mongoose.model("Proveedor", proveedorSchema),
};
