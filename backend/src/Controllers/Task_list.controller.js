import { pool } from '../config/db.js';

export const getTaskLists = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                task_lists.id_task_list,
                asset_types.name AS "asset_type_name",
                task_types.name AS "task_type_name",
                tasks_step_1.description AS "step_1",
                tasks_step_2.description AS "step_2",
                tasks_step_3.description AS "step_3",
                tasks_step_4.description AS "step_4",
                tasks_step_5.description AS "step_5",
                tasks_step_6.description AS "step_6",
                tasks_step_7.description AS "step_7",
                tasks_step_8.description AS "step_8",
                tasks_step_9.description AS "step_9",
                tasks_step_10.description AS "step_10"
            FROM 
                task_lists 
            JOIN 
                asset_types ON task_lists.id_asset_type = asset_types.id_asset_type 
            JOIN 
                task_types ON task_lists.id_task_type = task_types.id_task_type 
            JOIN 
                tasks AS tasks_step_1 ON task_lists.step_1 = tasks_step_1.id_task
            JOIN 
                tasks AS tasks_step_2 ON task_lists.step_2 = tasks_step_2.id_task
            JOIN 
                tasks AS tasks_step_3 ON task_lists.step_3 = tasks_step_3.id_task
            JOIN 
                tasks AS tasks_step_4 ON task_lists.step_4 = tasks_step_4.id_task
            JOIN 
                tasks AS tasks_step_5 ON task_lists.step_5 = tasks_step_5.id_task
            JOIN 
                tasks AS tasks_step_6 ON task_lists.step_6 = tasks_step_6.id_task
            JOIN 
                tasks AS tasks_step_7 ON task_lists.step_7 = tasks_step_7.id_task
            JOIN 
                tasks AS tasks_step_8 ON task_lists.step_8 = tasks_step_8.id_task
            JOIN 
                tasks AS tasks_step_9 ON task_lists.step_9 = tasks_step_9.id_task
            JOIN 
                tasks AS tasks_step_10 ON task_lists.step_10 = tasks_step_10.id_task
            ORDER BY 
                task_lists.id_task_list ASC;
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener listas de tareas', error: error.message });
    }
};

export const getTaskList = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT 
                task_lists.id_task_list,
                asset_types.name AS "asset_type_name",
                task_types.name AS "task_type_name",
                tasks_step_1.description AS "step_1",
                tasks_step_2.description AS "step_2",
                tasks_step_3.description AS "step_3",
                tasks_step_4.description AS "step_4",
                tasks_step_5.description AS "step_5",
                tasks_step_6.description AS "step_6",
                tasks_step_7.description AS "step_7",
                tasks_step_8.description AS "step_8",
                tasks_step_9.description AS "step_9",
                tasks_step_10.description AS "step_10"
            FROM 
                task_lists 
            JOIN 
                asset_types ON task_lists.id_asset_type = asset_types.id_asset_type 
            JOIN 
                task_types ON task_lists.id_task_type = task_types.id_task_type 
            JOIN 
                tasks AS tasks_step_1 ON task_lists.step_1 = tasks_step_1.id_task
            JOIN 
                tasks AS tasks_step_2 ON task_lists.step_2 = tasks_step_2.id_task
            JOIN 
                tasks AS tasks_step_3 ON task_lists.step_3 = tasks_step_3.id_task
            JOIN 
                tasks AS tasks_step_4 ON task_lists.step_4 = tasks_step_4.id_task
            JOIN 
                tasks AS tasks_step_5 ON task_lists.step_5 = tasks_step_5.id_task
            JOIN 
                tasks AS tasks_step_6 ON task_lists.step_6 = tasks_step_6.id_task
            JOIN 
                tasks AS tasks_step_7 ON task_lists.step_7 = tasks_step_7.id_task
            JOIN 
                tasks AS tasks_step_8 ON task_lists.step_8 = tasks_step_8.id_task
            JOIN 
                tasks AS tasks_step_9 ON task_lists.step_9 = tasks_step_9.id_task
            JOIN 
                tasks AS tasks_step_10 ON task_lists.step_10 = tasks_step_10.id_task
            WHERE
                id_task_list = ?;
        `, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Lista de tareas no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de tareas', error: error.message });
    }
};

export const getFilterTaskList = async (req, res) => {
    const { asset_type, task_type } = req.body;

    if (!asset_type || !task_type) {
        return res.status(400).json({ error: 'Datos insuficientes' });
    }

    try {
        const [rows] = await pool.query(`
            SELECT 
                task_lists.id_task_list,
                asset_types.name AS "asset_type_name",
                task_types.name AS "task_type_name",
                tasks_step_1.description AS "step_1",
                tasks_step_2.description AS "step_2",
                tasks_step_3.description AS "step_3",
                tasks_step_4.description AS "step_4",
                tasks_step_5.description AS "step_5",
                tasks_step_6.description AS "step_6",
                tasks_step_7.description AS "step_7",
                tasks_step_8.description AS "step_8",
                tasks_step_9.description AS "step_9",
                tasks_step_10.description AS "step_10"
            FROM 
                task_lists 
            JOIN 
                asset_types ON task_lists.id_asset_type = asset_types.id_asset_type 
            JOIN 
                task_types ON task_lists.id_task_type = task_types.id_task_type 
            JOIN 
                tasks AS tasks_step_1 ON task_lists.step_1 = tasks_step_1.id_task
            JOIN 
                tasks AS tasks_step_2 ON task_lists.step_2 = tasks_step_2.id_task
            JOIN 
                tasks AS tasks_step_3 ON task_lists.step_3 = tasks_step_3.id_task
            JOIN 
                tasks AS tasks_step_4 ON task_lists.step_4 = tasks_step_4.id_task
            JOIN 
                tasks AS tasks_step_5 ON task_lists.step_5 = tasks_step_5.id_task
            JOIN 
                tasks AS tasks_step_6 ON task_lists.step_6 = tasks_step_6.id_task
            JOIN 
                tasks AS tasks_step_7 ON task_lists.step_7 = tasks_step_7.id_task
            JOIN 
                tasks AS tasks_step_8 ON task_lists.step_8 = tasks_step_8.id_task
            JOIN 
                tasks AS tasks_step_9 ON task_lists.step_9 = tasks_step_9.id_task
            JOIN 
                tasks AS tasks_step_10 ON task_lists.step_10 = tasks_step_10.id_task
            WHERE 
                asset_types.id_asset_type = ? AND task_types.id_task_type = ?
        `, [asset_type, task_type]);
        
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
}

export const createTaskList = async (req, res) => {
    const { id_asset_type, id_task_type, step_1, step_2, step_3, step_4, step_5, step_6, step_7, step_8, step_9, step_10 } = req.body;
    console.log('Datos recibidos:', req.body);

    try {
        const [rows] = await pool.query(`
            INSERT INTO task_lists(id_asset_type, id_task_type, step_1, step_2, step_3, step_4, step_5, step_6, step_7, step_8, step_9, step_10)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, [
            id_asset_type,
            id_task_type,
            step_1,
            step_2,
            step_3,
            step_4,
            step_5,
            step_6,
            step_7,
            step_8,
            step_9,
            step_10
        ]);

        res.status(201).json({ 
            id: rows.insertId,
            id_asset_type,
            id_task_type,
            step_1,
            step_2,
            step_3,
            step_4,
            step_5,
            step_6,
            step_7,
            step_8,
            step_9,
            step_10
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la lista de tareas', error: error.message });
    }
};

export const updateTaskList = async (req, res) => {
    const { id } = req.params;
    const { id_asset_type, id_task_type, step_1, step_2, step_3, step_4, step_5, step_6, step_7, step_8, step_9, step_10 } = req.body;

    try {
        const [rows] = await pool.query(`
            UPDATE task_lists 
            SET 
                id_asset_type = IFNULL(?, id_asset_type), 
                id_task_type = IFNULL(?, id_task_type), 
                step_1 = IFNULL(?, step_1), 
                step_2 = IFNULL(?, step_2), 
                step_3 = IFNULL(?, step_3), 
                step_4 = IFNULL(?, step_4), 
                step_5 = IFNULL(?, step_5), 
                step_6 = IFNULL(?, step_6), 
                step_7 = IFNULL(?, step_7), 
                step_8 = IFNULL(?, step_8), 
                step_9 = IFNULL(?, step_9), 
                step_10 = IFNULL(?, step_10)
            WHERE id_task_list = ?;
        `, [
            id_asset_type,
            id_task_type,
            step_1,
            step_2,
            step_3,
            step_4,
            step_5,
            step_6,
            step_7,
            step_8,
            step_9,
            step_10,
            id
        ]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Lista de tareas no encontrada' });
        }

        res.json({ message: 'Lista de tareas actualizada exitosamente', task_list: rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la lista de tareas', error: error.message });
    }
};

export const deleteTaskList = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`DELETE FROM task_lists WHERE id_task_list = ?`, [id]);
        
        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Lista de tareas no encontrada' });
        }

        res.json({ message: 'Lista de tareas eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la lista de tareas', error: error.message });
    }
};