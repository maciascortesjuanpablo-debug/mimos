import express from 'express';
import {getUsuarios, updateUsuario, getUsuarioPorId, deleteUsuario} from '../controllers/user.js';

const router = express.Router();

//Ruta para obtener todos los usuarios
router.get('/', getUsuarios);

//Ruta para obtener un usuario por ID
router.get('/:id', getUsuarioPorId);

//Ruta para actualizar un usuario
router.put('/actualizar/:id', updateUsuario);

//Ruta para eliminar un usuario
router.delete('/eliminar/:id', deleteUsuario);

export default router;