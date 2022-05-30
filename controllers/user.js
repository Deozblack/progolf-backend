const { response } = require("express");
const User = require("../models/User");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");



// Funcion para crear un usuario

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
    const token = await generarJWT(dbUser._id, dbUser.nombre, dbUser.apellido, dbUser.telefono, dbUser.cp, dbUser.correo);

    // Guardando en la base de datos
    await dbUser.save();

    console.log("Registro exitoso");
    // Generar respuesta exitosa
    return res.status(201).json({
        ok: true,
        uid: dbUser._id,
        nombre: dbUser.nombre,
        apellido: dbUser.apellido,
        telefono: dbUser.telefono,
        cp: dbUser.cp,
        correo: dbUser.correo,
        token
    })

  } catch (error) {

    console.log(error);
    return res.status(500).json({
      ok: error,
      msg: 'Error en la App!!'
    });

  }
};


// Funcion para hacer el login a la aplicacion

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
    const token = await generarJWT(dbUsuario._id, dbUsuario.nombre, dbUsuario.apellido, dbUsuario.telefono, dbUsuario.cp, dbUsuario.correo);

    //respuesta del servicio

    return res.status(201).json({
      ok: true,
      uid:dbUsuario._id,
      nombre: dbUsuario.nombre,
      apellido: dbUsuario.apellido,
      telefono: dbUsuario.telefono,
      cp: dbUsuario.cp,
      correo: dbUsuario.correo,
      token
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error en la App!!'
    })
  }
}

// Funcion para revalidar el token durante la navegacion del usuario en la app

const revalidarToken = async(req, res = response) =>{
  const { uid, nombre, apellido, telefono, cp, correo} = req;

  const token = await generarJWT(uid, nombre, apellido, telefono, cp, correo);
  return res.json({
    ok: true,
    uid,
    nombre,
    apellido,
    telefono,
    cp,
    correo,
    token
  })
}

// Funcion que muestra los usuarios 

const mostrarUsuarios = async( req, res = response) =>{
  const usuarios = await User.find();

  return res.status(201).json({
    ok: true,
    usuarios
  })
}

// Funcion que obtine un usuario para posterior hacer modificacion sobre el

const obtenerUsuario = async( req, res = response ) =>{
  const uid = req.params.id;

  try {

    const usuario = await User.findById(uid);
    
    return res.status(201).json({
      ok: true,
      usuario
    })


  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: 'Error en la App!!'
    })
  }
}

// Funcion para actualizar el usuario

const actualizarUsuario = async( req, res = response ) =>{
  const { _id, nombre, apellido, correo, password } = req.body;
  
  // const uid = req.params._id;
  
  try {
    
    // Buscamos el usario en la db
    const dbUsuario = await User.findById(_id);
    
    
    // Comprobamos que el usuario exista en la DB
    if (!dbUsuario) {
      return res.status(404).json({
        ok:false,
        msg: 'No existe ningún usuario con este ID'
      })
    }
    
    // Comenzamos actualizar al usuario
    // NOTA: Podemos extraer algun campo especificao y hacer modificaciones con el
    
    const {...campos} = req.body;
    
    // Realizamos la actualizacion en la DB
    
    const usuarioActualizado = await User.findByIdAndUpdate(_id, campos, {new: true});

    return res.status(201).json({
      ok: true,
      usuario: usuarioActualizado
    })


  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok:false,
      mg: 'Error en la App!!'
    })
  }
}

// Funcion para actualizar la contraseña

const actualizarPass = async( req, res = response ) =>{
  const { _id, oldPassword, newPassword, repPassword } = req.body;
  
  // const uid = req.params._id;
  
  try {

    // Buscamos el usario en la db
    const dbUsuario = await User.findById(_id);
    
    
    // Comprobamos que el usuario exista en la DB
    if (!dbUsuario) {
      return res.status(404).json({
        ok:false,
        msg: 'No existe ningún usuario con este ID'
      })
    }
    
    // Comenzamos actualizar al usuario
    // NOTA: Podemos extraer algun campo especificao y hacer modificaciones con el
    
    const {...campos} = req.body;

    //Confirmar que el password haga match

    const validPassword = bcryptjs.compareSync(oldPassword, dbUsuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'El password antiguo es incorrecto.'
      })
    }


    //Hashear la contraseña
    let salt = bcryptjs.genSaltSync();
    dbUsuario.password = bcryptjs.hashSync(newPassword, salt);
    
    // Realizamos la actualizacion en la DB
    
    const usuarioActualizado = await User.findByIdAndUpdate(_id, dbUsuario, {new: true});

    return res.status(201).json({
      ok: true,
      usuario: usuarioActualizado
    })


  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok:false,
      mg: 'Error en la App!!'
    })
  }
}

// Funcion para eliminar usuarios

const eliminarUsuario = async(req, res = response) =>{
  const uid = req.params.id;

  try {

    // Buscamos el usuario en la DB
    const usuario = await User.findById(uid);

    // Comprobamos que el usuario exista en la BD
    if (!usuario) {
      return res.status(404).json({
        ok:false,
        msg: 'Este usuario no existe en la DB'
      })
    }

    // Eliminamos al usuario de la DB
    await User.findByIdAndDelete(uid);

    return res.status(201).json({
      ok:true,
      msg: 'Usuario eliminado..'
    })



  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok:true,
      msg: 'Error en la App!!'
    })
  }
}

module.exports = {
    login,
    revalidarToken,
    crearUsuario,
    mostrarUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario,
    actualizarPass
}
