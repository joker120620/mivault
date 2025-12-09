export async function uploadPhoto(file, userId) {
    try {
         const {
            originalname,
            mimetype,
            size,
            buffer
        } = file;
        const [result] = await db.query(`
            INSERT INTO tbl_images (
                user_id_image,
                file_name_image,
                mime_type_image,
                file_size_image,
                data_image,
                status_image
            ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
            userId,
            originalname,
            mimetype,
            size,
            buffer,      // binario
            "private"
        ]);

        return {
            ok: true,
            msg: "Foto subida correctamente",
            id_image: result.insertId
        };
        
    } catch (error) {
        return {
            ok: false,
            msg: "Error"
        }
    }
   
}