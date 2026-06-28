import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { addNewUser } from "../controllers/controllerRegisterUser.js";
import { loginUser } from "../controllers/controllerLoginUser.js";
import { auth } from "../controllers/controllerAuthToken.js";
import { getFilesPublic } from "../controllers/controllerGetFilesPublic.js";
import { getFilesId } from "../controllers/controllerGetFileId.js";
import { getPhotoPrivate } from "../controllers/controllerGetPrivatePhoto.js"
import { getVideoPrivate } from "../controllers/controllerGetPrivateVideo.js";
import { uploadPhoto } from "../controllers/controllerUploadPhoto.js";
import { uploadVideo } from "../controllers/controllerUploadVideo.js";
import { changeDataUser } from "../controllers/controllerChangeDataUser.js";
import { deleteFiles } from '../controllers/ControllerDeleteFiles.js'
import { getTrashUser } from '../controllers/controllerGetTrashUser.js'
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
//login 
router.post("/api/login", async (req, res) => {
    const { email, password } = req.body
    const response = await loginUser(email, password);
    if (response.error) {
        res.status(500).json({ error: response.error });
    } else {
        res.json({
            status: 200,
            token: response.token,
            usuario: {
                id_user: response.usuario.id_user,
                email_user: response.usuario.email_user,
                name_user: response.usuario.name_user
            }
        });
    }
});
///regitrar nuevo usuario
router.post("/api/register", async (req, res) => {
    const { emailNewUser, passNewUser } = req.body;
    console.log("Datos recibidos:", emailNewUser, passNewUser);
    try {
        if (!emailNewUser || !passNewUser) {
            return res.status(400).json({ mensaje: "Faltan datos de registro." });
        } else {
            const response = await addNewUser(emailNewUser, passNewUser);
            console.log("Nuevo usuario registrado con ID:", response);

        }
        res.status(201).json({ status: 201, mensaje: `Usuario ${emailNewUser} registrado correctamente.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, mensaje: "Error al registrar usuario" });
    }

});
////perfil usuario protegido
router.post("/api/perfil/update", auth, async (req, res) => {
    const { emailUser, passUser, newPassUser, newNameUser } = await req.body
    const verifiUserLogin = await loginUser(emailUser, passUser);
    if (!verifiUserLogin.error) {
        let response = await changeDataUser(emailUser, newPassUser, newNameUser)
        if (response.success) {
            res.status(200).json({ success: true, msj: "Datos actualizados" });

        } else {
            res.json({ success: false, error: response.error });
        }
    } else {
        res.json({ success: false, error: "userFail" });
    }
});

//mostrar archivos publicos home
router.get("/api/files/public", async (req, res) => {
    let data = await getFilesPublic()
    res.json(data)
});

//mostrar fotos privadas
router.post("/api/files/photo", auth, async (req, res) => {
    console.log("id user:" + req.user.id_user)
    let data = await getPhotoPrivate(req.user.id_user)
    res.json(data)
});
//mostar videos privados
router.post("/api/files/video", auth, async (req, res) => {
    console.log("id user:" + req.user.id_user)
    let data = await getVideoPrivate(req.user.id_user)
    res.json(data)
});

//mostrar archivos POR ID Y TIPO
router.post("/api/files/getcard/card:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.query;
        const data = await getFilesId(id, type, req.user.id_user);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener archivos públicos" });
    }
});
//subir fotos
router.post("/api/files/photo/upload", auth, upload.single("file"), async (req, res) => {
    try {
        const userId = req.user.id_user;

        if (!userId) {
            return res.status(401).json({ ok: false, msg: "Usuario no autorizado" });
        }

        if (!req.file) {
            return res.status(400).json({ ok: false, msg: "No se envió ninguna imagen" });
        }

        // Esperar la inserción
        const response = await uploadPhoto(req, userId);

        if (response.ok) {
            console.log("subida")
            return res.status(200).json({
                status: 200,
                msg: "Imagen subida correctamente"
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

//subir Videos
router.post("/api/files/video/upload", auth, upload.single("file"), async (req, res) => {
    try {
        const userId = req.user.id_user;

        if (!userId) {
            return res.status(401).json({ ok: false, msg: "Usuario no autorizado" });
        }

        if (!req.file) {
            return res.status(400).json({ ok: false, msg: "No se envió ningún video" });
        }

        // Esperar la inserción
        const response = await uploadVideo(req, userId);

        if (response.ok) {
            console.log("subida")
            return res.status(200).json({
                status: 200,
                msg: "Video subido correctamente"
            });
        } else {
            return res.status(500).json({ status: 500, msg: "Error al subir el video" });
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
///===================================00
//ELIMINAR ARCHIVOS
// ELIMIMAR FOTOS
//mostrar fotos privadas
router.post("/api/files/delfiles", auth, async (req, res) => {
    console.log("usuario queriendo eliminar archivos " + req.user.id_user)
    const {idFile , fileType } = req.body 
    let response = await deleteFiles(idFile , req.user.id_user, fileType)
    res.json(response.success)
});
//mostrar papelar del usuario
router.get("/api/files/trash", auth, async (req, res) => {
    console.log("usuario queriendo ver papelera " + req.user.id_user)
    let response = await getTrashUser(req.user.id_user)
    res.json(response)
});
// Proteger la visualizacion directa de archivos en la carpeta uploads
router.get("/uploads/:filename", auth, (req, res) => {
    // 1.  CORRECCIÓN: Extraer el nombre del archivo desde los parámetros de la URL
    const { filename } = req.params;

    // 2. Construir la ruta absoluta usando el __dirname que ya configuraste con ES Modules
    const pathFile = path.join(__dirname, "../uploads", filename);

    // 3. Enviar el archivo con una función callback para capturar posibles fallos (ej: que el archivo no exista)
    res.sendFile(pathFile, (err) => {
        if (err) {
            console.error("Error al enviar el archivo físico:", err);

            // Si el cliente canceló la petición antes de tiempo, no respondemos nada para evitar errores de headers
            if (res.headersSent) return;

            // Si el archivo no existe en el disco duro, devolvemos un 404 limpio en lugar de romper el servidor
            return res.status(404).json({
                ok: false,
                msg: "El archivo no existe en el servidor"
            });
        }
    });
});


export default router;