import { pool } from '../config/db.js';

export const getTasks = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                tasks.id_task, 
                tasks.description 
            FROM 
                tasks
            ORDER BY id_task ASC;
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas', error: error.message });
    }
};

export const getTask = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT 
                id_task, 
                description 
            FROM 
                tasks 
            WHERE 
                id_task = ?;
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la tarea', error: error.message });
    }
};

export const createTask = async (req, res) => {
    const { description } = req.body;

    try {
        const [rows] = await pool.query(`
            INSERT INTO tasks (description) 
            VALUES (?);
        `, [description]);

        res.status(201).json({
            id: rows.insertId,
            description
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
    }
};

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;

    try {
        const [rows] = await pool.query(`
            UPDATE tasks 
            SET 
                description = IFNULL(?, description) 
            WHERE id_task = ?;
        `, [description, id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.json({ message: 'Tarea actualizada exitosamente', task: rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`DELETE FROM tasks WHERE id_task = ?`, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea', error: error.message });
    }
};