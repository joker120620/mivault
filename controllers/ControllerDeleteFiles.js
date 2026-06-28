import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
export const deleteFiles = async (idFile, idUser, fileType) => {
    try {
        console.log(idFile)
        // Validación: Aseguramos que idFile sea un array
        const ids = Array.isArray(idFile) ? idFile : [idFile];
        
        let sql = "";
        let params = [ids, idUser];
        console.log(params)
        // El primer parámetro será el array, el segundo el usuario

        // Definimos la tabla y columnas según el tipo
        let table, colId, colStatus, colUser;

        if (fileType === "photo") {
            table = "tbl_images"; colId = "id_image"; colStatus = "status_image"; colUser = "user_id_image";
        } else if (fileType === "video") {
            table = "tbl_videos"; colId = "id_video"; colStatus = "status_video"; colUser = "user_id_video";
        } else if (fileType === "document") {
            table = "tbl_documents"; colId = "id_document"; colStatus = "status_document"; colUser = "user_id_document";
        } else {
            return { success: false, error: "InvalidType" };
        }

        // Construimos la query usando IN (?)
        // La librería manejará el array automáticamente si se pasa el array en los params
        sql = `UPDATE ${table} SET ${colStatus} = 'deleted' WHERE ${colId} IN (?) AND ${colUser} = ?`;

        // Ejecutamos
        const [result] = await db.query(sql, params);

        if (result.affectedRows > 0) {
            return { success: true, message: `${result.affectedRows} elementos eliminados correctamente` };
        } else {
            return { success: false, error: "No se encontraron elementos para eliminar" };
        }

    } catch (error) {
        console.error("Error en la base de datos:", error);
        return { success: false, error: "dbFail" };
    }
};