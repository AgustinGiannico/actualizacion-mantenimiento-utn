import { pool } from '../config/db.js';

export const getAvailables = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                availables.id_available, 
                availables.description, 
                availables.state 
            FROM 
                availables;
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las disponibilidades:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const getAvailable = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                id_available, 
                description, 
                state 
            FROM 
                availables 
            WHERE 
                id_available = ?;
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Disponibilidad no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la disponibilidad:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
