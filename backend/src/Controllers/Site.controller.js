import { pool } from '../config/db.js';

export const getSites = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                sites.id_site, 
                sites.name, 
                sites.num_tag 
            FROM 
                sites
            ORDER BY 
                id_site ASC;
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las ubicaciones:', error);
        res.status(500).json({ error: 'Error al obtener las ubicaciones' });
    }
};

export const getSite = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                sites.id_site, 
                sites.name, 
                sites.num_tag 
            FROM 
                sites
            WHERE 
                id_site = ?;
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ubicación no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la ubicación:', error);
        res.status(500).json({ error: 'Error al obtener la ubicación' });
    }
};

export const createSite = async (req, res) => {
    try {
        const { name, num_tag } = req.body;

        const [rows] = await pool.query(`
            INSERT INTO sites (name, num_tag) 
            VALUES (?, ?);
        `, [name, num_tag]);

        res.status(201).json({
            id: rows.insertId,
            name,
            num_tag,
            message: 'Ubicación creada exitosamente'
        });
    } catch (error) {
        console.error('Error al crear la ubicación:', error);
        res.status(500).json({ error: 'Error al crear la ubicación' });
    }
};

export const updateSite = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, num_tag } = req.body;

        const [rows] = await pool.query(`
            UPDATE sites 
            SET 
                name = IFNULL(?, name), 
                num_tag = IFNULL(?, num_tag) 
            WHERE id_site = ?;
        `, [name, num_tag, id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: 'Ubicación no encontrada' });
        }

        res.json({ message: 'Ubicación actualizada exitosamente', site: rows[0] });
    } catch (error) {
        console.error('Error al actualizar la ubicación:', error);
        res.status(500).json({ error: 'Error al actualizar la ubicación' });
    }
};

export const deleteSite = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(`
            DELETE FROM sites 
            WHERE id_site = ?;
        `, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: 'Ubicación no encontrada' });
        }

        res.json({ message: 'Ubicación eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la ubicación:', error);
        res.status(500).json({ error: 'Error al eliminar la ubicación' });
    }
};