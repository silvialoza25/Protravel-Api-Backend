'use strict'

var jwt = require('jwt-simple');
const { unix } = require('moment');
var moment = require('moment');
const user = require('../model/userModel');
var secret = 'secrect_password_social_network';
exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()

    };
    return jwt.encode(payload,secret);
};