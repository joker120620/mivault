import { fetchDataWithToken } from "../utils/peticionServer.js";

const BASE_URL = "https://mivault.tailff2832.ts.net";
const url_server = "https://mivault.tailff2832.ts.net/api/files/video";

export async function renderVideos() {

    const data = await fetchDataWithToken(url_server, "POST");
    console.log("Videos privados:", data);
    const seccionVideos = document.getElementById("content-videos-dashboard");

    seccionVideos.innerHTML = "";
    if (!data || !data.videos.length) {

        seccionVideos.innerHTML = `
            <div class="card-file-empty">
                <img src="https://cdn-icons-png.flaticon.com/512/5445/5445197.png" alt="imagen de archivo">
                <p class="title-file-dashboard">No hay Nada</p>
            </div>
        `;
        return;
    }

    data.videos.forEach(vid => {

        const card = document.createElement("div");
        card.classList.add("card-file-dashboard");
        if (vid.duration_video > 60) {
            const minutes = Math.floor(vid.duration_video / 60);
            const seconds = vid.duration_video % 60;
            vid.duration_video = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        } else {
            vid.duration_video = `0:${vid.duration_video < 10 ? '0' + vid.duration_video : vid.duration_video}`;
        }

        card.innerHTML = `<div class="">
            <input disabled type="checkbox" class="checkbox-delete-file" id="${vid.id_video}" data-type="video">
                    <video src="${BASE_URL + vid.file_path_video}" style="width:100%; max-height:500px;" controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            oncontextmenu="return false;"
        >
        </video>
                    <p class="title-file-dashboard">${vid.file_name_video}</p>
                    <p class="info-file-dashboard">${vid.duration_video}</p>
                </div>
        `;

        seccionVideos.appendChild(card);
    });


}