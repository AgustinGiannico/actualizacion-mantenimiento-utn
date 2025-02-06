import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config.js';

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY no está definido en las variables de entorno.');
}

export const authenticateToken = (req, res, next) => {
    const token = req.cookies['jwt'];
    
    if (!token) {
        console.error('Token no proporcionado');
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Token no válido', err);
            return res.status(403).json({ error: 'Token no válido' });
        }

        req.user = user;
        next();
    });
};

export const authenticateAdmin = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user && req.user.admin) {
            next();
        } else {
            res.status(403).json({ error: 'Acceso denegado: se requieren permisos de administrador' });
        }
    });
};