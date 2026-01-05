import { fetchDataWithToken } from "../utils/peticionServer.js";

const BASE_URL = "http://192.168.0.240:3000";
const url_server = "http://192.168.0.240:3000/api/files/photo";

export async function renderPhotos() {

    const data = await fetchDataWithToken(url_server , "POST");
    const seccionFotos = document.getElementById("content-Fotos-dashboard");
    seccionFotos.classList.remove("content-Fotos-dashboard-delete");
    document.getElementById("btnCancelDelete").style.display = "none";

    seccionFotos.innerHTML = "";

    if (!data || !data.images.length) {

        seccionFotos.innerHTML = `
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
            <input disabled type="checkbox" class="checkbox-delete-file" id="${img.id_image}" data-type="image">
            <img src="${BASE_URL + img.file_path_image}" alt="${img.file_name_image}" with="100px" height="100px">
            <p class="title-file-dashboard">${img.file_name_image}</p>
        `;

        seccionFotos.appendChild(card);
    });

   
}