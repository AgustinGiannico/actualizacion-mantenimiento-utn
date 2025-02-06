import { pool } from '../config/db.js';

export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                users.id_user, 
                users.username, 
                users.last_name,
                users.email, 
                users.admin,
                availables.description AS "available"
            FROM 
                users 
            JOIN 
                availables ON users.id_available = availables.id_available
            ORDER BY id_user ASC;
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};

export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT 
                users.id_user, 
                users.username, 
                users.last_name, 
                users.email, 
                users.admin,
                availables.description AS "available"
            FROM 
                users 
            JOIN 
                availables ON users.id_available = availables.id_available
            WHERE 
                id_user = ?;
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, last_name, email, password, admin, id_available } = req.body;

    try {
        const [rows] = await pool.query(`
            UPDATE users 
            SET 
                username = IFNULL(?, username), 
                last_name = IFNULL(?, last_name), 
                email = IFNULL(?, email),
                password = IFNULL(?, password), 
                admin = IFNULL(?, admin), 
                id_available = IFNULL(?, id_available) 
            WHERE id_user = ?;
        `, [username, last_name, email, password, admin, id_available, id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`UPDATE users SET id_available = 0 WHERE id_user = ?`, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario desactivado exitosamente' });

    } catch (error) {
        console.error('Error al desactivar usuario:', error);
        res.status(500).json({ message: 'Error al desactivar usuario', error: error.message });
    }
};
