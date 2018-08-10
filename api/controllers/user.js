'use strict'
var bcrypt=require('bcrypt-nodejs');

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

         //registrar nuevos usuarios
         function saveUser(req,res){
            var params=req.body;
            var user=new User();
            

            if(params.name&&params.surname&&params.email&&params.password){
                user.name=params.name;
                user.surname=params.surname;
                user.nick=params.nick;
                user.email=params.email;
                user.role='ROLE_USER';
                user.image=null;

                //verificar que el usuario no existe
                //$or: y un array en
              //  User.findOne({email:user.email.toLowerCase()});
                
              //comprobar usuarios duplicados
              User.find({$or:[
                    {email:user.email.toLowerCase()},
                    {nick:user.nick.toLowerCase()}
                    
                ]}).exec((err,users)=>{
                    if(err) return res.status(500).send({message:'Error en la peticion de usuarios'});
                   //console.log(users +'tamaño'+users.length);
                    if(users && users.length>=1)  return res.status(200).send({message:'El usuario que intenta registrar ya existe'});  
                
                });

                //trae opciones null como el costo del cifrado,iterar el hash para fortificar la contraseña
                //por defecto viene con un coste de 10
                
                bcrypt.hash(params.password,null,null,(err,hash)=>{
                    user.password=hash;
                    user.save((err,userStored)=>{
                        if(err) return res.status(500).send({message:'Error al guardar el usuario'});
                        //si se creo el usuario 
                        if(userStored){
                            res.status(200).send({user:userStored});  
                        }else{
                            res.status(404).send({message:'No se ha registrado el usuario'});  
                        }
                    }); 
                });

            }else{
                //los datos son necesarios
                res.status(200).send({message:'Envia todos los campos necesario'});
            }
            

         }
    
         
         module.exports={
             home,pruebas,saveUser
         }