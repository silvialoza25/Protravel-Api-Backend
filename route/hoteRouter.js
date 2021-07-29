var express = require('express');
var api = express.Router();
var hotelController = require('../controller/hotelController');

api.post('/registrar', hotelController.registrarHotel);
api.get('/hotel', hotelController.obtenerHotel);


module.exports = api;