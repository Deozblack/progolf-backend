const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./DB/config')
require('dotenv').config();

// Creando servidor express
const app = express();

// Conecxión a la base de datos
dbConnection();

// Directorio publico express
app.use(express.static('public'));

//Configuracion del CORS
app.use(cors());

// parseo y lectura del body
app.use(express.json());

//Rutas
app.use('/api/users', require('./routes/user')); 

//variable del puerto a usar
let PORT = process.env.PORT || 8000;

// Iniciando el servidor
app.listen(PORT, ()=>{
    console.log(`Iniciando el servidor en el puerto: ${PORT}`);
})

