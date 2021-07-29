const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema(
   { 
    nombre: String,
    descripcion: String,
    ubicacion: String,
    image: String
   },
   {
       timestamps: true,
       versionKey: false
   }
);
module.exports = mongoose.model('Hotel', hotelSchema);