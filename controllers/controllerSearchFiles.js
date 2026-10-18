import { db } from "../config/db.js";
export async function searchFilesInBd(query, page) {
    try {
        //USUARIOS sin la contraseña ni datos privados
        const [users] = await db.query(`
            SELECT id_user, name_user, email_user FROM tbl_users WHERE name_user LIKE ? OR email_user LIKE ?
            ORDER BY created_at_user DESC
            LIMIT 10 OFFSET ?
        `, [`%${query}%`, `%${query}%`, (page - 1) * 10]);  

        // IMÁGENES
        const [images] = await db.query(`
            SELECT i.*, 
                   u.name_user AS owner_name,
                   u.email_user AS owner_email
            FROM tbl_images i
            JOIN tbl_users u ON i.user_id_image = u.id_user
            WHERE i.status_image = 'public' AND (i.file_name_image LIKE ?)
            ORDER BY i.created_at_image DESC
            LIMIT 10 OFFSET ?
        `, [`%${query}%`, (page - 1) * 10]);  

        // VIDEOS
        const [videos] = await db.query(`
            SELECT v.*, 
                   u.name_user AS owner_name,
                   u.email_user AS owner_email
            FROM tbl_videos v
            JOIN tbl_users u ON v.user_id_video = u.id_user
            WHERE v.status_video = 'public' AND (v.file_name_video LIKE ?)
            ORDER BY v.created_at_video DESC
            LIMIT 10 OFFSET ?
        `, [`%${query}%`,  (page - 1) * 10]);  

        // DOCUMENTOS
        const [documents] = await db.query(`
            SELECT d.*, 
                   u.name_user AS owner_name,
                   u.email_user AS owner_email
            FROM tbl_documents d
            JOIN tbl_users u ON d.user_id_document = u.id_user
            WHERE d.status_document = 'public' AND (d.file_name_document LIKE ?)
            ORDER BY d.created_at_document DESC
            LIMIT 10 OFFSET ?
        `, [`%${query}%`, (page - 1) * 10]);

        return {
            ok: true,
            users,
            images,
            videos,
            documents
        };

    } catch (error) {
        console.error(error);
        return { ok: false, msg: "Error en servidor" };
    }
}