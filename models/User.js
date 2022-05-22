const {Schema, model} = require('mongoose');

const UserSchema = Schema({
    nombre:{
        type: String,
        required: true
    },
    apellido:{
        type: String,
        required: true
    },
    telefono:{
        type:Number,
        required: true
    },
    sc:{
        type:String
    },
    cp:{
        type:Number,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    correo:{
        type: String,
        required: true,
        unique: true
    },
    date:{
        type: Date,
        required: false
    },
    direccion:{
        type: String,
        required: false
    },
    estado:{
        type: String,
        required: false
    },
    ciudad:{
        type: String,
        required: false
    }
});

module.exports = model('User', UserSchema);