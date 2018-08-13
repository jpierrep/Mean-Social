'use strict'

var express=require('express');
var FollowController=require('../controllers/follow');
var api=express.Router();
var md_auth=require('../middelwares/authenticated');

api.get('/pruebas-follow',md_auth.ensureAuth,FollowController.prueba);
//hacer la request por x-www-for-encoded para post
api.post('/follow',md_auth.ensureAuth,FollowController.saveFollow);
//http delete nos permite eliminar recursos del backend
//http://localhost:3800/api/follow/5b6cf6912bc7cd745030e927 añadiendo el token y el metodo delete
api.delete('/follow/:id',md_auth.ensureAuth,FollowController.deleteFollow);
//http://localhost:3800/api/following/5b6fbb532fa8408b3ca1c1d8/1 pasando el token Authorization en el header
api.get('/following/:id?/:page?',md_auth.ensureAuth,FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?',md_auth.ensureAuth,FollowController.getFollowingUsers);
api.get('/get-my-follows/:followed?/',md_auth.ensureAuth,FollowController.getMyFollows);

module.exports=api;





