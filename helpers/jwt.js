const jwt = require('jsonwebtoken');

const generarJWT = (uid, nombre,apellido,correo) =>{
    const payload = {
        uid,
        nombre,
        apellido,
        correo
    }
    return new Promise((resolve, project) => {
        jwt.sign(payload,process.env.SECRET_JWT_SEED, {
           expiresIn: '1h' 
        }, (err, token) => {
            if(err){
                //TODO MAL
                console.log(err);
                reject(err); 
            }else{
                //TODO BIEN
                resolve(token)
            }
        });
    })
}

module.exports = {
    generarJWT
}