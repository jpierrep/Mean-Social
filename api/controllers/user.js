'use strict'
var bcrypt=require('bcrypt-nodejs');

var User= require('../models/user');
var jwt=require('../services/jwt');

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
                    if(users && users.length>=1){
                        return res.status(200).send({message:'El usuario que intenta registrar ya existe'});  
                    } else{
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
                        
                    }
                
                });



            }else{
                //los datos son necesarios
                res.status(200).send({message:'Envia todos los campos necesario'});
            }

         }

         //registrar nuevos usuarios
         function loginUser(req,res){
             var params=req.body;
             var email=params.email;
             var password=params.password;
        User.findOne({email:email},(err,user)=>{
            if(err) return res.status(500).send({message:'Error en la peticion'});
            if(user){
                bcrypt.compare(password,user.password,(err,check)=>{
                    if(check){
                        //si viene un token devolver token si no devolver datos del usuario
                        if(params.gettoken){
                            //generar y devolver token
                            return res.status(200).send({
                                token:jwt.createToken(user)
                            });
                        }else{
                    //eliminar la password por seguridad
                        user.password=undefined;
                        //devolver datos de usuario
                      return  res.status(200).send({user});
                        }

                        

                    }else{
                      return  res.status(404).send({message:'El usuario no se ha podido logear'});

                    }
                    
                });
            }else{
                res.status(404).send({message:'El usuario no existe'});
            }
        })    


         }
    
             //COonseguir datos de un usuario    

     function getUser(req,res){
         //llegara por la url el id del usuario
         //cuando llega por url utilizamos params cuando nos llegan por post o put utilizamos body
        var userId=req.params.id;
      User.findById(userId,(err,user)=>{
           if(err) return res.status(500).send({message:'Error en la peticion'});
           if(!user) return res.status(404).send({message:'Error, el usuario no existe'});
      
      return res.status(200).send({user});
       });
     }
    
         
         module.exports={
             home,pruebas,saveUser,loginUser,getUser
         }