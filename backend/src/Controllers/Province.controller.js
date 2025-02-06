import { pool } from '../config/db.js';

export const getProvinces = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                provinces.id_province, 
                provinces.name 
            FROM 
                provinces
            ORDER BY 
                id_province ASC;
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener provincias:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const getProvince = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT 
                provinces.id_province, 
                provinces.name 
            FROM 
                provinces 
            WHERE 
                id_province = ?;
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Provincia no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener provincia:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const createProvince = async (req, res) => {
    const { name } = req.body;

    try {
        const [rows] = await pool.query(`
            INSERT INTO provinces (name) 
            VALUES (?);
        `, [name]);

        res.status(201).json({
            id: rows.insertId,
            name
        });
    } catch (error) {
        console.error('Error al crear provincia:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const updateProvince = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const [rows] = await pool.query(`
            UPDATE provinces 
            SET 
                name = IFNULL(?, name) 
            WHERE id_province = ?;
        `, [name, id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Provincia no encontrada' });
        }

        res.json({ message: 'Provincia actualizada exitosamente', province: rows[0] });
    } catch (error) {
        console.error('Error al actualizar provincia:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const deleteProvince = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            DELETE FROM provinces 
            WHERE id_province = ?;
        `, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Provincia no encontrada' });
        }

        res.json({ message: 'Provincia eliminada' });
    } catch (error) {
        console.error('Error al eliminar provincia:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};