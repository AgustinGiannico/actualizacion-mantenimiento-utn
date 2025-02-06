import { pool } from '../config/db.js';

export const getSectors = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                sectors.id_sector, 
                sectors.name, 
                sectors.num_tag, 
                availables.description AS "available"
            FROM 
                sectors 
            JOIN 
                availables ON sectors.id_available = availables.id_available
            ORDER BY 
                id_sector ASC;
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener sectores:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const getSector = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT 
                id_sector, 
                name, 
                num_tag, 
                id_available 
            FROM 
                sectors 
            WHERE 
                id_sector = ?;
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Sector no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener sector:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const createSector = async (req, res) => {
    const { name, num_tag } = req.body;
    const id_available = 1;

    try {
        const [rows] = await pool.query(`
            INSERT INTO sectors (name, num_tag, id_available) 
            VALUES (?, ?, ?);
        `, [name, num_tag, id_available]);

        res.status(201).json({
            id: rows.insertId,
            name,
            num_tag,
            id_available
        });
    } catch (error) {
        console.error('Error al crear sector:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const updateSector = async (req, res) => {
    const { id } = req.params;
    const { name, num_tag, id_available } = req.body;

    try {
        const [rows] = await pool.query(`
            UPDATE sectors 
            SET 
                name = IFNULL(?, name),
                num_tag = IFNULL(?, num_tag),
                id_available = IFNULL(?, id_available)
            WHERE id_sector = ?;
        `, [name, num_tag, id_available, id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Sector no encontrado' });
        }

        res.json({ message: 'Sector actualizado exitosamente', sector: rows[0] });
    } catch (error) {
        console.error('Error al actualizar sector:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const deleteSector = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            DELETE FROM sectors 
            WHERE id_sector = ?;
        `, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Sector no encontrado' });
        }

        res.json({ message: 'Sector eliminado' });
    } catch (error) {
        console.error('Error al eliminar sector:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};