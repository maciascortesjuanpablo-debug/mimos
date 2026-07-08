import {supabase} from "../config/supabase.js";

//Obtener todos los helados
export const obtenerHelados = async () => {
    const { data, error } = await supabase
    .from('helados')
    .select('*');
    return { data, error };
};

//Obtener por ID
export const obtenerPorId = async (id) => {
    const { data, error } = await supabase
    .from('helados')
    .select('*')
    .eq('id', id)
    .single();
    return { data, error };
};

//Obtener por categoria
export const obtenerPorCategoria = async (categoria) => {
    const { data, error } = await supabase
    .from('helados')
    .select('*')
    .eq('categoria', categoria);
    return { data, error };
};

//Crear helado
export const crearHelado = async (heladoData) => {
    const { data, error } = await supabase
    .from('helados')
    .insert(heladoData)
    .select();
    return { data, error };
};

//Actualizar helado
export const actualizarHelado = async (id, heladoData) => {
    const { data, error } = await supabase
    .from('helados')
    .update(heladoData)
    .eq('id', id)
    .select();
    return { data, error };
};

//Eliminar helado
export const eliminarHelado = async (id) => {
    const { data, error } = await supabase
    .from('helados')
    .delete()
    .eq('id', id)
    .select();
    return { data, error };
};
