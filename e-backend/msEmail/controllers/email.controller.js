/** @format */

const getConnection = require("../../db/db.js");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const pbkdf2 = require("pbkdf2");

const emailController = {};

emailController.sendVerificationEmail = async (req, res) => {
	let connection;

	let { email, isObject, isLogin } = req.body;
	let tokenGenerated = uuidv4();
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

		const queryDataCompany = `SELECT key_name, key_value FROM company_settings WHERE key_name IN ('company_name', 'company_state', 'company_address', 'company_img', 'email', 'email_password', 'password_salt');`;
		const resultDataCompany = await connection.query(queryDataCompany);

		if (resultDataCompany.length === 0) {
			return res.status(400).send({ message: "Error al obtener los datos de la empresa." });
		}

		const dataCompany = {};

		resultDataCompany.forEach((element) => {
			dataCompany[element.key_name] = element.key_value;
		});

		tokenGenerated = encryptData(tokenGenerated, dataCompany.password_salt);
		let emailEncrypt = encryptData(email, dataCompany.password_salt);

		const dateNow = new Date();
		let expiredAt = new Date(dateNow.setHours(dateNow.getHours() + 1));
		expiredAt = expiredAt.toISOString().slice(0, 19).replace("T", " ");

		const queryInsertToken = `INSERT INTO email_verification (email_token, email, token, isVerification, expired_at) VALUES (?, ?, ?, ?, ?);`;
		await connection.query(queryInsertToken, [emailEncrypt, email, tokenGenerated, 1, expiredAt]);

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
					<a href="${website}/${tokenGenerated}/${emailEncrypt}" 
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

		if (connection) {
			connection.release();
		}

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
		const queryToken = `SELECT * FROM email_verification WHERE email_token = ? AND token = ?;`;
		const resultToken = await connection.query(queryToken, [email, token]);

		if (resultToken.length === 0) {
			if (connection) {
				connection.release();
			}
			return res.status(400).send({ message: "Token inválido" });
		} else {
			if (resultToken[0].isVerification === 0) {
				res.status(400).send({ message: "Token inválido" });
			}

			const queryUpdateUser = `UPDATE user SET isVerified = 1 WHERE email = ?;`;
			await connection.query(queryUpdateUser, [resultToken[0].email]);

			const queryDeleteToken = `DELETE FROM email_verification WHERE email = ?;`;
			await connection.query(queryDeleteToken, [resultToken[0].email]);

			if (connection) {
				connection.release();
			}

			res.status(200).send({ message: "Correo verificado correctamente" });
		}
	} catch (error) {
		res.status(500).send({ message: "Error al verificar el correo" });
	}
};

emailController.sendRecoveryPasswordEmail = async (req, res) => {
	let connection;

	let { email, isObject } = req.body;
	let tokenGenerated = uuidv4();
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

		const queryDataCompany = `SELECT key_name, key_value FROM company_settings WHERE key_name IN ('company_name', 'company_state', 'company_address', 'company_img', 'email', 'email_password', 'password_salt');`;
		const resultDataCompany = await connection.query(queryDataCompany);

		if (resultDataCompany.length === 0) {
			return res.status(400).send({ message: "Error al obtener los datos de la empresa." });
		}

		const dataCompany = {};

		resultDataCompany.forEach((element) => {
			dataCompany[element.key_name] = element.key_value;
		});

		tokenGenerated = encryptData(tokenGenerated, dataCompany.password_salt);
		let emailEncrypt = encryptData(email, dataCompany.password_salt);

		const dateNow = new Date();
		let expiredAt = new Date(dateNow.setHours(dateNow.getHours() + 1));
		expiredAt = expiredAt.toISOString().slice(0, 19).replace("T", " ");

		const queryInsertToken = `INSERT INTO email_verification (email, token, isResetPassword, expired_at, email_token) VALUES (?, ?, ?, ?, ?);`;
		await connection.query(queryInsertToken, [email, tokenGenerated, 1, expiredAt, emailEncrypt]);

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
					<a href="${website}/${tokenGenerated}/${emailEncrypt}" 
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

		if (connection) {
			connection.release();
		}

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

emailController.send2FAEmail = async (req) => {
	let connection;

	let { id } = req.body;

	try {
		connection = await getConnection();

		const queryDataCompany = `SELECT key_name, key_value FROM company_settings WHERE key_name IN ('company_name', 'company_state', 'company_address', 'company_img', 'email', 'email_password', 'password_salt');`;
		const resultDataCompany = await connection.query(queryDataCompany);

		if (resultDataCompany.length === 0) {
			return false;
		}

		const dataCompany = {};

		resultDataCompany.forEach((element) => {
			dataCompany[element.key_name] = element.key_value;
		});

		const tokenGenerated = uuidv4().slice(0, 6);

		const queryDeleteToken = `DELETE FROM user_2FA WHERE FK_User = ?;`;
		await connection.query(queryDeleteToken, [id]);

		const queryInsertToken = `INSERT INTO user_2FA (secret_key, FK_User) VALUES (?, ?);`;
		await connection.query(queryInsertToken, [tokenGenerated, id]);

		const queryUser = `SELECT email FROM user WHERE id = ?;`;
		const resultUser = await connection.query(queryUser, [id]);

		const email = resultUser[0].email;

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
			subject: "Código de Verificación",
			html: `
					<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
					<div style="text-align: center; padding-bottom: 20px;">
						<img src="https://i.ibb.co/8mc8BTF/Logo-Company.webp" alt="Logo de la empresa" style="max-width: 80px; margin-bottom: 20px;">
					</div>
					<h2 style="text-align: center; color: #333333; font-size: 24px;">Código de Verificación</h2>
					<p style="color: #666666; font-size: 16px; text-align: center;">¡Hola!</p>
					<p style="color: #666666; font-size: 16px; text-align: center;">
						Tu código de verificación es:
					</p>
					<div style="text-align: center; margin: 20px 0;">
						<span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; color: #4CAF50; font-weight: bold; letter-spacing: 3px;">${tokenGenerated}</span>
					</div>
					<p style="color: #666666; font-size: 14px; text-align: center;">Por favor, introduce este código para completar la verificación.</p>
					
					<p style="color: #999999; font-size: 14px; text-align: center; margin-top: 40px;">
						Si no solicitaste este correo, simplemente ignóralo.
					</p>

					<hr style="border: none; border-top: 1px solid #dddddd; margin: 40px 0;">
					
					<p style="color: #999999; font-size: 12px; text-align: center;">&copy; 2024 ${dataCompany.company_name}. Todos los derechos reservados.</p>
					</div>
				`,
		};

		if (connection) {
			connection.release();
		}

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				return false;
			}
		});

		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

function encryptData(data, salt) {
	const encryptedData = pbkdf2.pbkdf2Sync(data, salt, 1, 32, "sha512").toString("hex");
	return encryptedData;
}

emailController.encryptData = async (req, res) => {
	let connection;

	try {
		const { data } = req.body;

		if (!data) {
			return res.status(400).send({ message: "Faltan campos" });
		}

		connection = await getConnection();

		const querySalt = `SELECT * FROM company_settings WHERE key_name = 'password_salt';`;
		const resultSalt = await connection.query(querySalt);
		const salt = resultSalt[0].key_value;

		const encryptedData = pbkdf2.pbkdf2Sync(data, salt, 1, 32, "sha512").toString("hex");
		res.status(200).send({ data: encryptedData });

		if (connection) {
			connection.release();
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Error al conectar con la base de datos" });
	}
};

module.exports = emailController;
