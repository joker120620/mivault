import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { addNewUser } from "../controllers/controllerRegisterUser.js";
import { loginUser } from "../controllers/controllerLoginUser.js";
import { auth } from "../controllers/controllerAuthToken.js";
import { getFilesPublic } from "../controllers/controllerGetFilesPublic.js"
import { uploadPhoto } from "../controllers/controllerUploadPhoto.js";
const router = Router();
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

// Necesario para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta principal: devolver el HTML
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});
router.get("/api/saludo", (req, res) => {
    res.json({ mensaje: "Hola desde rutas con import/export!" });
});
//login 
router.post("/api/login", async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    const response = await loginUser(email, password);
    if(response.error){
        res.status(500).json({ error: response.error });
    } else {
    res.json({
        status: 200,
        token: response.token,
        usuario: {
            id: response.usuario.id,
            email: response.usuario.email
        }
    });
    }
});
///regitrar nuevo usuario
router.post("/api/register", async (req, res) => {
    const { emailNewUser, passNewUser } = req.body;
    console.log("Datos recibidos:", emailNewUser, passNewUser); 
    try {
        if(!emailNewUser || !passNewUser) {
        return res.status(400).json({ mensaje: "Faltan datos de registro." });
    }else{
       const response = await addNewUser(emailNewUser, passNewUser);
         console.log("Nuevo usuario registrado con ID:", response);

    }
    res.status(201).json({ status: 201, mensaje: `Usuario ${emailNewUser} registrado correctamente.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status : 500 , mensaje: "Error al registrar usuario" });
    } 
    
});
////perfil usuario protegido
router.get("/api/perfil", auth, (req, res) => {
    res.json({ ok: true, user: req.user });
});

//mostrar archivos publicos home
router.get("/api/files/public", async (req, res) => {
    let data = await getFilesPublic()
    console.log(data)
    res.json(data)
});
//subir fotos
router.post("/api/files/photo/upload", auth, upload.single("file"), async (req, res) => {
    try {
        console.log(req.user.id_user)
        const userId = req.user.id_user;

        if (!userId) {
            return res.status(401).json({ ok: false, msg: "Usuario no autorizado" });
        }

        if (!req.file) {
            return res.status(400).json({ ok: false, msg: "No se envió ninguna imagen" });
        }

        // Esperar la inserción
        const response = await uploadPhoto(req.file, userId);

        if (response.ok) {
            console.log("subida")
            return res.status(200).json({
                status: 200,
                msg: "Imagen subida correctamente",
                id_image: response.id_image,
                url: response.url
            });
        } else {
            return res.status(500).json({ status: 500, msg: "Error al subir la imagen" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            msg: "Error del servidor",
            error: error.message
        });
    }
}
);
export default router;