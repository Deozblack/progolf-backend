const {response} = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next ) =>{
    const token = req.header('x-token');

    if (!token) {
        return res.status(404).json({
            ok: false,
            msg: 'Error en el token'
        })
    }

    try {
        
        const {uid, nombre, apellido, correo} = jwt.verify(token, process.env.SECRET_JWT_SEED);

        req.uid = uid;
        req.nombre = nombre;
        req.apellido = apellido;
        req.correo = correo;

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }

    //SI TODO SALE BIEN LLAMA NEXT

    next();

}

module.exports = {
    validarJWT
}