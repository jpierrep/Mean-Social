'use strict'
//encriptador
var bcrypt=require('bcrypt-nodejs');
//paginacion de mongoose
var mongoosePaginate=require('mongoose-pagination');
var User= require('../models/user');
var Follow= require('../models/follow');
//uso de tokens
var jwt=require('../services/jwt');
//uso de ficheros
var fs=require('fs');
//rutas de ficheros
var path=require('path');

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
      //comprobar si seguimos al usuario que nos llega por la url
           Follow.findOne({'user':req.user.sub,'followed':userId}).exec((err,follow)=>{
            if(err) return res.status(500).send({message:'Error al comprobar el seguimiento'})  
            return res.status(200).send({user,follow});
           });
    //  return res.status(200).send({user});
       });
     }

     //Devolver un listado de usuarios paginados
     function getUsers(req,res){
         //recoger el id del usario logeado en el momento
         // en el middelware de usuario hemos seteado una propiedad a la request
        var identity_user_id=req.user.sub; //sub ha sido el nombre que le hemos seteado en el token al id del usuario
        var page=1;
        if(req.params.page){
            //gracias al paquete de paginacion de mongoose
            page=req.params.page;
        }
        //cantidad de items por pagina
        //luego se consulta por el numero de pagina
        var itemsPerPage=2;
        //find solo trae todo lo de la bd,paginate realiza un count y lo entrega en total
        User.find().sort('_id').paginate(page,itemsPerPage,(err,users,total)=>{
            if (err) return res.status(500).send({message:"Error en la peticion"});
            if (!users) return res.status(404).send({message:"No hay usuarios disponibles"});
            return res.status(200).send({
               //devuelve coleccion de usuarios y total junto a las paginas
                users,
                total,
                pages:Math.ceil(total/itemsPerPage) //redondea
            })
        });
     }

     //actualizar un usuario
     function updateUser(req,res){
        //llegara por la url el id del usuario
        //cuando llega por url utilizamos params cuando nos llegan por post o put utilizamos body
       var userId=req.params.id;
       var update=req.body;
       //borrar la propiedad password por seguridad
       delete update.password;
       //utilizaremos este metodo solo cuando el propietario de la cuenta quiera cambiar sus datos
       if(userId!=req.user.sub)  return res.status(500).send({message:'No tienes permisos para actualizar los datos del usuario'});
       User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated)=>{
        if(err) return res.status(500).send({message:'Error en la peticion'});
        if(!userUpdated) return res.status(404).send({message:'Error, No se ha podido actualizar el usuario' });
        //el user updated que devuelve es el original no el actualizado,es por eso que pasamos como parametro {new:true} para que devuelva el actualizado
        return res.status(200).send({user:userUpdated});

       });

    }



     //subir archivos de usuario avatar

     function uploadImage(req,res){

     var userId=req.params.id;
     
        //request trae archivos si es que son subidos
      if(req.files){
          //campo path del campo imagen enviado por post
        var file_path=req.files.image.path;
        //obtneemos el nombre del archivo
        var file_split=file_path.split('\\');
        console.log(file_split);
        //[ 'uploads', 'users', 'LmkbKFCxtEqb4Ij6eeppHipB.jpg' ]
        //en la posicion 2 entrega el nombre del archivo
        var file_name=file_split[2]
        //extencion del archivo
        var ext_split=file_name.split('\.');
        var file_ext=ext_split[1];
        //comprobar que las extenciones son correctas
//puede subir usuarios solamente el dueño de la cuenta
        if(userId!=req.user.sub){
         return   removeFilesOfUploads(res,file_path,"No tienes permisos para subir imagenes a este usuario"); //lleva return para no mandar respuestas seguidas y nos de error no se pueden enviar varias cabeceras a la vez seeccion 5 clase 27
        }
        if(  file_ext=='png'||file_ext=='jpg'||file_ext=='jpeg'||file_ext=='gif'){
           //Actualizar documento de usuario logeado
            User.findByIdAndUpdate(userId,{image:file_name},{new:true},(err,userUpdated)=>{
                if(err) return res.status(500).send({message:'Error en la peticion'});
                if(!userUpdated) return res.status(404).send({message:'Error, No se ha podido actualizar el usuario' });
                //el user updated que devuelve es el original no el actualizado,es por eso que pasamos como parametro {new:true} para que devuelva el actualizado
                return res.status(200).send({user:userUpdated});
            });

        }else{
        return  removeFilesOfUploads(res,file_path,"error en la extencion"); //lleva return para no mandar respuestas seguidas y nos de error no se pueden enviar varias cabeceras a la vez

        }
    }else{
          return res.status(200).send({message:'No se han subido archivos'});
      }

     }
   function  removeFilesOfUploads(res, file_path,message_print){
      //si no es correcto, se elimina el archivo subido, pues la libreria lo sube de todas maneras
      fs.unlink(file_path,(err)=>{
        //hay error
          return res.status(200).send({message:message_print});
      });
     }

     function getImageFile(req,res){
        var image_file=req.params.imageFile;
        var path_file='./uploads/users/'+image_file;
        console.log(path_file);
        fs.exists(path_file,(exists)=>{
            if(exists) res.sendFile(path.resolve(path_file)); //metodo de express para fresponder con ficheros
            else res.status(200).send({message:'No existe la imagen'});
        })

     }
         
         module.exports={
             home,pruebas,saveUser,loginUser,getUser
             ,getUsers,updateUser,uploadImage,getImageFile
         }