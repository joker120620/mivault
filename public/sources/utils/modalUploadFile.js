import { mostrarMensaje } from "./modalTexto.js";
import { fetchDataWithToken } from "./peticionServer.js";

export function UploadFile(type) {
    const modal = document.getElementById('modalCard');
    const contenido = document.getElementById('modalCardContent');

    contenido.innerHTML = `

        <style>
            
        </style>

        <h2>Subir Archivo</h2>

        <div class="upload-area">

            <input type="file" id="file" hidden>

            <button id="selectFileBtn" class="btn-subir">Seleccionar Archivo</button>

            <span id="fileName" class="file-name">Ningún archivo seleccionado</span>

            <input type="text" id="newFileName" placeholder="Nuevo nombre (opcional)" class="rename-input">

            <label class="privacidad-label">Privacidad:</label>
            <select id="privacy" class="privacy-select">
                <option value="public">Público</option>
                <option value="private">Privado</option>
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

        const formData = new FormData();

        // Cambiar nombre
        if (newFileName.value.trim() !== "") {
            const extension = file.name.split('.').pop();
            const renamed = `${newFileName.value}.${extension}`;
            formData.append("file", file, renamed);
        } else {
            formData.append("file", file);
        }

        // Privacidad
        formData.append("privacy", privacy.value);

        const response = await fetchDataWithToken(
            `http://localhost:3000/api/files/${type}/upload`,
            "POST",
            formData,
            true
        );

        closeModal();
        mostrarMensaje(response.msg);
    });
}
