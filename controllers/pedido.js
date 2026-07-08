import { CrearPedido, obtenerPedidoConDetalles, obtenerPedidosPorUsuario, actualizarEstadoPedido, crearDetallePedido } from "../models/pedidomodel";
import { enviarConfirmacionPedido } from "../utils/sendEmail.js";
import { obtenerUsuarioPorId as obtenerUsuarios } from "../models/usuarios.js";

export const crearPedidoConDetalles = async (req, res) => {
    try {
        const { usuario_id, direccion_entrega, telefono, notas, detalles } = req.body;

        if (!usuario_id || !detalles || detalles.length === 0) {
            return res.status(400).json({ error: "Datos incompletos." });
        }

        //Calcular el total del pedido
        const { data: pedido, error: errorPedido } = await CrearPedido({
            usuario_id,
            direccion_entrega,
            telefono,
            notas,
            total
        });

        if (errorPedido || !pedido) {
            return res.status(500).json({ error: "Error al crear el pedido." });
        }

// Crear los detalles del pedido
        const detallesData = detalles.map(detalle => ({
            pedido_id: pedido[0].id,
            helado_id: detalle.helado_id,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            subtotal: detalle.subtotal
        }));

//Obtener info del usuario para el correo
        const { data: usuario } = await obtenerUsuarios(usuario_id);

//Enviar correo de confirmacion
        if (usuario && usuario.email) {
            await enviarConfirmacionPedido(
                usuario.email, 
                usuario.nombre, 
                pedido[0].id, 
                pedido[0].total);
        }

        return res.status(201).json({ 
            mensaje: "Pedido creado con éxito.", 
            pedido: pedido[0] 
        });

    } catch (error) {
        console.error("Error al crear el pedido:", error);
        return res.status(500).json({ error: "Error al crear el pedido." });
    }
};

export const obtenerPedidoUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await obtenerPedidosConDetalles(id);

        if (error || !data) 
            return res.status(404).json({ error: "Pedido no encontrado." });
            return res.status(200).json( data );
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener el pedido." });
        }  
    };

export const misPedidos = async (req, res) => {
  try {
    const { usuario_id } = req.query;

    if (!usuario_id) {
      return res.status(400).json({ error: 'usuario_id requerido' });
    }

    const { data, error } = await obtenerPedidosPorUsuario(usuario_id);

    if (error) {
      return res.status(500).json({ error: 'Error al obtener pedidos' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

