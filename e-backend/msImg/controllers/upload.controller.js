const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const getConnection = require("../../db/db.js");

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const createStorage = (folderPath) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const fullPath = path.join(__dirname, "public", "img", folderPath);
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
        cb(null, true);  // Accept file
    } else {
        cb(new Error("Tipo de archivo no permitido"), false);
    }
};

const createUploadMiddleware = (folderPath) => {
    return multer({
        storage: createStorage(folderPath),
        limits: {
            fileSize: parseInt(process.env.MAX_FILE_SIZE),
            files: parseInt(process.env.MAX_FILES)
        },
        fileFilter: fileFilter
    }).array("image", parseInt(process.env.MAX_FILES));
};

const uploadImage = (folderPath) => (req, res) => {
    const upload = createUploadMiddleware(folderPath);

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ message: 'Error en la carga de las imágenes: ' + err.message });
        } else if (err) {
            return res.status(400).send({ message: 'Error al subir las imágenes: ' + err.message });
        }

        res.status(201).send({
            message: 'Imágenes subidas correctamente',
            data: req.files
        });
    });
};

const uploadImageP = uploadImage("product");
const uploadImageC = uploadImage("client");
const uploadImageA = uploadImage("admin");

module.exports = { uploadImage, uploadImageP, uploadImageC, uploadImageA };
