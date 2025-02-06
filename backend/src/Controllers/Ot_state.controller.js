import { pool } from '../config/db.js';

export const getOtStates = async (req, res) => {
    try{
        const [rows] = await pool.query(`
            SELECT
                ot_states.id_ot_state,
                ot_states.description
            FROM
                ot_states
            ORDER BY
                id_ot_state ASC;
        `);
        res.json(rows)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los estados de la orden de trabajo' });
    }
}

export const getOtState = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                ot_states.id_ot_state,
                ot_states.description
            FROM
                ot_states
            WHERE 
                ot_states.id_ot_state = ?;
        `, [req.params.id]);

        if (rows.length === 0) return res.status(404).json({ message: 'Estado de orden de trabajo no encontrado' });

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el estado de la orden de trabajo' });
    }
};
