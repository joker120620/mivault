import fs from "fs";
import path from "path";import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";
import { db } from "../config/db.js";


ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

function getTimeVideo(Video) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(Video, (err, metadata) => {
            if (err) reject(err);
            else resolve(Math.floor(metadata.format.duration));
        });
    });
}
export async function uploadVideo(req, userId) {
    try {
        const uploadsPath = path.join(process.cwd(), "uploads");

        // Crear la carpeta uploads si no existe
        if (!fs.existsSync(uploadsPath)) {
            fs.mkdirSync(uploadsPath);
        }

        // Nuevo nombre único
        const newFileName = Date.now() + "-" + "-media-" + req.file.originalname;
        const filePath = path.join(uploadsPath, newFileName);

        // Guardar archivo físicamente
        fs.writeFileSync(filePath, req.file.buffer);

        // Ruta que se guarda en BD 
        const dbPath = `/uploads/${newFileName}`;
        // Obtener duración del video
        const duration = await getTimeVideo(filePath);

        // Guardar solo la ruta en la base de datos
        const [result] = await db.query(`
            INSERT INTO tbl_videos (
            user_id_video,
            file_name_video,
            mime_type_video,
            file_size_video,
            file_path_video,
            data_video,
            thumbnail_path_video,
            duration_video,
            status_video
                                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
            userId,
            req.file.originalname,
            req.file.mimetype,
            req.file.size,
            dbPath,
            null,                  
            req.body.thumbnail || null,
            duration,
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