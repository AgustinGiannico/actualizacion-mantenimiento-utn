import { pool } from '../config/db.js';

export const getPriorities = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                priorities.id_priority, 
                priorities.description 
            FROM 
                priorities
            ORDER BY 
                id_priority ASC;
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener prioridades:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const getPriority = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT 
                priorities.id_priority, 
                priorities.description 
            FROM 
                priorities 
            WHERE 
                id_priority = ?;
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Prioridad no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener prioridad:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const createPriority = async (req, res) => {
    const { description } = req.body;

    try {
        const [rows] = await pool.query(`
            INSERT INTO priorities (description) 
            VALUES (?);
        `, [description]);

        res.status(201).json({
            id: rows.insertId,
            description
        });
    } catch (error) {
        console.error('Error al crear prioridad:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const updatePriority = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;

    try {
        const [rows] = await pool.query(`
            UPDATE priorities 
            SET 
                description = IFNULL(?, description) 
            WHERE id_priority = ?;
        `, [description, id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Prioridad no encontrada' });
        }

        res.json({ message: 'Prioridad actualizada exitosamente', priority: rows[0] });
    } catch (error) {
        console.error('Error al actualizar prioridad:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const deletePriority = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            DELETE FROM priorities 
            WHERE id_priority = ?;
        `, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Prioridad no encontrada' });
        }

        res.json({ message: 'Prioridad eliminada' });
    } catch (error) {
        console.error('Error al eliminar prioridad:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};