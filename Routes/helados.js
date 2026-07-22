import express from "express";
import { listarHelados, obtenerHelado, crearNuevoHelado, obtenerPorCat, editar, eliminar } from "../controllers/helados.js";
import { verificarToken, verificarAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Rutas publicas

//Ruta para listar todos los helados
router.get('/helados', listarHelados);

//Ruta para obtener un helado por ID
router.get('/helados/:id', obtenerHelado);

//Ruta para obtener helados por categoria
router.get('/helados/categoria/:categoria', obtenerPorCat);

//Rutas privadas

//Ruta para crear un nuevo helado
router.post('/helados', verificarToken, verificarAdmin, crearNuevoHelado);

//Ruta para actualizar un helado
router.put('/helados/:id', verificarToken, verificarAdmin, editar);

//Ruta para eliminar un helado
router.delete('/helados/:id', verificarToken, verificarAdmin, eliminar);

export default router;