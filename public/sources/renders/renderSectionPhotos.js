import { fetchDataWithToken } from "../utils/peticionServer.js";

const BASE_URL = "https://mivault.tailff2832.ts.net";
const url_server = "https://mivault.tailff2832.ts.net/api/files/photo";

export async function renderPhotos() {
    const seccionFotos = document.getElementById("content-Fotos-dashboard");
    seccionFotos.innerHTML = "";

    const data = await fetchDataWithToken(url_server, "POST");
    console.log("---------------------")
    console.log(data)
    console.log("---------------------")

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
        let stateImage = img.status_image
        if (stateImage !== "private") {
            stateImage = '<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#634FA2"><path d="M602.83-377.17q50.5-50.5 50.5-122.83t-50.5-122.83q-50.5-50.5-122.83-50.5t-122.83 50.5q-50.5 50.5-50.5 122.83t50.5 122.83q50.5 50.5 122.83 50.5t122.83-50.5ZM401.5-421.5q-32.17-32.17-32.17-78.5t32.17-78.5q32.17-32.17 78.5-32.17t78.5 32.17q32.17 32.17 32.17 78.5t-32.17 78.5q-32.17 32.17-78.5 32.17t-78.5-32.17Zm-186.17 139Q96.67-365 40-500q56.67-135 175.33-217.5Q334-800 480-800t264.67 82.5Q863.33-635 920-500q-56.67 135-175.33 217.5Q626-200 480-200t-264.67-82.5ZM480-500Zm217.5 169.83q99.17-63.5 151.17-169.83-52-106.33-151.17-169.83-99.17-63.5-217.5-63.5t-217.5 63.5Q163.33-606.33 110.67-500q52.66 106.33 151.83 169.83 99.17 63.5 217.5 63.5t217.5-63.5Z"/></svg>'
        } else {
            stateImage = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#634FA2"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>'
        }

        const card = document.createElement("div");
        card.classList.add("card-file-dashboard");

        card.innerHTML = `
            <span class="loader"  id="${"loaderImage"+img.id_image}" style="display: none;"></span>
            <input disabled type="checkbox" class="checkbox-delete-file" id="${img.id_image}" data-type="image">
            <img src="${BASE_URL + img.file_path_thumbnail}" alt="${img.file_name_image}" with="100px" height="100px">
            
                <p>${stateImage}<p>
                <p class="title-file-dashboard">${img.file_name_image}</p>
            
        `;

        seccionFotos.appendChild(card);
    });


}