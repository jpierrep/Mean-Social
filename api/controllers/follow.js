'use strict'

//var path=require('path');
//var fs=require('fs');
var mongoosePaginate=require('mongoose-pagination');

var User=require('../models/user');
var Follow=require('../models/follow');

function prueba(req,res){
res.status(200).send({message:'Hola mundo desde el controller follows'})

}

function saveFollow(req,res){
    
    
    var params=req.body;
    var follow=new Follow();
    //tengo el usuario identificado desde que creo el token
    follow.user=req.user.sub; //solo consideramos el id
    console.log(params.followed);
     params.followed
    follow.followed=params.followed;
    follow.save((err,followStored)=>{
        if(err) return res.status(500).send({message:'Error al guardar el seguimiento'});
        if(!followStored) return res.status(404).send({message:'Error el seguimiento no se ha guardado'});

        return res.status(200).send({follow:followStored});
    });

}

function deleteFollow(req,res){
     var userId=req.user.sub;
     var followId=req.params.id
    // Follow.findByIdAndRemove
    Follow.find({'user':userId,'followed':followId}).remove(err=>{
     if(err) return    res.status(500).send({message:'Error al dejar de seguir'});
      return  res.status(200).send({message:'El follow se ha eliminado'})

    
    });
}

    function getFollowingUsers(req,res){
        var userId=req.user.sub;
        //dar flexibilidad con el parametro opcional
        if(req.params.id && req.params.page){
            userId=req.params.id;
        }
        var page=1;
        if(req.params.page){
            page=req.params.page;
        }else{
            //por si no viene el usuario sino la pagina primero 
            //ej: http://localhost:3800/api/following/2
            page=req.params.id;
        }
        var itemsPerPage=4;
        //nos entrega el objeto populado al que hace referencia el campo followed que es un id de usuario
        Follow.find({user:userId}).populate({path:'followed'}).paginate(page,itemsPerPage,(err,follows,total)=>{
            if(err) return    res.status(500).send({message:'Error en el servidor'});
            if(!follows) return res.status(500).send({message:'No estas siguiendo a ningun usuario'});
            return res.status(200).send({
                total:total,
                pages:Math.ceil(total/itemsPerPage),
                follows
            });
        });
    }






module.exports={
    prueba,saveFollow,deleteFollow,getFollowingUsers
}