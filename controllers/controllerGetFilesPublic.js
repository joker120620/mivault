import { db } from "../config/db.js";
export async function  getFilesPublic (){
    try {
          const [images] = await db.query(`
        SELECT * FROM tbl_images 
        WHERE status_image = 'public'
        ORDER BY created_at_image DESC
        LIMIT 100
    `);

    const [videos] = await db.query(`
        SELECT * FROM tbl_videos 
        WHERE status_video = 'public'
        ORDER BY created_at_video DESC
        LIMIT 10
    `);

    const [documents] = await db.query(`
        SELECT * FROM tbl_documents 
        WHERE status_document = 'public'
        ORDER BY created_at_document DESC
        LIMIT 5
    `);
        const data = {
            ok: true,
            images,
            videos,
            documents
        }
        return data;

    } catch (error) {
        console.error(error);
        return "error"
    }
}