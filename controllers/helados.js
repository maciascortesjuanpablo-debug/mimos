import { obtenerHelados, obtenerPorId, obtenerPorCategoria, crearHelado, actualizarHelado, eliminarHelado } from "../models/helados.js";

export const listarHelados = async (req, res) => {
    try {
        const { data, error } = await obtenerHelados();
        if (error) {
            return res.status(500).json({ error: 'Error al obtener los helados' });
        }
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerHelado = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await obtenerPorId(id);
        if (error || !data) {
            return res.status(404).json({ error: 'Helado no encontrado' });
        }
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerPorCat = async (req, res) => {
    try {
        const { categoria } = req.params;
        const { data, error } = await obtenerPorCategoria(categoria);
        if (error) {
            return res.status(500).json({ error: 'Error' });
        }
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearNuevoHelado = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, imagen_url,categoria, sabor } = req.body;
        if (!nombre || !precio || !imagen_url) {
            return res.status(400).json({ error: 'nombre, precio e imagen_url son requeridos' });
        }
        const { data, error } = await crearHelado({ 
            nombre, descripcion, precio, stock, imagen_url,categoria, sabor 
        });
        if (error) {
            return res.status(500).json({ error: 'Error al crear el helado' });
        }
        return res.status(201).json({ message: 'Helado creado exitosamente', helado: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editar = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await actualizarHelado(id, req.body);
        if (error) 
            return res.status(500).json({ error: 'Error al actualizar el helado' });
        return res.status(200).json({ message: 'Helado actualizado exitosamente', helado: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await eliminarHelado(id);
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar el helado' });
        }
        return res.status(200).json({ message: 'Helado eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
