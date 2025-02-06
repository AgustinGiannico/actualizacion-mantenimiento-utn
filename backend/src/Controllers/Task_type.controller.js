import { pool } from '../config/db.js';

export const getTaskTypes = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                task_types.id_task_type, 
                task_types.name, 
                task_types.code 
            FROM 
                task_types
            ORDER BY id_task_type ASC;
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tipos de tareas', error: error.message });
    }
};

export const getTaskType = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT 
                id_task_type, 
                name, 
                code 
            FROM 
                task_types 
            WHERE 
                id_task_type = ?;
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Tipo de tarea no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el tipo de tarea', error: error.message });
    }
};

export const createTaskType = async (req, res) => {
    const { name, code } = req.body;

    try {
        const [rows] = await pool.query(`
            INSERT INTO task_types (name, code) 
            VALUES (?, ?);
        `, [
            name, 
            code
        ]);

        res.status(201).json({
            id: rows.insertId,
            name,
            code
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el tipo de tarea', error: error.message });
    }
};

export const updateTaskType = async (req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;

    try {
        const [rows] = await pool.query(`
            UPDATE task_types 
            SET 
                name = IFNULL(?, name), 
                code = IFNULL(?, code) 
            WHERE id_task_type = ?;
        `, [name, code, id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo de tarea no encontrado' });
        }

        res.json({ message: 'Tipo de tarea actualizado exitosamente', task_type: rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el tipo de tarea', error: error.message });
    }
};

export const deleteTaskType = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`DELETE FROM task_types WHERE id_task_type = ?`, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo de tarea no encontrado' });
        }

        res.json({ message: 'Tipo de tarea eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el tipo de tarea', error: error.message });
    }
};