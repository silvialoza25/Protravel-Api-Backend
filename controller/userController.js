'use strict'
const { urlencoded } = require('express');
var User = require('../model/userModel');
var bcrypt = require('bcrypt')
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');


const userCtrl = {};
const  saltRounds  =  10 ; 
var jwt = require('../services/jwt');
const { find, exists } = require('../model/userModel');

function removeFileUploads(res, filePath, message){
    fs.unlink(filePath, (err) => {
        return res.status(200).send({message: message});
    });
}


userCtrl.proof = async (req, res) => {
    console.log('listo');
   res.status(200).send({message: 'prueba exitosa'});
 
}
userCtrl.registerUser = async (req, res) =>{
    var params = req.body;
    var user = new User();
    if (params.name && params.nick && params.surname && params.email && params.password ) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        User.find({$or: [
            {email: user.email.toLowerCase()},
            {nick: user.nick.toLowerCase()}
        ]}).exec((err, users) => {
            if(err) return res.status(500).send({message: 'error en la peticion de usuarios!!!'})

            if(users && users.length >= 1){
                return res.status(200).send({message: 'el usuario que intenta registrar ya existe'});
            }else{
                bcrypt.genSalt(saltRounds,  function(err, salt )  { 
                    bcrypt.hash( params.password, salt, function(err, hash ) { 
                        // Almacenar hash en su DB de contraseña. 
                        user.password = hash;
                        user.save((err, userStored) => {
                            if (err) return res.status(500).send({message: 'error al guardar el usuario'});
                            if (userStored) {
                                res.status(200).send({user: userStored})
                                
                            } else {
                                res.status(404).send({message: 'no se ha registrado el usuario'})
                            }
                        }) 
                    }); 
                }); 
            }

        });
        
    }else{
        res.status(200).send({message: 'envia todos los campos nesesarios !!!'});
    }
}

userCtrl.loginUser = async (req, res) => {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({email: email}, (err, user) => {
        console.log(user);
        if(err) return res.status(500).send({ message: 'error en la peticion' });
        if(user){
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){
                    if (params.gettoken) {
                        // generar y devolver token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    } else {
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                 
                }else{
                    return res.status(404).send({message: 'el usuario no se ha podido identificarr'});
                }
            })
        }else{
            return res.status(404).send({message: 'el usuario no se ha podido identificar'});
        }
    });
}

userCtrl.getUser = async (req, res) => {
    var userId = req.params.id;
    User.findById(userId, (err, user) => {
       // user.password = undefined;
        if(err) return res.status(500).send({message: 'error en la peticion'});

        if(!user) return r5es.status(404).send({message: 'el usuario no existe'});

        return res.status(200).send({user});
    })
}

userCtrl.getUsers = async (req, res) => {
   var identity_user_id = req.user.id;
   var page = 1;
   if (req.params.page) {
       page = req.params.page;
   }
   var intemPage = 5;
   User.find().sort('_id').paginate(page, intemPage, (err, users, total) => {
    if(err) return res.status(500).send({message: 'Error en la peticion'});

    if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

    return res.status(200).send({users, total, pages: Math.ceil(total/intemPage)});
   })
}

userCtrl.updateUser = async (req, res) => {
    var userId = req.params.id;
    var update = req.body;
    delete update.password;
    
    if(userId != req.user.sub) {
        return res.status(500).send({message: 'No tienes permisos para actualizar estos datos.'});
    }
    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdate) => {
        if(err) return res.status(500).send({message: 'no se hapodido actualizar el usuario'});
        
        return res.status(200).send({user: userUpdate});
    });

}

userCtrl.uploadImage = async (req, res) => {
    var userId = req.params.id;
   
    if(req.files){
        var filePath = req.files.image.path;
        console.log(filePath);
        var fileSplit = filePath.split('\\');
        console.log(fileSplit);
        var fileName = fileSplit[4];
        console.log(fileName);
        var extendSplit = fileName.split('\.')
        console.log(extendSplit);
        var fileExtend = extendSplit[1];
        console.log(fileExtend);

        if (userId != req.user.sub){
           return removeFileUploads(res, filePath, 'no tienes permisos para actualizar los datos de esta usuario');
        }

        if(fileExtend== 'png' || fileExtend == 'jpg' || fileExtend == 'jpeg' || fileExtend == 'git'){
            User.findByIdAndUpdate(userId, {image: fileName}, {new: true}, (err, userUpdate) => {

                if(err) return res.status(500).send({message: 'no se hapodido actualizar el usuario'});
        
                return res.status(200).send({user: userUpdate});
            });

        }else{
            return removeFileUploads(res, filePath, 'extenciaon no valida');
        }

    }else {
        return res.status(500).send({message: 'no se han subido imagenes'});
    }
 
}

userCtrl.getImageFile = async (req, res) => {
    var imageFile =  req.params.imageFile;
    console.log(imageFile);
    var pathFile =  '../protravel-api-master/uploads/users/'+imageFile;
   

    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
          return  res.status(200).send({message: 'No existe la imagen'});
        }
    }) 
}


userCtrl.uploadImage = async (req, res) => {
    var hotelId = req.params.id;
   
    if(req.files){
        var filePath = req.files.image.path;
        console.log(filePath);
        var fileSplit = filePath.split('\\');
        console.log(fileSplit);
        var fileName = fileSplit[4];
        console.log(fileName);
        var extendSplit = fileName.split('\.')
        console.log(extendSplit);
        var fileExtend = extendSplit[1];
        console.log(fileExtend);


        if(fileExtend== 'png' || fileExtend == 'jpg' || fileExtend == 'jpeg' || fileExtend == 'git'){
            Hotel.findByIdAndUpdate(hotelId, {image: fileName}, {new: true}, (err, hotelActualizado) => {

                if(err) return res.status(500).send({message: 'no se hapodido actualizar el hotel'});
        
                return res.status(200).send({hotel: hotelActualizado});
            });

        }else{
            return removeFileUploads(res, filePath, 'extenciaon no valida');
        }

    }else {
        return res.status(500).send({message: 'no se han subido imagenes'});
    }
 
}



module.exports = userCtrl;
