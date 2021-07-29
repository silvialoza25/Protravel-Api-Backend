const { urlencoded } = require('express');
const Hotel = require('../model/hotelModel');
const hotelCtrl = {};

hotelCtrl.registrarHotel = async (req, res) =>{
    const { nombre, descripcion, ubicacion } = req.body;
    if (!nombre || !descripcion || !ubicacion) return res.status(400).send("Todos los campos son obligatorios");
    try {
        const hotel = new Hotel({ nombre, descripcion, ubicacion });
        await  hotel.save(res.status(200).send({message: 'usuario registrado' , }));
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocurrio un problema al registrar el hotel");
    }
} 

hotelCtrl.obtenerHotel = async (req, res, next) => {
    const hoteles =  await Hotel.find({}, (error, hoteles) => {
        if(error) return res.status(500).send({message: 'ocurrio un error'});
        if(!hoteles) return res.status(404).send({message: 'no se encontraron hoteles'});
        return res.status(200).send(hoteles)
    });
};


hotelCtrl.uploadImage = async (req, res) => {
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

module.exports = hotelCtrl;
