import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

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

export default router;