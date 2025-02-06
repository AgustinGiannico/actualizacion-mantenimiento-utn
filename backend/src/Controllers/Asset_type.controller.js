import { pool } from '../config/db.js';

export const getAssetTypes = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                asset_types.id_asset_type, 
                asset_types.name, 
                asset_types.reference, 
                asset_types.num_tag, 
                availables.description AS "available"
            FROM 
                asset_types 
            JOIN 
                availables ON asset_types.id_available = availables.id_available
            ORDER BY 
                id_asset_type ASC;
        `);
        console.log('Datos obtenidos de la base de datos:', rows);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los tipos de activos:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const getAssetType = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                asset_types.id_asset_type, 
                asset_types.name, 
                asset_types.reference, 
                asset_types.num_tag, 
                availables.description AS "available"
            FROM 
                asset_types 
            JOIN 
                availables ON asset_types.id_available = availables.id_available
            WHERE 
                asset_types.id_asset_type = ?;
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Tipo de activo no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el tipo de activo:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const createAssetType = async (req, res) => {
    const { name, reference, num_tag } = req.body;
    const id_available = 1;

    try {
        const [rows] = await pool.query(`
            INSERT INTO asset_types (name, reference, num_tag, id_available) 
            VALUES (?, ?, ?, ?);
        `, [
            name, 
            reference, 
            num_tag, 
            id_available
        ]);

        res.status(201).json({
            id: rows.insertId,
            name,
            reference,
            num_tag,
            id_available
        });
    } catch (error) {
        console.error('Error al crear el tipo de activo:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const updateAssetType = async (req, res) => {
    const { id } = req.params;
    const { name, reference, num_tag, id_available } = req.body;

    try {
        const [rows] = await pool.query(`
            UPDATE asset_types
            SET 
                name = IFNULL(?, name),
                reference = IFNULL(?, reference),
                num_tag = IFNULL(?, num_tag),
                id_available = IFNULL(?, id_available)
            WHERE id_asset_type = ?;
        `, [
            name,
            reference,
            num_tag,
            id_available,
            id
        ]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo de activo no encontrado' });
        }

        res.status(200).json({ message: 'Tipo de activo actualizado exitosamente', asset_type: rows[0] });
    } catch (error) {
        console.error('Error al actualizar el tipo de activo:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const deleteAssetType = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            DELETE FROM asset_types WHERE id_asset_type = ?;
        `, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo de activo no encontrado' });
        }

        res.status(200).json({ message: 'Tipo de activo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el tipo de activo:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};