import nodemailer from 'nodemailer';

const trasporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const enviarConfirmacionPedido = async (email, nombreUsuario, pedidoId, total) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '✅ Pedido Confirmado - Heladeria Mimos 🍦 ${pedidoId}',
        html: `
            <h1>¡Gracias por tu pedido, ${nombreUsuario}!</h1>
            <p>Tu pedido con ID <strong>${pedidoId}</strong> ha sido confirmado.</p>
            <p>Numero de Pedido: <strong>${pedidoId}</strong></p>
            <p>Total: <strong>$${total}</strong></p>
            <p>Pronto nos comunicaremos contigo con los detalles de entrega</p>
            <p>Saludos,</p>
            <p>El equipo de Heladeria Mimos</p>
        `      
    };

    try {
        await trasporter.sendMail(mailOptions);
        return { success: true, message: 'Correo de confirmación enviado correctamente.' };
    } catch (error) {
        console.error('Error al enviar el correo de confirmación:', error);
        return { success: false, message: error.message };
    }
};