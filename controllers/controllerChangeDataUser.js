import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const hashearPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const changeDataUser = async (email, newPassword, newNameUser) => {
    try {
        let sql = "";
        let params = [];

        // Solo actualizar Nombre (Contraseña viene vacía/null)
        if (!newPassword && newNameUser) {
            sql = "UPDATE tbl_users SET name_user = ? WHERE email_user = ?";
            params = [newNameUser, email];
        }

        // Solo actualizar Contraseña (Nombre viene vacío/null)
        else if (newPassword && !newNameUser) {
            const hashedPassword = await hashearPassword(newPassword);
            sql = "UPDATE tbl_users SET pass_user = ? WHERE email_user = ?";
            params = [hashedPassword, email];
        }

        // Actualizar Ambos (Ambos traen datos)
        else if (newPassword && newNameUser) {
            const hashedPassword = await hashearPassword(newPassword);
            sql = "UPDATE tbl_users SET name_user = ?, password_user = ? WHERE email_user = ?";
            params = [newNameUser, hashedPassword, email];
        }

        // Caso extra: Si por error llamaron a la función sin mandar nada nuevo
        else {
            return { success: false, error: "NoDataProvided" };
        }

        // Ejecutamos la query correspondiente
        const [result] = await db.query(sql, params);

        // Verificamos si se encontró y modificó el usuario
        if (result.affectedRows > 0) {
            console.log(result)
            return { success: true, message: "Datos actualizados correctamente" };
        } else {
            return { success: false, error: "UserNotFound" };
        }

    } catch (error) {
        console.error("Error en la base de datos:", error);
        return { success: false, error: "dbFail" };
    }
};