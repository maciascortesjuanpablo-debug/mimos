//Importamos el bycript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { crearUsuario, obtenerPorEmail } from '../models/usuarios.js';

//Registro

export const registro = async (req, res)=> {
    try {
        const {nombre,email,password}=req.body
    //Validar datos
    if (!nombre || !email || !password){
        return res.status (400).json({
            error: 'faltan usuarios'
        });
    }
    //Verificamos que el gmail ya existe
    const {data: usuarioExiste}=await obtenerPorEmail(email);
    if(usuarioExiste){
        return res.status (400).json({
            error:'El email ya existe'
        });
    }
    //Codigo para encriptar contraseña
    const heshedPassword=await bcrypt.hash(password,10);

    //Rol por defecto
    const rolPorDefecto='usuario';

    //Guardar en la base de datos
    const {data, error} = await crearUsuario(
        nombre,
        email,
        heshedPassword,
        rolPorDefecto
    );

    if (error){
        return res.status(500).json({
            error: 'Error al crear el usuario'
        });

    }
    res.status(201).json({
        message: 'Usuario creado exitosamente',
        usuario: {
            id: data[0].id,
            nombre: data[0].nombre,
            email: data[0].email,
            rol: data[0].rol
        }
    });

    } catch (error) {
        console.error('Error en el registro:', error);
        return res.status(500).json({
            error: error.message
        });
    }
};

    //Crear login
export const login = async (req, res) => {
    try{
        const {email,password}=req.body;
        //Validar datos
        if (!email || !password){
            return res.status(400).json({
                error: 'Todos los datos son requeridos'
            });
        }

        //Verificar que el usuario existe
        const {data: usuario}=await obtenerPorEmail(email);
        if (!usuario){
            return res.status(400).json({
                error: 'El email no esta registrado'
            });
        } 
        //Validamos la contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida){
            return res.status(400).json({
                error: 'Contraseña incorrecta'
            });
        }
        //Generar token JWT
        const token = jwt.sign(
            { id: usuario.id,
              nombre: usuario.nombre,
              email: usuario.email, 
              rol: usuario.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login exitoso',
            token
        });

    }catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({
            error: error.message
        });
}

};
