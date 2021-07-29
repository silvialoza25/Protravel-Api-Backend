'use strict'
var express = require('express');
var route = express.Router();
var userController = require('../controller/userController')

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/users'});


route.use('/user',require('./userRoute'));
route.use('/hotel', require('./hoteRouter'));

module.exports = route;