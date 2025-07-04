const mongoose = require('mongoose');

// producto
const productoSchema = new mongoose.Schema({
  codigo: { 
    type: String, 
    required: true, 
    unique: true 
  },
  nombre: { 
    type: String, 
    required: true 
  },
  categoria: String,
  precio: Number,
  stockActual: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  stockMinimo: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  proveedorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Proveedor' 
  },
  fechaUltimaActualizacion: { 
    type: Date, 
    default: Date.now 
  }
});

// Movimiento
const movimientoSchema = new mongoose.Schema({
  productoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Producto', 
    required: true 
  },
  tipo: { 
    type: String, 
    enum: ['entrada', 'salida'], 
    required: true 
  },
  cantidad: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  motivo: String,
  fecha: { 
    type: Date, 
    default: Date.now 
  },
  usuario: String
});

//Proveedor
const proveedorSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true 
  },
  contacto: String,
  telefono: String,
  email: String,
  productosOfrecidos: [String]
});

module.exports = {
  Producto: mongoose.model('Producto', productoSchema),
  Movimiento: mongoose.model('Movimiento', movimientoSchema),
  Proveedor: mongoose.model('Proveedor', proveedorSchema)
};