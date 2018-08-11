'use strict'
//index js para hacer las conexiones y la creacion del servidor
var mongoose=require('mongoose');
var app=require('./app');
var port= 3800;
//conexion database
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social')
    .then(()=>{
        console.log("la conexion se ha realizado correctamente");
        //crear servidor
        app.listen(port,()=>{
        console.log("Servidor corriendo en localhost:3800")
        }) 
    
    })
    .catch(err=>console.log(err));