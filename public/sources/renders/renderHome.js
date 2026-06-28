import { fetchData, fetchDataWithToken } from "../utils/peticionServer.js";

const BASE_URL = "https://mivault.tailff2832.ts.net";
const url_server = "https://mivault.tailff2832.ts.net/api/files/public";

const INTERVALO_ACTUALIZACION = 10000;

// Variable global al módulo para almacenar el ID del setInterval
let idIntervaloHome = null;

//Renderiza la sección de archivos públicos

export async function renderHome() {
    try {
        const data = await fetchDataWithToken(url_server);
        console.log(data)
        console.log("Archivos públicos actualizados:", data);

        const seccionHome = document.getElementById("contentHome");
        document.getElementById("header-dashboard-files").innerHTML='<h2>Descubrir</h2><p>Descubre los archivos que comparten las personas con el mundo.</p>'
        if (!seccionHome) return;

        seccionHome.innerHTML = "";

        if (!data || (!data.images.length && !data.videos.length && !data.documents.length)) {
            seccionHome.innerHTML = `
                <div class="card-file-empty">
                    <img src="https://cdn-icons-png.flaticon.com/512/5445/5445197.png" alt="imagen de archivo">
                    <p class="title-file-dashboard">No hay Nada</p>
                </div>
            `;
            return;
        }

        // Renderizar Imágenes
        data.images.forEach(img => {
            const card = document.createElement("div");
            card.classList.add("card-file-dashboard");
            card.innerHTML = `
                <span class="loader"  id="${"loaderImage"+img.id_image}" style="display: none;"></span>
                <input disabled type="checkbox" class="checkbox-delete-file" id="${img.id_image}" data-type="image">
                <img src="${BASE_URL + img.file_path_image}" alt="${img.file_name_image}" loading="lazy">
                <p class="title-file-dashboard">${img.file_name_image}</p>
                <p class="info-file-dashboard">Compartido por: ${img.owner_name}</p>
                <p class="date-file-dashboard">${new Date(img.created_at_image).toLocaleString()}.</p>

            `;
            seccionHome.appendChild(card);
        });
        //crear separador
        const tarjetSpaceFromMedias = document.createElement("div");
        tarjetSpaceFromMedias.classList.add("separate-seccion-home");
        tarjetSpaceFromMedias.innerHTML = "<h2>Videos publicos<h2>"
        await seccionHome.appendChild(tarjetSpaceFromMedias);



        // Renderizar Videos
        data.videos.forEach(video => {
            const card = document.createElement("div");
            card.classList.add("card-file-dashboard");
            card.innerHTML = `
                <span class="loader"  id="${"loaderVideo"+video.id_video}" style="display: none;">hpls</span>
                <input disabled type="checkbox" class="checkbox-delete-file" id="${video.id_video}" data-type="video">
                <div class="container-video-modal">
                    <video 
                        src="${BASE_URL + video.file_path_video}"
                        controlsList="nodownload noplaybackrate"
                        disablePictureInPicture
                        preload="metadata"
                        oncontextmenu="return false;"
                        
                    >
                    </video>
                </div>
                <p class="title-file-dashboard">${video.file_name_video}</p>
                <p class="info-file-dashboard">Comparido por: ${video.owner_name}.</p>
                <p class="date-file-dashboard">${new Date(video.created_at_video).toLocaleString()}.</p>
            `;
            seccionHome.appendChild(card);
        });

        // Renderizar Documentos
        data.documents.forEach(doc => {
            const card = document.createElement("div");
            card.classList.add("card-file-dashboard");
            card.innerHTML = `
                <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" class="doc-icon"/>
                <a href="${BASE_URL + doc.file_path_document}" target="_blank" class="title-file-dashboard">
                    ${doc.file_name_document}
                </a>
                <p class="info-file-dashboard">Compartido por: Usuario #${doc.user_id_document}</p>
            `;
            seccionHome.appendChild(card);
        });

    } catch (error) {
        console.error("Error al renderizar el Home:", error);
    }
}

//Inicia la carga del Home y activa el bucle en segundo plano
// // Si ya había un bucle activo, lo limpia primero para evitar duplicados.
export function initPollingHome() {
    // Seguridad: Limpiar cualquier intervalo previo por si acaso
    stopPollingHome();

    // Carga inicial inmediata
    renderHome();

    // Guardar la referencia del intervalo
    idIntervaloHome = setInterval(async () => {
        await renderHome();
    }, INTERVALO_ACTUALIZACION);
}


//Detiene por completo las peticiones en segundo plano del Home
//Debe ejecutarse cuando el usuario cambie de vista.
export function stopPollingHome() {
    if (idIntervaloHome !== null) {
        clearInterval(idIntervaloHome);
        idIntervaloHome = null;
    }
}