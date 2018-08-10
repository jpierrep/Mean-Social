'use strict'

var jwt=require('jwt-simple');
var moment=require('moment');
var secret='clave_secreta_node';


exports.createToken=function(user){
var payload={
    //identificador del documento
    sub:user.id,
    name:user.name,
    surname:user.surname,
    nick:user.nick,
    role:user.role,
    image:user.image,
    //fecha de creacion del token
    iat:moment().unix(),
    //fecha de expiracion
    exp:moment().add(30,'days').unix()
 };
 //codifica todo y genera un hash
 return jwt.encode(payload,secret);
};