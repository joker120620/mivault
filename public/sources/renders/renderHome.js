import { fetchData } from "../utils/peticionServer.js";
const url_server = "http://localhost:3000/api/files/public";
export async function renderHome (){
    const data = await fetchData(url_server);
    const seccionHome = document.getElementById("contentHome")
    console.log(data)
    seccionHome.innerHTML= "";
    if(!data ||  Object.keys(data).length === 0){
         const noneCard = `<div class="card-file-empty">
                    <img src="https://cdn-icons-png.flaticon.com/512/5445/5445197.png"
                        alt="imagen de archivo">
                    <p class="title-file-dashboard">No hay Nada</p>
                </div>`;
                seccionHome.innerHTML= noneCard;

    }
    const newCard = `<div class="card-file-dashboard">
                    <img src="https://th.bing.com/th/id/R.f72adb2f6bfbd298a909115d687467dc?rik=VJeMZxLn3VIvNA&riu=http%3a%2f%2f4.bp.blogspot.com%2f-MHHo9-USLVg%2fVUzwVljuhyI%2fAAAAAAAAAeE%2fCFX8DMUX004%2fs1600%2fMonte.jpg&ehk=OklMfnYTwQ7uyNrfbpi8UniBqcOxpDfOkibb%2bEGYc1o%3d&risl=&pid=ImgRaw&r=0"
                        alt="imagen de archivo">
                    <p class="title-file-dashboard">Paisaje Montañoso</p>
                    <p class="info-file-dashboard">Compartido por: Ana Gómez</p>
                </div>`;

}