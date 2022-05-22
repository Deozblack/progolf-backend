const { response } = require("express");
const User = require("../models/User");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { nombre, apellido, correo, password } = req.body;

  try {

    // Verificar que el correo no este repetido
    const usuario = await User.findOne({ correo });

    if(usuario){
        return res.status(404).json({
            ok: false,
            msg: "Este correo electrónico ya existe"
        })
    }

    // Crear usuario con su modelo respectivo
    const dbUser = new User(req.body);

    //Hashear la contraseña
    let salt = bcryptjs.genSaltSync();
    dbUser.password = bcryptjs.hashSync(password, salt);

    //generar el JWT
    const token = await generarJWT(dbUser.uid, dbUser.nombre, dbUser.apellido, dbUser.correo);

    // Guardando en la base de datos
    await dbUser.save();

    console.log("Registro exitoso");
    // Generar respuesta exitosa
    return res.status(201).json({
        ok: true,
        uid: dbUser.id,
        nombre: dbUser.nombre,
        token
    })

  } catch (error) {

    console.log(error);
    return res.status(500).json({
      ok: error,
      msg: "Error en el server, contactar al admin",
    });

  }
};

const login = async (req,res = response) =>{
  const {correo, password} = req.body;

  try {

    const dbUsuario = await User.findOne({correo});

    //verificar que el correo exista
    if (!dbUsuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Las credenciales no son validas'
      })
    }

    //Confirmar que el password haga match

    const validPassword = bcryptjs.compareSync(password, dbUsuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'El password es incorrecto.'
      })
    }

    //generamos el JWT
    const token = await generarJWT(dbUsuario.uid, dbUsuario.nombre, dbUsuario.apellido, dbUsuario.correo);

    //respuesta del servicio

    return res.json({
      ok: true,
      uid:dbUsuario.id,
      nombre: dbUsuario.nombre,
      apellido: dbUsuario.apellido,
      correo: dbUsuario.correo,
      token
    })
    
  } catch (error) {
    console.log(error);
    return res.json({
      ok: false,
      msg: "Error en el server, contactar al admin"
    })
  }
}

const revalidarToken = async(req, res = response) =>{
  const { uid, nombre, apellido, correo} = req;

  const token = await generarJWT(uid, nombre, apellido, correo);
  return res.json({
    ok: true,
    uid,
    nombre,
    apellido,
    correo,
    token
  })
}

module.exports = {
    login,
    revalidarToken,
    crearUsuario
}
