import { pool } from '../config/db.js';

export const getLocations = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                locations.id_location, 
                locations.name, 
                locations.postal_code, 
                provinces.name AS "province" 
            FROM 
                locations 
            JOIN 
                provinces ON locations.id_province = provinces.id_province
            ORDER BY 
                id_location;
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las localidades:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const getLocation = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT 
                locations.id_location, 
                locations.name, 
                locations.postal_code, 
                provinces.name AS "province" 
            FROM 
                locations 
            JOIN 
                provinces ON locations.id_province = provinces.id_province
            WHERE 
                id_location = ?;
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Localidad no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la localidad:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
