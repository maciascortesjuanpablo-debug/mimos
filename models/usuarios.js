//Importamos la base de datos
import { supabase } from '../config/supabase.js';

//Funcion para crear todos los usuarios
export const crearUsuario = async (nombre,email,password,rol) => {
    const { data, error } = await supabase
        .from('usuarios')
        .insert({nombre,email,password,rol: rol || 'usuario'})
        .select('id, nombre, email,rol');
        return { data, error };
};

//Obtener todos los usuarios
export const obtenerUsuarios = async () => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email,rol');
    return { data, error };
};

//Buscar el usuario por email para login
export const obtenerPorEmail = async (email) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();
    return { data, error };
};

//Obtener usuarios por ID
export const obtenerUsuarioPorId = async (id) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email,rol')
        .eq('id', id)
        .single();
    return { data, error };
};

//Actualizar usuario
export const actualizarUsuario = async (id, campos) => {
    const { data, error } = await supabase
        .from('usuarios')
        .update(campos)
        .eq('id', id)
        .select('id, nombre, email, password, rol')
    return { data, error };
};

//Eliminar usuario
export const eliminarUsuario = async (id) => {
    const { data, error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id)
        .select('id, nombre, email,rol');
    return { data, error };
};

