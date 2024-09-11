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

		const dateNow = new Date();
		let expiredAt = new Date(dateNow.setHours(dateNow.getHours() + 1));
		expiredAt = expiredAt.toISOString().slice(0, 19).replace("T", " ");

		const queryInsertToken = `INSERT INTO email_verification (email, token, isVerification, expired_at) VALUES (?, ?, ?, ?);`;
		await connection.query(queryInsertToken, [email, tokenGenerated, 1, expiredAt]);

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
			subject: "Verificación de Correo Electrónico",
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
				</div>`,
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
			connection.release();
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
			if (resultToken[0].isVerification === 0) {
				res.status(400).send({ message: "Token inválido" });
			}

			const queryUpdateUser = `UPDATE user SET isVerified = 1 WHERE email = ?;`;
			await connection.query(queryUpdateUser, [email]);

			const queryDeleteToken = `DELETE FROM email_verification WHERE email = ?;`;
			await connection.query(queryDeleteToken, [email]);

			res.status(200).send({ message: "Correo verificado correctamente" });
		}

		if (connection) {
			connection.release();
		}
	} catch (error) {
		res.status(500).send({ message: "Error al verificar el correo" });
	}
};

emailController.sendRecoveryPasswordEmail = async (req, res) => {
	let connection;

	let { email, isObject } = req.body;
	const tokenGenerated = uuidv4();
	const website = "http://localhost:4200/reset-password";

	try {
		connection = await getConnection();

		const queryUser = `SELECT email FROM user WHERE email = ? OR username = ?;`;
		const resultUser = await connection.query(queryUser, [email, email]);

		if (resultUser.length === 0) {
			return res.status(400).send({ message: "El usuario no existe." });
		} else {
			email = resultUser[0].email;
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

		const dateNow = new Date();
		let expiredAt = new Date(dateNow.setHours(dateNow.getHours() + 1));
		expiredAt = expiredAt.toISOString().slice(0, 19).replace("T", " ");

		const queryInsertToken = `INSERT INTO email_verification (email, token, isResetPassword, expired_at) VALUES (?, ?, ?, ?);`;
		await connection.query(queryInsertToken, [email, tokenGenerated, 1, expiredAt]);

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: dataCompany.email,
				pass: dataCompany.email_password,
			},
		});

		const mailOptions = {
			from: "noreply@gmail.com",
			to: email,
			subject: "Recuperación de Contraseña",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
				<h2 style="text-align: center; color: #333;">Recuperación de Contraseña</h2>
				<p style="color: #555; font-size: 16px;">Hemos recibido una solicitud para recuperar tu contraseña. Haz clic en el botón de abajo para cambiar tu contraseña.</p>
				
				<div style="text-align: center; margin: 30px 0;">
					<a href="${website}/${tokenGenerated}/${email}" 
					style="display: inline-block; padding: 15px 25px; font-size: 18px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
					Recuperar Contraseña
					</a>
				</div>
			
				<p style="color: #555; font-size: 14px;">Si no solicitaste este correo, simplemente ignóralo.</p>
			
				<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
				
				<div style="text-align: center;">
					<img src="https://i.ibb.co/8mc8BTF/Logo-Company.webp" alt="Logo de la empresa" style="max-width: 100px; margin-bottom: 10px;">
				</div>
				
				<p style="color: #999; font-size: 12px; text-align: center;">&copy; 2024 ${dataCompany.company_name}. Todos los derechos reservados.</p>
				</div>`,
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
			connection.release();
		}

		return { message: "Correo enviado" };
	} catch (error) {
		console.log(error);
		if (isObject) {
			return { message: error };
		} else {
			res.status(500).send({ message: "Error al conectar con la base de datos" });
		}
	}
};

emailController.validateEmailUser = async (req, res) => {
	let connection;

	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).send({ message: "Faltan campos" });
		}

		connection = await getConnection();

		const queryUser = `SELECT email FROM user WHERE email = ?;`;
		const resultUser = await connection.query(queryUser, [email]);

		if (resultUser.length === 0) {
			return res.status(400).send({ success: false, message: "El usuario no existe." });
		}

		if (connection) {
			connection.release();
		}

		return res.status(200).send({ success: true, message: "Usuario encontrado" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Error al conectar con la base de datos" });
	}
};

module.exports = emailController;
