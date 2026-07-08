import express from "express";
import { listarHelados, obtenerHelado, crearNuevoHelado, obtenerPorCat, editar, eliminar } from "../controllers/helados.js";

const router = express.Router();

//Ruta para listar todos los helados
router.get('/helados', listarHelados);

//Ruta para obtener un helado por ID
router.get('/helados/:id', obtenerHelado);

//Ruta para obtener helados por categoria
router.get('/helados/categoria/:categoria', obtenerPorCat);

//Ruta para crear un nuevo helado
router.post('/helados', crearNuevoHelado);

//Ruta para actualizar un helado
router.put('/helados/:id', editar);

//Ruta para eliminar un helado
router.delete('/helados/:id', eliminar);

export default router;