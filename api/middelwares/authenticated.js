'use strict'

var jwt=require('jwt-simple');
var moment=require('moment');
var secret='clave_secreta_node';

//hasta que no se ejecute el next, node no saldra del middelware
exports.ensureAuth=function(req,res,next){
if(!req.headers.authorization){
    return res.status(403).send({messaje:'la peticion no tiene la cabecera de autorizacion'});
}
//quitar comillas simples y dobles
var token=req.headers.authorization.replace(/['"]+/g,'');

//puede lanzar excepciones
try{
var payload=jwt.decode(token,secret);
    if(payload.exp<=moment().unix()){
        return res.status(401).send({
            messaje:'El token ha expirado'
        });
    }

}catch (ex){
    return res.status(404).send({
        messaje:'El token no es válido'
    });
}
//dejar guardado el usuario para accederlo desde otro lado
req.user=payload;
next();

}