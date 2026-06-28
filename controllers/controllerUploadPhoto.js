import fs from "fs";
import path from "path";
import sharp from "sharp";
import { db } from "../config/db.js";

export async function uploadPhoto(req, userId) {
    try {
        const uploadsPath = path.join(process.cwd(), "uploads");
        const uploadsPathTumbs = path.join(process.cwd(), "uploads/thumbnails")

        // Si por alguna razón borramos la carpeta uploads, la volvemos a crear para que no explote
        if (!fs.existsSync(uploadsPath)) {
            fs.mkdirSync(uploadsPath);
        }
        if (!fs.existsSync(uploadsPathTumbs)) {
            fs.mkdirSync(uploadsPathTumbs);
        }

        // Le meto un timestamp para que no haya choques si suben dos archivos que se llamen igual
        const timestamp = Date.now();
        const cleanName = req.file.originalname.replace(/\s+/g, '_'); // limpio espacios por si acaso
        
        const newFileName = `${timestamp}-${cleanName}`;
        const thumbFileName = `thumb-${timestamp}.webp`; // la pasamos a webp para que cargue rapidísimo

        const filePath = path.join(uploadsPath, newFileName);
        const thumbFilePath = path.join(uploadsPathTumbs, thumbFileName);

        // Guardo la imagen original cruda en el server
        fs.writeFileSync(filePath, req.file.buffer);

        // Magia negra con sharp para sacar la miniatura. 320px es más que suficiente acá.
        await sharp(req.file.buffer)
            .resize({ 
                width: 320, 
                height: 320, 
                fit: 'inside', 
                withoutEnlargement: true // para no pixelar imágenes que ya vengan enanas
            })
            .webp({ quality: 80 }) // 80 de calidad se ve bien y no pesa nada
            .toFile(thumbFilePath);

        const dbPath = `/uploads/${newFileName}`;
        const thumbDbPath = `/uploads/thumbnails/${thumbFileName}`;

        // Metemos los datos a la DB. Falta agregar la columna del thumbnail después.
        const [result] = await db.query(`
            INSERT INTO tbl_images (
                user_id_image,
                file_name_image,
                mime_type_image,
                file_size_image,
                file_path_image,
                file_path_thumbnail,
                status_image
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            userId,
            req.file.originalname,
            req.file.mimetype,
            req.file.size,
            dbPath,
            thumbDbPath, 
            req.body.privacy
        ]);

        return {
            ok: true,
            msg: "upload true",
            id_image: result.insertId,
            url: dbPath,
            url_thumbnail: thumbDbPath
        };

    } catch (error) {
        // Falló algo feo procesando la imagen
        console.error(error);
        return {
            ok: false,
            msg: "Error subiendo la foto"
        };
    }
}