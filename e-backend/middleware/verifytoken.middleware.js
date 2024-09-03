const getConnection = require('../db/db.js');
const controller = {};

controller.verifyToken = async (req, res, next) => {
      const { id, auth_token } = req.headers;

      let connec;
        try {
            conn = await getConnection();

            if (!id || !auth_token) {
                return res.status(400).send( {message: 'El usuario y el token son requeridos'});
            }

            const query = `SELECT * FROM user WHERE id = ? AND auth_token = ?`;
            const result = await conn.query(query, [id, auth_token]);

            if (result.length === 0) {
                const query = `SELECT * FROM user WHERE id = ?`;
                const result = await conn.query(query, [id]);
                if (result.length === 0) {
                    return res.status(404).send({message: 'Usuario no encontrado'});
                }
                return res.status(401).send({message: 'Token inválido'});
            }

            const date = new Date();
                const tokenExpirationDate = new Date(result[0].auth_token_expired);
                if (date > tokenExpirationDate) {
                    return res.status(403).send({ message: 'El token ha expirado' });
                }
            next();

        }catch (error) {
            console.log(error);
            return res.status(500).send('Error en la conexión a la base de datos');
        } finally {
            if (conn) {
                conn.end();
            }
        }

};

module.exports = controller;