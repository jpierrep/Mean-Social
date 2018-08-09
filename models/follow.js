'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var FollowSchema=Schema({
    followed:{type:Schema.ObjectId,ref:'User'},
    user:{type:Schema.ObjectId,ref:'User'}
});

module.export=mongoose.model('Follow',FollowSchema);