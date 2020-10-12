'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = 3900;

// Parámetros para la conexion a mongoose
const url_bdd = 'mongodb://localhost:27017/api_rest_blog';
const opciones = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
};

// Conexión a la BDD
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect(url_bdd, opciones)
    .then(() => {
        // Conexión sin problemas
        console.log('Conexion a la BDD realizada correctamente!');

        // Crear servidor y ponerme a escuchar peticiones http
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost/'+port);
        })
    });