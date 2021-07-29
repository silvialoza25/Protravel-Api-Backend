'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = 3001;
mongoose.Ppromise = global.Promise;
mongoose.connect('mongodb+srv://holaMundo:12345Silvia@cluster0.cj3fp.mongodb.net/Destinos?retryWrites=true&w=majority', {useUnifiedTopology:true,useNewUrlParser: true})
    .then(()=>{
        console.log('conexion exitosa a la base de datos.');
        app.listen(port, ()=>{
            console.log('servidor creado correctamente');
        })
    })
    

    .catch(err=> console.log(err));
   