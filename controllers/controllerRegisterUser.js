import { db } from "../config/db.js";
import bcrypt from "bcrypt";
function generarUsername() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let rand = "";
  for (let i = 0; i < 8; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return "user" + rand;
}

// funcion para encriptar contraseña
async function hashearPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function addNewUser (email, password) {
  // usuario existente
    const [existingUser] = await db.query("SELECT * FROM tbl_users WHERE email_user = ?", [email]);
    if(existingUser.length > 0) {
        throw new Error("Usuario ya existe");
    }
    const username = generarUsername();
    const hashedPassword = await hashearPassword(password);
     const [rows] = await db.query("INSERT INTO tbl_users (name_user, email_user, password_user) VALUES (?, ?, ?)", [username, email, hashedPassword]);
     if(!rows || rows.affectedRows === 0) {
        throw new Error("Error al insertar el nuevo usuario en la base de datos");
    }
    return rows.insertId;
}