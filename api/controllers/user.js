'use strict'

var User= require('../models/user');

function home (req,res){
    res.status(200).send({
        message:'Hola mundo desde el servidor'
    
    })
    console.log(req.body);
     };


     function pruebas (req,res){
        res.status(200).send({
            message:'Accion de prueba node js'
            
        })
        console.log(req.body);
         };
    
         
         module.exports={
             home,pruebas
         }