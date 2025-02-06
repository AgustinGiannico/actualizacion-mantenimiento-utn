import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { pool } from '../config/db.js';
import { SECRET_KEY } from '../config.js';

const app = express();

app.use(cookieParser())

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if(rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ username: user.username, admin: user.admin }, SECRET_KEY, { expiresIn: '1h' });

        res.cookie('jwt', token, {
            maxAge: 1000 * 60 * 60,
            httpOnly: false,     
            secure: false, 
            sameSite: 'Lax', 
        });

        res.status(200).json({ message: 'Inicio de sesión exitoso', isAdmin: user.admin === 1 });

    } catch (error) {
        console.error('Error al procesar el login: ' + error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}