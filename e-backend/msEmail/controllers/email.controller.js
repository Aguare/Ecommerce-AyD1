/** @format */

const getConnection = require("../../db/db.js");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const emailController = {};

emailController.sendVerificationEmail = async (req, res) => {
	let connection;

	let { email, isObject, isLogin } = req.body;
	const tokenGenerated = uuidv4();
	const website = "http://localhost:4200/verify-email";

	try {
		connection = await getConnection();

		if (isLogin) {
			const queryUser = `SELECT email FROM user WHERE email = ? OR username = ?;`;
			const resultUser = await connection.query(queryUser, [email, email]);

			if (resultUser.length === 0) {
				return res.status(400).send({ message: "El usuario no existe." });
			} else {
				email = resultUser[0].email;
			}
		}

		const queryDataCompany = `SELECT key_name, key_value FROM company_settings WHERE key_name IN ('company_name', 'company_state', 'company_address', 'company_img', 'email', 'email_password');`;
		const resultDataCompany = await connection.query(queryDataCompany);

		if (resultDataCompany.length === 0) {
			return res.status(400).send({ message: "Error al obtener los datos de la empresa." });
		}

		const dataCompany = {};

		resultDataCompany.forEach((element) => {
			dataCompany[element.key_name] = element.key_value;
		});

		const queryInsertToken = `INSERT INTO email_verification (email, token) VALUES (?, ?);`;
		await connection.query(queryInsertToken, [email, tokenGenerated]);

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: dataCompany.email,
				pass: dataCompany.email_password,
			},
		});

		const mailOptions = {
			from: "no-reply@gmail.com",
			to: email,
			subject: "Verificación de correo electrónico",
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
          <h2 style="text-align: center; color: #333;">¡Bienvenido a nuestro sitio!</h2>
          <p style="color: #555; font-size: 16px;">Gracias por registrarte. Para completar el proceso, por favor verifica tu correo electrónico haciendo clic en el botón de abajo.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${website}/${tokenGenerated}/${email}" 
               style="display: inline-block; padding: 15px 25px; font-size: 18px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">
               Verificar correo electrónico
            </a>
          </div>
      
          <p style="color: #555; font-size: 14px;">Si no solicitaste este correo, simplemente ignóralo.</p>
      
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <div style="text-align: center;">
            <img src="https://i.ibb.co/8mc8BTF/Logo-Company.webp" alt="Logo de la empresa" style="max-width: 100px; margin-bottom: 10px;">
          </div>
          
          <p style="color: #999; font-size: 12px; text-align: center;">&copy; 2024 ${dataCompany.company_name}. Todos los derechos reservados.</p>
        </div>
      `,
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				res.status(500).send({ message: "Error al enviar el correo" });
			} else {
				if (res) {
					res.status(200).send({ message: "Correo enviado" });
				} else {
					return { message: "Correo enviado" };
				}
			}
		});

		if (connection) {
			connection.end();
		}
	} catch (error) {
		console.log(error);
		if (isObject) {
			return { message: error };
		} else {
			res.status(500).send({ message: "Error al conectar con la base de datos" });
		}
	}
};

emailController.verifyEmail = async (req, res) => {
	let connection;

	const { token, email } = req.body;

	try {
		connection = await getConnection();
	} catch (error) {
		res.status(500).send({ message: "Error al conectar con la base de datos" });
	}

	try {
		const queryToken = `SELECT * FROM email_verification WHERE email = ? AND token = ?;`;
		const resultToken = await connection.query(queryToken, [email, token]);

		if (resultToken.length === 0) {
			return res.status(400).send({ message: "Token inválido" });
		} else {
			const queryUpdateUser = `UPDATE user SET isVerified = 1 WHERE email = ?;`;
			await connection.query(queryUpdateUser, [email]);

			const queryDeleteToken = `DELETE FROM email_verification WHERE email = ?;`;
			await connection.query(queryDeleteToken, [email]);

			res.status(200).send({ message: "Correo verificado correctamente" });
		}

		if (connection) {
			connection.end();
		}
	} catch (error) {
		res.status(500).send({ message: "Error al verificar el correo" });
	}
};

module.exports = emailController;
