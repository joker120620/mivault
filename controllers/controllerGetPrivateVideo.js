import { db } from "../config/db.js";
export async function getVideoPrivate(id) {
    try {

        // 
        const [videos] = await db.query(`
            SELECT i.*, 
                   u.name_user AS owner_name,
                   u.email_user AS owner_email
            FROM tbl_videos i
            JOIN tbl_users u ON i.user_id_video = u.id_user
            WHERE  i.user_id_video = ?
            ORDER BY i.created_at_video DESC
            LIMIT 100
        `, [id]);

        return {
            ok: true,
            videos
        };

    } catch (error) {
        console.error(error);
        return { ok: false, msg: "Error en servidor" };
    }
}