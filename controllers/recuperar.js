import { codigoRecuperacion, marcarComoUsado, obtenerCodigoValido } from "../models/recuperar.js";
import { obtenerPorEmail, actualizarUsuario } from "../models/usuarios.js";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

//Configuramos el transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//Configurar la logica para enviar el correo de recuperacion
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'El correo es requerido' });
        }
        
        //Verificar si el usuario existe
        const { data: usuario, error: errorUsuario } = await obtenerPorEmail(email);
        if (errorUsuario || !usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        //Generar un codigo de recuperacion
        const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // Codigo de 6 digitos

        //Guardar el codigo en la base de datos
        const {error:errorCodigo}= await codigoRecuperacion(usuario.id, codigo);

        if(errorCodigo){
            return res.status(500).json({ error: 'Error al generar el código de recuperación' });
        }

        //Creamos el email del codigo
        await transporter.sendMail ({
            from: process.env.EMAIL_USER,
            to: email,
            subject:`Tu código de recuperación es: ${codigo}`,
            html: `
            <h2>Recuperación de Contraseña</h2>
            <p>Hola ${usuario.nombre || 'Usuario'},</p>
            <p> Tu codigo de recuperacion es:<p>
            <h1 style="color: #39a900; font-size: 36px;">${codigo}</h1>
            <p> Este codigo es valido por 15 minutos. Si no solicitaste este codigo, por favor ignora este correo</p>
            <p>Gracias</p>
            <p>El equipo de soporte</p>
            <p>No compartas este codigo con nadie</p>
            `
        })
        return res.status(200).json({ message: 'Código de recuperación enviado al correo' });

    }catch (error) {
        console.error('Error en forgotPassword:', error);
        return res.status(500).json({ error: 'Error al enviar el correo de recuperación' });
    }
}

//Cambiar contraseña y verificar el codigo de recuperacion

export const verifyCode = async (req, res) => {
    try {
        const { email, codigo, nuevaPassword } = req.body;

        //Verificamos las entradas
        if (!email || !codigo || !nuevaPassword) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        //Verificar si el usuario esta en la base de datos
        const { data: usuario } = await obtenerPorEmail(email);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        //Verificar si el codigo es valido
        const { data: codigoValido } = await obtenerCodigoValido(usuario.id, codigo);
        if (!codigoValido) {
            return res.status(400).json({ error: 'Código de recuperación inválido o expirado' });
        }
        //Encriptamos la nueva contraseña
        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
        //Actualizamos la contraseña del usuario en la base de datos
        const { error: updateError } = await actualizarUsuario(
            usuario.id, { password: hashedPassword }
        )
        if (updateError) throw updateError;
        //Marcamos el codigo como usado
        await marcarComoUsado(codigoValido.id);
        //Respondemos al cliente que la contraseña se cambio exitosamente
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Contraseña cambiada exitosamente',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
            <h2 style="color: #333;">Notificación de Cambio de Contraseña</h2>
            <p>Hola ${usuario.nombre || 'Usuario'},</p>
            <p> Te informamor que tu contraseña ha sido cambiada exitosamente.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #398439; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #555;">Si no realizaste este cambio, te recomendamos que contactes a nuestro equipo de soporte inmediatamente.</p>
            </div>
            <p style="color: #555; font-size: 14px; margin-top: 30px;">Gracias</p>
            <p>El equipo de soporte</p>
            </div>
            `
        });
        return res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return res.status(500).json({ error: 'Error al verificar el codigo o cambiar la contraseña' });
    }

    }
