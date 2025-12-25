import fs from "fs";
import path from "path";
import { db } from "../config/db.js";

export async function uploadPhoto(req, userId) {
    try {
        const uploadsPath = path.join(process.cwd(), "uploads");

        // Crear la carpeta uploads si no existe
        if (!fs.existsSync(uploadsPath)) {
            fs.mkdirSync(uploadsPath);
        }

        // Nuevo nombre único
        const newFileName = Date.now() + "-" + req.file.originalname;
        const filePath = path.join(uploadsPath, newFileName);

        // Guardar archivo físicamente
        fs.writeFileSync(filePath, req.file.buffer);

        // Ruta que se guarda en BD 
        const dbPath = `/uploads/${newFileName}`;

        // Guardar solo la ruta en la base de datos
        const [result] = await db.query(`
            INSERT INTO tbl_images (
                user_id_image,
                file_name_image,
                mime_type_image,
                file_size_image,
                file_path_image,
                status_image
            ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
            userId,
            req.file.originalname,
            req.file.mimetype,
            req.file.size,
            dbPath,
            req.body.privacy
        ]);

        return {
            ok: true,
            msg: "upload true",
            id_image: result.insertId,
            url: dbPath
        };

    } catch (error) {
        console.error(error);
        return {
            ok: false,
            msg: "Error subiendo la foto"
        };
    }
}