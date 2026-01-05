import { db } from "../config/db.js";

export async function getFilesId(id, type, UserId) {
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
                    WHERE i.id_image = ?
                      AND (
                           i.status_image = 'public'
                           OR i.user_id_image = ?
                      )
                    LIMIT 1
                `;
                break;

            case "video":
                query = `
                    SELECT v.*, 
                           u.name_user AS owner_name,
                           u.email_user AS owner_email
                    FROM tbl_videos v
                    JOIN tbl_users u ON v.user_id_video = u.id_user
                    WHERE v.id_video = ?
                      AND (
                           v.status_video = 'public'
                           OR v.user_id_video = ?
                      )
                    LIMIT 1
                `;
                break;

            case "document":
                query = `
                    SELECT d.*, 
                           u.name_user AS owner_name,
                           u.email_user AS owner_email
                    FROM tbl_documents d
                    JOIN tbl_users u ON d.user_id_document = u.id_user
                    WHERE d.id_document = ?
                      AND (
                           d.status_document = 'public'
                           OR d.user_id_document = ?
                      )
                    LIMIT 1
                `;
                break;

            default:
                return { ok: false, msg: "Tipo de archivo no válido" };
        }

        const [rows] = await db.query(query, [id, UserId]);

        return { ok: true, data: rows };

    } catch (error) {
        console.error(error);
        return { ok: false, msg: "Error en servidor" };
    }
}