import { pool } from '../config/db.js';

export const getTags = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                tags.id_tag, 
                tags.final_tag, 
                asset_types.reference, 
                edifices.name AS "edifice", 
                floors.name AS "floor", 
                sectors.name AS "sector", 
                sites.name AS "site", 
                asset_types.name AS "asset_type", 
                tags.asset_number 
            FROM 
                tags 
            JOIN 
                asset_types ON tags.id_asset_type = asset_types.id_asset_type
            JOIN 
                edifices ON tags.id_edifice = edifices.id_edifice
            JOIN 
                floors ON tags.id_floor = floors.id_floor
            JOIN 
                sectors ON tags.id_sector = sectors.id_sector
            JOIN 
                sites ON tags.id_site = sites.id_site
            ORDER BY 
                id_tag ASC;
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener tags:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const getTag = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT 
                tags.id_tag, 
                tags.final_tag, 
                asset_types.reference, 
                edifices.name AS "edifice", 
                floors.name AS "floor", 
                sectors.name AS "sector", 
                sites.name AS "site", 
                asset_types.name AS "asset_type", 
                tags.asset_number 
            FROM 
                tags 
            JOIN 
                asset_types ON tags.id_asset_type = asset_types.id_asset_type
            JOIN 
                edifices ON tags.id_edifice = edifices.id_edifice
            JOIN 
                floors ON tags.id_floor = floors.id_floor
            JOIN 
                sectors ON tags.id_sector = sectors.id_sector
            JOIN 
                sites ON tags.id_site = sites.id_site
            WHERE 
                id_tag = ?;
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Tag no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener tag:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const createTag = async (req, res) => {
    const { id_edifice, id_floor, id_sector, id_site, id_asset_type, asset_number } = req.body;

    try {
        const [finalTagConcat] = await pool.query(`
            SELECT CONCAT(
                (SELECT reference FROM asset_types WHERE id_asset_type = ?),
                ' - ',
                (SELECT num_tag FROM edifices WHERE id_edifice = ?),
                (SELECT num_tag FROM floors WHERE id_floor = ?),
                (SELECT num_tag FROM sectors WHERE id_sector = ?),
                (SELECT num_tag FROM asset_types WHERE id_asset_type = ?),
                (SELECT num_tag FROM sites WHERE id_site = ?),
                ' - ',
                ?
            ) AS final_tag;
        `, [
            id_asset_type, 
            id_edifice, 
            id_floor, 
            id_sector, 
            id_asset_type,
            id_site, 
            asset_number
        ]);

        const final_tag = finalTagConcat[0].final_tag;

        const [rows] = await pool.query(`
            INSERT INTO tags (id_edifice, id_floor, id_sector, id_site, id_asset_type, asset_number, final_tag)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `, [
            id_edifice,
            id_floor,
            id_sector,
            id_site,
            id_asset_type,
            asset_number,
            final_tag
        ]);

        res.status(201).json({
            id: rows.insertId,
            id_edifice,
            id_floor,
            id_sector,
            id_site,
            id_asset_type,
            asset_number,
            final_tag
        });
    } catch (error) {
        console.error('Error al crear tag:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const updateTag = async (req, res) => {
    const { id } = req.params;
    const { id_edifice, id_floor, id_sector, id_site, id_asset_type, asset_number } = req.body;

    try {
        const [rows] = await pool.query(`
            UPDATE tags 
            SET 
                id_edifice = IFNULL(?, id_edifice), 
                id_floor = IFNULL(?, id_floor), 
                id_sector = IFNULL(?, id_sector), 
                id_site = IFNULL(?, id_site), 
                id_asset_type = IFNULL(?, id_asset_type), 
                asset_number = IFNULL(?, asset_number) 
            WHERE 
                id_tag = ?;
        `, [id_edifice, id_floor, id_sector, id_site, id_asset_type, asset_number, id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Tag no encontrado' });
        }

        res.json({ message: 'Tag actualizado exitosamente', tag: rows[0] });
    } catch (error) {
        console.error('Error al actualizar tag:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const deleteTag = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            DELETE FROM tags 
            WHERE id_tag = ?;
        `, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Tag no encontrado' });
        }

        res.json({ message: 'Tag eliminado' });
    } catch (error) {
        console.error('Error al eliminar tag:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};