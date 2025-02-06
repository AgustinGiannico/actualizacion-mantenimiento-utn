import { pool } from '../config/db.js';

export const getFloors = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                floors.id_floor, 
                floors.name, 
                floors.num_tag, 
                availables.description AS "available"
            FROM 
                floors 
            JOIN 
                availables ON floors.id_available = availables.id_available
            ORDER BY 
                id_floor ASC;
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los pisos:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const getFloor = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT 
                floors.id_floor, 
                floors.name, 
                floors.num_tag, 
                availables.description AS "available"
            FROM 
                floors 
            JOIN 
                availables ON floors.id_available = availables.id_available
            WHERE 
                id_floor = ?;
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Piso no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el piso:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const createFloor = async (req, res) => {
    const { name, num_tag } = req.body;
    const id_available = 1;

    try {
        const [rows] = await pool.query(`
            INSERT INTO floors (name, num_tag, id_available) 
            VALUES (?, ?, ?);
        `, [name, num_tag, id_available]);

        res.status(201).json({
            id: rows.insertId,
            name,
            num_tag,
            id_available
        });
    } catch (error) {
        console.error('Error al crear el piso:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const updateFloor = async (req, res) => {
    const { id } = req.params;
    const { name, num_tag, id_available } = req.body;

    try {
        const [rows] = await pool.query(`
            UPDATE floors 
            SET 
                name = IFNULL(?, name),
                num_tag = IFNULL(?, num_tag),
                id_available = IFNULL(?, id_available)
            WHERE id_floor = ?;
        `, [
            name,
            num_tag,
            id_available,
            id
        ]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Piso no encontrado' });
        }

        res.status(200).json({ message: 'Piso actualizada exitosamente', floor: rows[0] });
    } catch (error) {
        console.error('Error al actualizar el piso:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const deleteFloor = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            DELETE FROM floors 
            WHERE id_floor = ?;
        `, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Piso no encontrado' });
        }

        res.status(200).json({ message: 'Piso eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el piso:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};