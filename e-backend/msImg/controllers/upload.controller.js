/** @format */

const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const getConnection = require("../../db/db.js");
const { log } = require("console");

const app = express();

const createStorage = (folderPath) => {
	return multer.diskStorage({
		destination: (req, file, cb) => {
			const fullPath = path.join(__dirname, "../public", "img", folderPath);
			fs.mkdirSync(fullPath, { recursive: true });
			cb(null, fullPath);
		},
		filename: (req, file, cb) => {
			cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
		},
	});
};

const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/tiff"];

	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true); // Accept file
	} else {
		cb(new Error("File type not allowed"), false);
	}
};

const createUploadMiddleware = (folderPath) => {
	return multer({
		storage: createStorage(folderPath),
		limits: {
			fileSize: parseInt(process.env.MAX_FILE_SIZE),
			files: parseInt(process.env.MAX_FILES),
		},
		fileFilter: fileFilter,
	}).array("image", parseInt(process.env.MAX_FILES));
};

const uploadImage = (folderPath) => async (req, res) => {
	const upload = createUploadMiddleware(folderPath);

	upload(req, res, async function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(400).send({ message: "Error uploading images: " + err.message });
		} else if (err) {
			return res.status(400).send({ message: "Error uploading images: " + err.message });
		}

		if (folderPath === "products") {
			saveImageProduct(req, res);
		} else if (folderPath === "profiles") {
			saveImageClient(req, res);
		} else if (folderPath === "settings") {
			saveImageAdmin(req, res);
		}
	});
};

const saveImageProduct = async (req, res) => {
	let conn;
	try {
		conn = await getConnection();
		const paths = req.files.map((file) => {
			return path.join("img", "products", file.filename);
		});
		const insertImagesProduct = "INSERT INTO product_image (image_path, FK_Product, created_at) VALUES (?,?,?)";

		for (const imagePath of paths) {
			const result = await conn.query(insertImagesProduct, [imagePath, req.body.productId, new Date()]);
		}
		res.status(201).send({
			message: "Images uploaded successfully",
			data: paths,
		});
	} catch (e) {
		console.log(e);
		res.status(500).send({ message: "Internal server error" });
	} finally {
		if (conn) {
			conn.end();
		}
	}
};

const saveImageClient = async (req, res) => {
	let conn;
	try {
		conn = await getConnection();
		const paths = req.files.map((file) => {
			return path.join("img", "profiles", file.filename);
		});
		const oldPath = "SELECT image_profile FROM user_information WHERE FK_user = ?";
		const oldPathResult = await conn.query(oldPath, [req.body.userId]);

		//Delete old image
		if (oldPathResult.length > 0 && oldPathResult[0].image_profile !== "") {
			console.log("entro al if");
			fs.unlinkSync(path.join(__dirname, "../public", "img", oldPathResult[0].image_profile));
		}

		//Save new image
		const insertImagesClient = "UPDATE user_information SET image_profile = ? WHERE FK_user = ?";
		await conn.query(insertImagesClient, [paths[0], req.body.userId]);
		res.status(201).send({
			message: "Image uploaded successfully",
			data: paths[0],
		});
	} catch (e) {
		console.log(e);
		res.status(500).send({ message: "Internal server error" });
	} finally {
		if (conn) {
			conn.end();
		}
	}
};

const saveImageAdmin = async (req, res) => {
   let conn;
   try{
        conn = await getConnection();
        const paths = req.files.map((file) => {
            return path.join("img", "settings", file.filename);
        });

        // get keyName from body
        const keyName = req.body.keyName;

        //Save logo
        const insertImagesAdmin = "UPDATE company_settings SET key_value = ? WHERE key_name = ?";
        await conn.query(insertImagesAdmin, [paths[0], keyName]);
        res.status(201).send({
            message: 'Image uploaded successfully',
            data: paths[0]
        });
    
   }catch(e){
        console.log(e);
        res.status(500).send({message: 'Internal server error'});
   }finally{
       if (conn){
           conn.end();
       }
   }
}
 
const getCompanyLogo = async (req, res) => {
	let conn;
	try {
		conn = await getConnection();
		const getLogo = "SELECT key_value FROM company_settings WHERE key_name = 'company_img'";
		const logo = await conn.query(getLogo);
		if (logo.length > 0) {
			res.status(200).send({ data: logo[0].key_value });
		} else {
			res.status(404).send({ message: "Company logo not found" });
		}
	} catch (e) {
		console.log(e);
		res.status(500).send({ message: "Internal server error" });
	} finally {
		if (conn) {
			conn.end();
		}
	}
};

const deleteImage = async (req, res) => {
	let conn;
	try {
		const {id} = req.params;

		if(!id){
			res.status(500).send({ message: "No se encontro el id" }); 
		}

		conn = await getConnection();

		const queryImage = `SELECT image_path FROM product_image WHERE id = ?`;
		const result = await conn.query(queryImage, id);

		const {image_path} = result[0];

		const fullPath = path.join(__dirname, '../public',image_path);

		if(fs.existsSync(fullPath)){
			
			const deleteQuery = `DELETE FROM product_image WHERE id = ?`
			const resultDelete = await conn.query(deleteQuery, id);
			
			fs.unlinkSync(fullPath);
			res.status(200).send({ message: 'Imagen eliminada de la base de datos'});
		} else {
			res.status(400).send({ message: 'La imagen no existe en el servidor'});
		}
				
	} catch (e) {
		console.log(e);
		res.status(500).send({ message: "Internal server error" });
	} finally {
		if (conn) {
			conn.end();
		}
	}
};


const uploadImageP = uploadImage("products");
const uploadImageC = uploadImage("profiles");
const uploadImageA = uploadImage("settings");

module.exports = { uploadImage, uploadImageP, uploadImageC, uploadImageA, getCompanyLogo, deleteImage };
