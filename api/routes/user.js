'use strict'

var express=require('express');
var UserController=require('../controllers/user');
var api=express.Router();
//cargamos middelware de autenticacion
var md_auth=require('../middelwares/authenticated');

api.get('/home',UserController.home);
//uusamos el middelware de autenticacion,cuando termina, pasa al siguiente metodo (uso del next())
api.get('/pruebas',md_auth.ensureAuth,UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
//si quisieramos hacer el parametro opcional hay que añadir un ? al final
api.get('/user/:id',md_auth.ensureAuth,UserController.getUser);
module.exports=api;