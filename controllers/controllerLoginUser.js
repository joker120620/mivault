import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const loginUser = async (email, password) => {
    
    // Buscar usuario
    const [rows] = await db.query(
        "SELECT * FROM tbl_users WHERE email_user = ?",
        [email]
    );

    if (!rows.length) {
        return { error: "Usuario no existe" };
    }

    const usuario = rows[0];

    // Comparar contraseña
    const ok = await bcrypt.compare(password, usuario.password_user);

    if (!ok) {
        return { error: "Datos Incorrectos" };
    }

    // Crear token temporal
    const token = jwt.sign(
        {
            id_user: usuario.id_user,   // ← AHORA SÍ
            email_user: usuario.email_user
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
    return { token, usuario };

}