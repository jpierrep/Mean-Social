'use strict'

var express=require('express');
var bodyParser=require('body-parser');

var app=express();
  
  //cargar rutas

  //middelware metodo que se ejecuta antes de llegar a un controlador
  app.use(bodyParser.urlencoded({extended:false}));
  app.use(bodyParser.json()); // transforma los datos de la peticion a json

  //cors
  //rutas
 app.post('/',(req,res)=>{
res.status(200).send({
    message:'Accion de prueba node js'
    
})
console.log(req.body);
 })
  //exportar configuracion

  module.exports=app;