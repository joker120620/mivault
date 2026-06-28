import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";
import { db } from "../config/db.js";

// Seteamos las rutas de ffmpeg para que no moleste en distintos entornos
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

// Función de apoyo para sacar la duración del video sin trabar el hilo principal
function getTimeVideo(Video) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(Video, (err, metadata) => {
            if (err) reject(err);
            else resolve(Math.floor(metadata.format.duration));
        });
    });
}

// Promesa para sacar un frame del video y usarlo de miniatura
function generateThumbnail(videoPath, thumbFolder, thumbName) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .on('end', () => resolve(true))
            .on('error', (err) => reject(err))
            .screenshots({
                timestamps: ['20%'], // Saco la captura al 20% del video para evitar la típica pantalla en negro del inicio
                filename: thumbName,
                folder: thumbFolder,
                size: '320x?' // 320px de ancho y que calcule el alto solo para no deformar la imagen
            });
    });
}

export async function uploadVideo(req, userId) {
    try {
        const uploadsPath = path.join(process.cwd(), "uploads");

        // Por si borramos la carpeta limpiando el proyecto, la creamos de nuevo
        if (!fs.existsSync(uploadsPath)) {
            fs.mkdirSync(uploadsPath);
        }

        // Armo el nombre del archivo. Timestamp para evitar colisiones feísimas si suben el mismo video
        const timestamp = Date.now();
        const cleanName = req.file.originalname.replace(/\s+/g, '_');
        
        const newFileName = `${timestamp}-media-${cleanName}`;
        const thumbFileName = `thumb-${timestamp}.jpg`; // las screenshots de ffmpeg salen en jpg por defecto

        const filePath = path.join(uploadsPath, newFileName);
        
        // Guardo el video pesado físicamente primero
        fs.writeFileSync(filePath, req.file.buffer);

        // Rutas relativas que van a la DB
        const dbPath = `/uploads/${newFileName}`;
        const thumbDbPath = `/uploads/${thumbFileName}`;

        // Saco la duración (re útil para mostrar en el frontend después)
        const duration = await getTimeVideo(filePath);

        // Magia con ffmpeg para sacar la miniatura de una vez
        await generateThumbnail(filePath, uploadsPath, thumbFileName);

        // Clavamos todo en la base de datos
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
            null, // data_video lo dejo nulo porque ya guardamos el archivo físico, meter blobs a la DB es un tiro en el pie para el rendimiento
            thumbDbPath, 
            duration,
            req.body.privacy
        ]);

        return {
            ok: true,
            msg: "Video y miniatura listos",
            id_video: result.insertId, // Ojo que en tu código original decia id_image, ya te lo cambié a id_video
            url: dbPath,
            url_thumbnail: thumbDbPath
        };

    } catch (error) {
        // Si revienta algo con ffmpeg o la DB, cae acá
        console.error("Error feo subiendo el video:", error);
        return {
            ok: false,
            msg: "Error subiendo el video"
        };
    }
}