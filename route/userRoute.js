'use strict'
var express = require('express');
var api = express.Router();
var userController = require('../controller/userController');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: '../protravel-api-master/uploads/users'})

api.get('/proof', md_auth.ensureAuth, userController.proof);
api.post('/register', userController.registerUser);
api.post('/login',userController.loginUser);
api.get('/:id', md_auth.ensureAuth, userController.getUser);
api.get('/users/:page', md_auth.ensureAuth, userController.getUsers);
api.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], userController.uploadImage);
api.get('/get-image-user/:imageFile', md_auth.ensureAuth, userController.getImageFile);


module.exports = api;