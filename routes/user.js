const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, login, revalidarToken, mostrarUsuarios, actualizarUsuario, obtenerUsuario, eliminarUsuario } = require("../controllers/user");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isLength({ min: 4 }),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 })
], login);

router.get('/renew', validarJWT, revalidarToken);

router.post('/new', [
    check('nombre', 'El nombre es obligatorio...').notEmpty().isLength({min:4}),
    check('apellido', 'El apellido es obligatorio...').notEmpty().isLength({min: 4}),
    check('telefono', 'El teléfono es obligatorio...').notEmpty().isLength({min: 10}),
    check('cp', 'El código postal es obligatorio...').notEmpty().isLength({min: 5}),
    check('password', 'La contraseña es obligatoria...').notEmpty().isLength({min: 4}),
    check('correo', 'El correo es obligatorio...').notEmpty().isEmail(),
], crearUsuario);

router.post('/user/:id', [
    check('nombre', 'El nombre es obligatorio...').notEmpty().isLength({min:4}),
    check('apellido', 'El apellido es obligatorio...').notEmpty().isLength({min: 4}),
    check('telefono', 'El teléfono es obligatorio...').notEmpty().isLength({min: 10}),
    check('cp', 'El código postal es obligatorio...').notEmpty().isLength({min: 5}),
    check('password', 'La contraseña es obligatoria...').notEmpty().isLength({min: 4}),
    check('correo', 'El correo es obligatorio...').notEmpty().isEmail(),
], actualizarUsuario);

router.get('/view', mostrarUsuarios);

router.get('/user/:id', obtenerUsuario);

router.delete('/user/delete/:id', eliminarUsuario);





module.exports = router;