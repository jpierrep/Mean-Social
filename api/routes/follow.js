'use strict'

var express=require('express');
var FollowController=require('../controllers/follow');
var api=express.Router();
var md_auth=require('../middelwares/authenticated');

api.get('/pruebas-follow',md_auth.ensureAuth,FollowController.prueba);
//hacer la request por x-www-for-encoded para post
api.post('/follow',md_auth.ensureAuth,FollowController.saveFollow);

module.exports=api;





