import { db } from "../config/db.js";
export async function getFilesId(id, type) {
    try {
        let query = "";

        switch (type) {
            case "image":
                query = `
                    SELECT i.*, 
                           u.name_user AS owner_name,
                           u.email_user AS owner_email
                    FROM tbl_images i
                    JOIN tbl_users u ON i.user_id_image = u.id_user
                    WHERE i.status_image = 'public'
                      AND i.id_image = ?
                    ORDER BY i.created_at_image DESC
                    LIMIT 100
                `;
                break;

            case "video":
                query = `
                    SELECT v.*, 
                           u.name_user AS owner_name,
                           u.email_user AS owner_email
                    FROM tbl_videos v
                    JOIN tbl_users u ON v.user_id_video = u.id_user
                    WHERE v.status_video = 'public'
                      AND v.user_id_video = ?
                    ORDER BY v.created_at_video DESC
                    LIMIT 10
                `;
                break;

            case "document":
                query = `
                    SELECT d.*, 
                           u.name_user AS owner_name,
                           u.email_user AS owner_email
                    FROM tbl_documents d
                    JOIN tbl_users u ON d.user_id_document = u.id_user
                    WHERE d.status_document = 'public'
                      AND d.user_id_document = ?
                    ORDER BY d.created_at_document DESC
                    LIMIT 5
                `;
                break;

            default:
                return { ok: false, msg: "Tipo de archivo no válido" };
        }

        const [rows] = await db.query(query, [id]);
        console.log(id)

        return {
            ok: true,
            data: rows
        };

    } catch (error) {
        console.error(error);
        return { ok: false, msg: "Error en servidor" };
    }
}