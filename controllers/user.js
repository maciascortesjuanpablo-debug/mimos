import {obtenerUsuarios, actualizarUsuario, eliminarUsuario, obtenerUsuarioPorId} from '../models/usuarios.js';
import bcrypt from 'bcrypt';

//Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const {data, error} = await obtenerUsuarios();
        if (error){
            return res.status(500).json({
                error: 'Error al obtener los usuarios'
            });
        }
        return res.status(200).json({
            usuarios: data
        });

    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        return res.status(500).json({
            error: 'Error al obtener los usuarios'
        });
    }
}
//Obtener usuario por ID

export const getUsuarioPorId = async (req, res) => {
    try {
        const {id} = req.params;
        const {data, error} = await obtenerUsuarioPorId(id);
        if (error || !data){
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }
        return res.status(200).json({
            usuario: data
        });

    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return res.status(500).json({
            error: 'Error al obtener el usuario'
        });
    }
}

//Actualizar usuario
export const updateUsuario = async (req, res) => {
    const {id} = req.params;
    const {nombre, email, password, rol} = req.body;

    //Validamos datos
    if (!nombre || !email || !password || !rol){
        return res.status(400).json({
            error: 'Faltan datos'
        });
    }
    try {
        //Encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        const {data, error} = await actualizarUsuario(id, {nombre, email, password: hashedPassword, rol});

        if (error){
            return res.status(500).json({
                error: 'Error al actualizar el usuario'
            });
        }
        return res.status(200).json({
            message: 'Usuario actualizado exitosamente',
            usuario: data[0]    
        });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        return res.status(500).json({
            error: 'Error al actualizar el usuario'
        });
    }
}

//Eliminar usuario
export const deleteUsuario = async (req, res) => {
    const {id} = req.params;
    try {
        const {data, error} = await eliminarUsuario(id);
        if (error){
            return res.status(500).json({
                error: 'Error al eliminar el usuario', error: error.message
            });
        }
        //Si el dato no tiene datos vacios
        if (!data || data.length === 0){
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }
        return res.status(200).json({
            message: 'Usuario eliminado exitosamente',
            usuario: data[0]    
        });
    } catch (error) {
        return res.status(500).json({ error: "Error del servidor", error: error.message });
    }
}
