const getConnection = require("../../db/db.js");

const settingsController = {};

settingsController.getSettings = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const { name } = req.params;
                
        const queryMoney = `
            SELECT c.* FROM company_settings c
            inner join tab t on t.id = c.FK_tab
            where t.name = ? AND c.is_Available = 1
            `;

        const result = await connection.query(queryMoney, [name]);

        if (connection) {
            connection.release();
        }

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener las configuraciones.", error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

settingsController.updateSettings = async (req, res) => {

    let connection;
    try {
        connection = await getConnection();
        await connection.beginTransaction();
        req.body.forEach(async (element) => {
            const {name, value } = element;
            const query = `
                UPDATE company_settings
                SET key_value = ?
                WHERE key_name = ?;
            `;
            await connection.query(query, [value, name]);
        });
        await connection.commit();

        if (connection) {
            connection.release();
        }

        res.status(200).send({ message: "Configuración actualizada correctamente." });
    } catch (error) {
        res.status(500).send({ message: "Error al actualizar la configuración.", error: error.message });
        connection.rollback();
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

settingsController.getTabs = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
                
        const queryMoney = `
            SELECT * FROM tab
            where isActive = 1
            `;

        const result = await connection.query(queryMoney);

        if (connection) {
            connection.release();
        }
        
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener las pestañas.", error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = settingsController;