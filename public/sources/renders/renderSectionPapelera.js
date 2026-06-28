import { fetchDataWithToken } from "../utils/peticionServer.js";

const BASE_URL = "https://mivault.tailff2832.ts.net";
const url_server = "https://mivault.tailff2832.ts.net/api/files/trash";

export async function renderPapelera() {
    try{
        const data = await fetchDataWithToken(url_server);
        const seccionTrash = document.getElementById("contentTrash");
        document.getElementById("header-dashboard-files-trash").innerHTML='<h2>Papelera</h2><p>Tus archivos eliminados.</p>'
        console.log("------------------------"+data)
        if (!seccionTrash) return;

        seccionTrash.innerHTML = "";
        console.log("------------------------"+data)

        if (!data || (!data.images.length && !data.videos.length && !data.documents.length)) {
            console.log("------------------------"+data)
            seccionTrash.innerHTML = `
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
                <img src="${BASE_URL + img.file_path_thumbnail}" alt="${img.file_name_image}" loading="lazy">
                <p class="title-file-dashboard">${img.file_name_image}</p>
                <p class="info-file-dashboard">Compartido por: ${img.owner_name}</p>
                <p class="date-file-dashboard">${new Date(img.created_at_image).toLocaleString()}.</p>

            `;
            seccionTrash.appendChild(card);
        });
        //crear separador
        const tarjetSpaceFromMedias = document.createElement("div");
        tarjetSpaceFromMedias.classList.add("separate-seccion-home");
        tarjetSpaceFromMedias.innerHTML = "<h2>Videos Eliminados<h2>"
        await seccionTrash.appendChild(tarjetSpaceFromMedias);



        // Renderizar Videos
        data.videos.forEach(video => {
            const card = document.createElement("div");
            card.classList.add("card-file-dashboard");
            card.innerHTML = `
                <span class="loader"  id="${"loaderVideo"+video.id_video}" style="display: none;">hpls</span>
                <input disabled type="checkbox" class="checkbox-delete-file" id="${video.id_video}" data-type="video">
                <div class="container-video-modal">
                    <img 
                        src="${BASE_URL + video.thumbnail_path_video}" alt="${video.file_name_video}"
                    >
                </div>
                <p class="title-file-dashboard">${video.file_name_video}</p>
                <p class="info-file-dashboard">Comparido por: ${video.owner_name}.</p>
                <p class="date-file-dashboard">${new Date(video.created_at_video).toLocaleString()}.</p>
            `;
            seccionTrash.appendChild(card);
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
            seccionTrash.appendChild(card);
        });
    }catch (error){
        console.error("Error al renderizar el pspelera:", error);
    }

}