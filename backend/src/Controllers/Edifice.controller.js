import { pool } from '../config/db.js';

export const getEdifices = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                edifices.id_edifice, 
                edifices.name, 
                edifices.num_tag, 
                edifices.street, 
                edifices.number,
                locations.name AS "location",
                provinces.name AS "province",
                availables.description AS "available"
            FROM 
                edifices 
            JOIN 
                locations ON edifices.id_location = locations.id_location 
            JOIN 
                provinces ON locations.id_province = provinces.id_province
            JOIN 
                availables ON edifices.id_available = availables.id_available
            ORDER BY 
                id_edifice ASC;
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener edificios:', error);
        res.status(500).send('Error del servidor');
    }
};

export const getEdifice = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                edifices.id_edifice, 
                edifices.name, 
                edifices.num_tag, 
                edifices.street, 
                edifices.number,
                locations.name AS "location",
                provinces.name AS "province",
                availables.description AS "available"
            FROM 
                edifices 
            JOIN 
                locations ON edifices.id_location = locations.id_location 
            JOIN 
                provinces ON locations.id_province = provinces.id_province
            JOIN 
                availables ON edifices.id_available = availables.id_available
            WHERE 
                edifices.id_edifice = ?;
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Edificio no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el edificio:', error);
        res.status(500).send('Error del servidor');
    }
};

export const createEdifice = async (req, res) => {
    const { name, num_tag, street, number, id_location } = req.body;
    const id_available = 1;

    try {
        const [rows] = await pool.query(`
            INSERT INTO edifices (name, num_tag, street, number, id_location, id_available) 
            VALUES (?, ?, ?, ?, ?, ?);
        `, [
            name, 
            num_tag, 
            street,
            number, 
            id_location,
            id_available
        ]);

        res.status(201).json({
            id: rows.insertId,
            name,
            num_tag,
            street,
            number,
            id_location,
            id_available
        });
    } catch (error) {
        console.error('Error al crear el edificio:', error);
        res.status(500).send('Error del servidor');
    }
};

export const updateEdifice = async (req, res) => {
    const { id } = req.params;
    const { name, num_tag, street, number, id_location, id_available } = req.body;

    try {
        const [rows] = await pool.query(`
            UPDATE edifices 
            SET 
                name = IFNULL(?, name),
                num_tag = IFNULL(?, num_tag),
                street = IFNULL(?, street),
                number = IFNULL(?, number),
                id_location = IFNULL(?, id_location),
                id_available = IFNULL(?, id_available)
            WHERE id_edifice = ?;
        `, [
            name,
            num_tag,
            street,
            number,
            id_location,
            Number(id_available),
            id
        ]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Edificio no encontrado' });
        }

        res.status(200).json({ message: 'Edificio actualizado exitosamente', edifice: rows[0] });
    } catch (error) {
        console.error('Error al actualizar el edificio:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const deleteEdifice = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            DELETE FROM edifices 
            WHERE id_edifice = ?;
        `, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Edificio no encontrado' });
        }

        res.status(200).json({ message: 'Edificio eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el edificio:', error);
        res.status(500).send('Error del servidor');
    }
};