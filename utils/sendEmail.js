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
        subject: `✅ Pedido Confirmado - Heladeria Mimos 🍦 ${pedidoId}`,
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="utf-8">
        <title>Confirmación de pedido</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, Helvetica, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:30px 0;">
            <tr>
              <td align="center">
                <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden;">

                  <!-- Encabezado -->
                  <tr>
                    <td style="background-color:#ff7f50; padding:24px; text-align:center;">
                      <h1 style="margin:0; color:#ffffff; font-size:22px;">🍦 Mimos</h1>
                    </td>
                  </tr>

                  <!-- Cuerpo -->
                  <tr>
                    <td style="padding:30px;">
                      <h2 style="margin:0 0 10px; color:#333333; font-size:20px;">¡Gracias por tu pedido, ${nombreUsuario}!</h2>
                      <p style="margin:0 0 20px; color:#555555; font-size:15px; line-height:1.5;">
                        Tu pedido <strong>#${pedidoId}</strong> ha sido confirmado y ya lo estamos preparando.
                      </p>

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eeeeee; border-bottom:1px solid #eeeeee; margin-bottom:20px;">
                        <tr>
                          <td style="padding:10px 0; color:#777777; font-size:14px;">Número de pedido</td>
                          <td style="padding:10px 0; color:#333333; font-size:14px; text-align:right;">#${pedidoId}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0; color:#777777; font-size:14px;">Total</td>
                          <td style="padding:10px 0; color:#ff7f50; font-size:16px; text-align:right;"><strong>$${total.toFixed(2)}</strong></td>
                        </tr>
                      </table>

                      <p style="margin:0 0 20px; color:#555555; font-size:14px; line-height:1.5;">
                        Pronto nos comunicaremos contigo con los detalles de entrega.
                      </p>

                      <p style="margin:0; color:#999999; font-size:13px; text-align:center;">
                        Saludos, el equipo de Heladería Mimos 💛
                      </p>
                    </td>
                  </tr>

                  <!-- Pie -->
                  <tr>
                    <td style="background-color:#fafafa; padding:16px; text-align:center;">
                      <p style="margin:0; color:#aaaaaa; font-size:12px;">Mimos · Este es un correo automático, no responder.</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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