import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

export const registerUser = async (req, res) => {
    const {username, last_name, email, password, admin} = req.body;
    const id_available = 1;
    
    try {
        const [existingUser] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [rows] = await pool.query(`
            INSERT INTO users (username, last_name, email, password, id_available, admin) 
            VALUES (?, ?, ?, ?, ?, ?);
            `, [
                username, 
                last_name, 
                email, 
                hashedPassword, 
                id_available,
                admin
            ]);

        res.status(201).json({
            id: rows.insertId,
            username,
            last_name,
            email,
            id_available,
            admin,
            message: 'Usuario creado exitosamente'
        });
    } catch (error) {
        console.error('Error al registrar usuario: ' + error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
}