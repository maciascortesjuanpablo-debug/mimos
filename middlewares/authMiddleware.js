import jwt from 'jsonwebtoken';

//Verifica que exista un token valido

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido o expirado' });
        }
        req.user = decoded;
        next();
    });
};

//Solo deja pasar si el usuario es admin
export const verificarAdmin = (req, res, next) => {
    if (req.user?.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. No tienes permiso de administrador.' });
    }
    next();
};