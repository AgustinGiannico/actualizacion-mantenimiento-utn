import { pool } from '../config/db.js';

export const getOts = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                ots.id_ot, 
                ots.order_number, 
                ots.request_date, 
                ots.initial_date,
                ots.completion_date, 
                ots.completion_time, 
                ots.observations, 
                priorities.description AS "priority",
                users.username, 
                tags.final_tag, 
                tags.asset_number, 
                ot_states.description AS "ot_state",
                edifices.name AS "edifice", 
                edifices.street, 
                edifices.number, 
                floors.name AS "floor", 
                sectors.name AS "sector",
                sites.name AS "site", 
                asset_types.name AS "asset_type", 
                task_types.name AS "task_type", 
                task_types.code AS "code_task_type", 
                CONCAT(
                    tasks_step_1.description, ', ',
                    tasks_step_2.description, ', ',
                    tasks_step_3.description, ', ',
                    tasks_step_4.description, ', ',
                    tasks_step_5.description, ', ',
                    tasks_step_6.description, ', ',
                    tasks_step_7.description, ', ',
                    tasks_step_8.description, ', ',
                    tasks_step_9.description, ', ',
                    tasks_step_10.description
                ) AS "task_list_steps"
                FROM 
                    ots
                JOIN 
                    priorities ON ots.id_priority = priorities.id_priority
                JOIN 
                    users ON ots.id_user = users.id_user
                JOIN 
                    tags ON ots.id_tag = tags.id_tag
                JOIN 
                    ot_states ON ots.id_ot_state = ot_states.id_ot_state
                JOIN 
                    edifices ON tags.id_edifice = edifices.id_edifice
                JOIN 
                    floors ON tags.id_floor = floors.id_floor
                JOIN 
                    sectors ON tags.id_sector = sectors.id_sector
                JOIN
                    sites ON tags.id_site = sites.id_site
                LEFT JOIN 
                    task_lists ON ots.id_task_list = task_lists.id_task_list
                LEFT JOIN 
                    asset_types ON tags.id_asset_type = asset_types.id_asset_type
                LEFT JOIN 
                    task_types ON task_lists.id_task_type = task_types.id_task_type 
                LEFT JOIN 
                    tasks AS tasks_step_1 ON task_lists.step_1 = tasks_step_1.id_task
                LEFT JOIN 
                    tasks AS tasks_step_2 ON task_lists.step_2 = tasks_step_2.id_task
                LEFT JOIN 
                    tasks AS tasks_step_3 ON task_lists.step_3 = tasks_step_3.id_task
                LEFT JOIN 
                    tasks AS tasks_step_4 ON task_lists.step_4 = tasks_step_4.id_task
                LEFT JOIN 
                    tasks AS tasks_step_5 ON task_lists.step_5 = tasks_step_5.id_task
                LEFT JOIN 
                    tasks AS tasks_step_6 ON task_lists.step_6 = tasks_step_6.id_task
                LEFT JOIN 
                    tasks AS tasks_step_7 ON task_lists.step_7 = tasks_step_7.id_task
                LEFT JOIN 
                    tasks AS tasks_step_8 ON task_lists.step_8 = tasks_step_8.id_task
                LEFT JOIN 
                    tasks AS tasks_step_9 ON task_lists.step_9 = tasks_step_9.id_task
                LEFT JOIN 
                    tasks AS tasks_step_10 ON task_lists.step_10 = tasks_step_10.id_task
                ORDER BY 
                    ot_state, priority ASC;
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las OTs:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const getOt = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT 
                ots.id_ot, 
                ots.order_number, 
                ots.request_date, 
                ots.initial_date,
                ots.completion_date, 
                ots.completion_time, 
                ots.observations, 
                priorities.description AS "priority",
                users.username, 
                tags.final_tag, 
                tags.asset_number,
                ot_states.description AS "ot_state", 
                edifices.name AS "edifice", 
                edifices.street, 
                edifices.number, 
                floors.name AS "floor", 
                sectors.name AS "sector",
                sites.name AS "site", 
                asset_types.name AS "asset_type", 
                task_types.name AS "task_type", 
                task_types.code AS "code_task_type", 
                CONCAT(
                    tasks_step_1.description, ', ',
                    tasks_step_2.description, ', ',
                    tasks_step_3.description, ', ',
                    tasks_step_4.description, ', ',
                    tasks_step_5.description, ', ',
                    tasks_step_6.description, ', ',
                    tasks_step_7.description, ', ',
                    tasks_step_8.description, ', ',
                    tasks_step_9.description, ', ',
                    tasks_step_10.description
                ) AS "task_list_steps"
            FROM 
                ots
            JOIN
                priorities ON ots.id_priority = priorities.id_priority
            JOIN 
                users ON ots.id_user = users.id_user
            JOIN 
                tags ON ots.id_tag = tags.id_tag
            JOIN
                ot_states ON ots.id_ot_state = ot_states.id_ot_state
            JOIN 
                edifices ON tags.id_edifice = edifices.id_edifice
            JOIN 
                floors ON tags.id_floor = floors.id_floor
            JOIN 
                sectors ON tags.id_sector = sectors.id_sector
            JOIN
                sites ON tags.id_site = sites.id_site
            JOIN 
                task_lists ON ots.id_task_list = task_lists.id_task_list
            LEFT JOIN 
                asset_types ON tags.id_asset_type = asset_types.id_asset_type
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
                id_ot = ?;
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'OT no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la OT:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const createOt = async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body);
    const { request_date, observations, id_user, id_tag, id_task_list, id_priority, id_task_type } = req.body;
    const id_ot_state = 6;

    try {
        const [orderNumberConcat] = await pool.query(`
            SELECT CONCAT(
                REPLACE(?, '-', ''), 
                " _ ",
                (SELECT code FROM task_types WHERE id_task_type = ?),
                " _ ",
                (SELECT final_tag FROM tags WHERE id_tag = ?)
            ) AS order_number;
        `, [
            request_date,
            id_task_type, 
            id_tag
        ]);

        const order_number = orderNumberConcat[0].order_number;

        const [rows] = await pool.query(`
            INSERT INTO ots (order_number, request_date, observations, id_user, id_tag, id_task_list, id_priority, id_ot_state) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `, [
            order_number,
            request_date,
            observations,
            id_user,
            id_tag,
            id_task_list || null,
            id_priority,
            id_ot_state
        ]);

        res.status(201).json({
            id: rows.insertId,
            order_number,
            request_date,
            observations,
            id_user,
            id_tag,
            id_task_list,
            id_priority,
            id_ot_state
        });
    } catch (error) {
        console.error('Error al crear la OT:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};


export const updateOt = async (req, res) => {
    const { id } = req.params;
    const { request_date, initial_date, completion_date, completion_time, observations, id_user, id_tag, id_task_list, id_priority, id_ot_state } = req.body;

    try {
        const [rows] = await pool.query(`
            UPDATE ots 
            SET 
                request_date = IFNULL(?, request_date),
                initial_date = IFNULL(?, initial_date),
                completion_date = IFNULL(?, completion_date),
                completion_time = IFNULL(?, completion_time),
                observations = IFNULL(?, observations),
                id_user = IFNULL(?, id_user),
                id_tag = IFNULL(?, id_tag),
                id_task_list = IFNULL(?, id_task_list),
                id_priority = IFNULL(?, id_priority),
                id_ot_state = IFNULL(?, id_ot_state)
            WHERE 
                id_ot = ?;
        `, [request_date, initial_date, completion_date, completion_time, observations, id_user, id_tag, id_task_list, id_priority, id_ot_state, id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'OT no encontrada' });
        }

        res.json({ message: 'Orden de trabajo actualizada exitosamente', ot: rows[0] });
    } catch (error) {
        console.error('Error al actualizar la OT:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const deleteOt = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            DELETE FROM ots 
            WHERE id_ot = ?;
        `, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'OT no encontrada' });
        }

        res.json({ message: 'OT eliminada' });
    } catch (error) {
        console.error('Error al eliminar la OT:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};