const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, '../public')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/tiff"];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);  // Acepta la imagen
    } else {
        cb(new Error("Tipo de archivo no permitido"), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE),
        files: parseInt(process.env.MAX_FILES)
    },
    fileFilter: fileFilter
}).array("image", parseInt(process.env.MAX_FILES));

exports.uploadImage = (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Un error de Multer ocurrió durante la carga
            return res.status(400).send({ message: 'Error en la carga de las imágenes: ' + err.message });
        } else if (err) {
            // Un error desconocido ocurrió
            return res.status(400).send({ message: 'Error al subir las imágenes: ' + err.message });
        }

        // Si todo salió bien
        res.status(201).send({
            message: 'Imágenes subidas correctamente',
            data: req.files
        });
    });
};