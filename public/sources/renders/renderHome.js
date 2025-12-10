import { fetchData } from "../utils/peticionServer.js";

const BASE_URL = "http://localhost:3000";
const url_server = "http://localhost:3000/api/files/public";

export async function renderHome() {

    const data = await fetchData(url_server);
    const seccionHome = document.getElementById("contentHome");

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

    data.images.forEach(img => {

        const card = document.createElement("div");
        card.classList.add("card-file-dashboard");

        card.innerHTML = `
            <input disabled type="checkbox" class="checkbox-delete-file" id="${img.id_image}">
            <img src="${BASE_URL + img.file_path_image}" alt="${img.file_name_image}">
            <p class="title-file-dashboard">${img.file_name_image}</p>
            <p class="info-file-dashboard">Compartido por: Usuario #${img.owner_name}</p>
        `;

        seccionHome.appendChild(card);
    });

    data.videos.forEach(video => {

        const card = document.createElement("div");
        card.classList.add("card-file-dashboard");

        card.innerHTML = `
            <video controls>
                <source src="${BASE_URL + video.file_path_video}" type="${video.mime_type_video}">
            </video>
            <p class="title-file-dashboard">${video.file_name_video}</p>
            <p class="info-file-dashboard">Compartido por: Usuario #${video.user_id_video}</p>
        `;

        seccionHome.appendChild(card);
    });

   
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
}