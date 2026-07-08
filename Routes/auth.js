import express from "express";
import { registro, login } from "../controllers/Auth.js";
import { forgotPassword, verifyCode } from "../controllers/recuperar.js";


const router = express.Router();

//Ruta para el registro
router.post('/register', registro);
//Ruta para la recuperación de contraseña
router.post('/forgot-password', forgotPassword);
//Ruta para el login
router.post('/login', login);
//Ruta para verificar el codigo de recuperación y cambiar la contraseña
router.post('/verify-code', verifyCode);

export default router;