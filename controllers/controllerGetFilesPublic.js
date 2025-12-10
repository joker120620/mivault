import { db } from "../config/db.js";
export async function getFilesPublic() {
    try {

        // IMÁGENES
        const [images] = await db.query(`
            SELECT i.*, 
                   u.name_user AS owner_name,
                   u.email_user AS owner_email
            FROM tbl_images i
            JOIN tbl_users u ON i.user_id_image = u.id_user
            WHERE i.status_image = 'public'
            ORDER BY i.created_at_image DESC
            LIMIT 100
        `);

        // VIDEOS
        const [videos] = await db.query(`
            SELECT v.*, 
                   u.name_user AS owner_name,
                   u.email_user AS owner_email
            FROM tbl_videos v
            JOIN tbl_users u ON v.user_id_video = u.id_user
            WHERE v.status_video = 'public'
            ORDER BY v.created_at_video DESC
            LIMIT 10
        `);

        // DOCUMENTOS
        const [documents] = await db.query(`
            SELECT d.*, 
                   u.name_user AS owner_name,
                   u.email_user AS owner_email
            FROM tbl_documents d
            JOIN tbl_users u ON d.user_id_document = u.id_user
            WHERE d.status_document = 'public'
            ORDER BY d.created_at_document DESC
            LIMIT 5
        `);

        return {
            ok: true,
            images,
            videos,
            documents
        };

    } catch (error) {
        console.error(error);
        return { ok: false, msg: "Error en servidor" };
    }
}