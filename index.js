import express from "express";
import routes from "./routes/routes.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
const app = express();
// Acepta peticiones solo local
app.use(cors({
    //origin: 'http://127.0.0.1:3000', 
    origin : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
dotenv.config();

const PORT = 3000;
const HOST = "0.0.0.0";

app.use(express.json());
app.use(express.static("public"));

// Middleware para proteger imágenes
app.use("/uploads", (req, res, next) => {
    const referer = req.get('Referer');
    const host = req.get('host'); // Detecta automáticamente si estás en localhost o en producción

    if (!referer || !referer.includes(host)) {
        return res.status(404).sendFile(path.resolve("public/404.html"));
    }

    // Si la petición viene de tu misma página, permitimos el acceso al siguiente middleware
    next();
}, express.static(path.resolve("uploads")));

// Rutas
app.use("/", routes);
//manejando el error 404 en las rutas
app.use((req, res) => {
    res.status(404);
    // Si la ruta que no existe empieza con "/api", respondemos con un JSON limpio
    if (req.originalUrl.startsWith('/api')) {
        return res.json({
            error: "404 Not Found",
            message: `El endpoint '${req.originalUrl}' no existe en este servidor.`
        });
    }
    // Si entraron desde el navegador a cualquier otra ruta loca, les mostramos el HTML
    res.sendFile(path.resolve("public/404.html"));
});
// Iniciar servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});