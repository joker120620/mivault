import { db } from "../config/db.js";
export async function getPhotoPrivate(id) {
    try {

        // 
        const [images] = await db.query(`
            SELECT i.*, 
                   u.name_user AS owner_name,
                   u.email_user AS owner_email
            FROM tbl_images i
            JOIN tbl_users u ON i.user_id_image = u.id_user
            WHERE i.status_image = 'private' AND i.user_id_image = ?
            ORDER BY i.created_at_image DESC
            LIMIT 100
        `, [id]);

        return {
            ok: true,
            images
        };

    } catch (error) {
        console.error(error);
        return { ok: false, msg: "Error en servidor" };
    }
}