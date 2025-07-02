require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { Producto, Movimiento, Proveedor } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;
app.use(express.json());



mongoose.connect(MONGODB_URL)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));





app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
