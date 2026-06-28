import { mostrarMensaje } from "./modalTexto.js";
import { fetchDataWithToken } from "./peticionServer.js";
const URL_API = "https://mivault.tailff2832.ts.net"

export function UploadFile(type) {
    const modal = document.getElementById('modalCard');
    const contenido = document.getElementById('modalCardContent');
    let typeMedia = "photo"
    if (type == "photo") {
        typeMedia = "image/*"

    } else if (type == "video") {
        typeMedia = "video/*"

    } else if (type == "doc") {
        typMedia = "application/pdf"
    }

    contenido.innerHTML = `
        <h2>Subir Archivo</h2>

        <div class="upload-area">

            <input type="file" id="file" hidden accept="${typeMedia}">

            <button id="selectFileBtn" class="btn-subir">Seleccionar Archivo</button>

            <span id="fileName" class="file-name">Ningún archivo seleccionado</span>

            <input type="text" id="newFileName" placeholder="Nuevo nombre (opcional)" class="rename-input">

            <label class="privacidad-label">Privacidad:</label>
            <select id="privacy" class="privacy-select">
                <option value="private">Privado</option>
                <option value="public">Público</option>
            </select>

            <button id="uploadBtn" class="btn-upload">Confirmar Subida</button>

            <div id="resultadoUpload"></div>
        </div>

        <button id="cerrarCardBtn" class="btn-close">Cerrar</button>
    `;

    modal.style.display = 'block';

    /* ---------------- CERRAR MODAL ---------------- */
    const closeModal = () => {
        modal.style.display = 'none';
        contenido.innerHTML = "";
    };

    document.getElementById('cerrarCardBtn').onclick = closeModal;
    document.getElementById('modalCardCerrar').onclick = closeModal;

    window.onclick = (e) => {
        if (e.target === modal) closeModal();
    };


    /* ---------------- OBTENER ELEMENTOS ---------------- */
    const fileInput = document.getElementById("file");
    const selectFileBtn = document.getElementById("selectFileBtn");
    const uploadBtn = document.getElementById("uploadBtn");
    const fileName = document.getElementById("fileName");
    const newFileName = document.getElementById("newFileName");
    const privacy = document.getElementById("privacy");


    /* -------------- ABRIR SELECTOR DE ARCHIVOS -------------- */
    selectFileBtn.addEventListener("click", () => fileInput.click());


    /* -------------- MOSTRAR NOMBRE DEL ARCHIVO -------------- */
    fileInput.addEventListener("change", () => {
        fileName.textContent = fileInput.files.length > 0
            ? fileInput.files[0].name
            : "Ningún archivo seleccionado";
    });


    /* ------------------- SUBIR ARCHIVO ------------------- */
    uploadBtn.addEventListener("click", async () => {
        const file = fileInput.files[0];



        if (!file) {
            mostrarMensaje("Por favor selecciona un archivo");
            return;
        }
        function detectTypeFile(file) {
            if (!file || !file.type) return "document";

            if (file.type.startsWith("image/")) {
                return "photo";
            }

            if (file.type.startsWith("video/")) {
                return "video";
            }

            return "document";
        }
        const typeFile = detectTypeFile(file)
        console.log("Tipo de archivo detectado:", typeFile);

        const formData = new FormData();
        // Privacidad
        formData.append("privacy", privacy.value);

        // Cambiar nombre
        if (newFileName.value.trim() !== "") {
            const extension = file.name.split('.').pop();
            const renamed = `${newFileName.value}.${extension}`;
            formData.append("file", file, renamed);
        } else {
            formData.append("file", file);
        }
        if (typeFile !== type) {
            mostrarMensaje(`Tipo de archivo incorrecto.`);
            return;
        }

        const response = await fetchDataWithToken(
            `${URL_API}/api/files/${type}/upload`,
            "POST",
            formData,
            true
        );

        closeModal();
        mostrarMensaje(response.msg || "error");
        document.getElementById("btnHomeDashboard").click();

    });
}
