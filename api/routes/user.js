'use strict'

var express=require('express');
var UserController=require('../controllers/user');
var api=express.Router();
//cargamos middelware de autenticacion
var md_auth=require('../middelwares/authenticated');

var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/users'})

api.get('/home',UserController.home);
//uusamos el middelware de autenticacion,cuando termina, pasa al siguiente metodo (uso del next())
api.get('/pruebas',md_auth.ensureAuth,UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
//si quisieramos hacer el parametro opcional hay que a�adir un ? al final
api.get('/user/:id',md_auth.ensureAuth,UserController.getUser);
api.get('/users/:page?',md_auth.ensureAuth,UserController.getUsers);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);

//si queremos pasar varios middelwares tenemos que pasarle un arreglo
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);//utilizamos middelware de subidas 


module.exports=api;