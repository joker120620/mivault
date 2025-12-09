import express from "express";
import routes from "./routes/routes.js";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
app.use(cors());
dotenv.config();

const PORT = 3000;
const HOST = "0.0.0.0";

app.use(express.json());
app.use(express.static("public"));

// Rutas
app.use("/", routes);

// Iniciar servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});