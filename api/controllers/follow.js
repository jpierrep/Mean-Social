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


module.exports={
    prueba,saveFollow
}